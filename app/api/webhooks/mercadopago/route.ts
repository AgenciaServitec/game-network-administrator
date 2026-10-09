import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        // 1. Filtrar solo los eventos de pago reales
        const topic = req.nextUrl.searchParams.get('topic') || req.nextUrl.searchParams.get('type');
        if (topic !== 'payment') {
            return NextResponse.json({ success: true, message: 'Evento ignorado' }, { status: 200 });
        }

        const body = await req.json().catch(() => ({}));
        const paymentId = body?.data?.id || req.nextUrl.searchParams.get('data.id') || req.nextUrl.searchParams.get('id');

        if (!paymentId) {
            return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
        }

        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        if (paymentInfo.status === 'approved') {
            const orderId = paymentInfo.external_reference;

            const { data: order, error: updateError } = await supabase
                .from('orders')
                .update({ status: 'processing' })
                .eq('id', orderId)
                .eq('status', 'pending')
                .select()
                .single();

            if (updateError || !order) {
                console.log(`La orden ${orderId} ya fue procesada. Inyección doble bloqueada en seco.`);
                return NextResponse.json({ success: true, message: 'Orden ya procesada' }, { status: 200 });
            }

            console.log(`¡Pago confirmado! Conectando con Apigames para inyectar ${order.product_code} al ID ${order.player_id}...`);

            if (order.status === 'pending') {

                await supabase.from('orders').update({ status: 'processing' }).eq('id', orderId);
                console.log(`¡Pago confirmado! Conectando con Apigames para inyectar ${order.product_code} al ID ${order.player_id}...`);

                const merchantId = process.env.APIGAMES_MERCHANT_ID!;
                const secretKey = process.env.APIGAMES_SECRET_KEY!;

                const signatureStr = `${merchantId}:${secretKey}:${orderId}`;
                const signature = crypto.createHash('md5').update(signatureStr).digest('hex');

                const apigamesPayload = {
                    ref_id: orderId,
                    merchant_id: merchantId,
                    produk: order.product_code,
                    tujuan: order.player_id,
                    server_id: "",
                    signature: signature
                };

                const apiResponse = await fetch('https://v1.apigames.id/v2/transaksi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apigamesPayload)
                });

                const apiData = await apiResponse.json();

                if (apiData.status === 1) {
                    await supabase.from('orders').update({
                        status: 'paid',
                        provider_status: apiData.data?.status || 'Procesado'
                    }).eq('id', orderId);

                    console.log(`¡Inyección Exitosa! Estado en proveedor: ${apiData.data?.status}`);
                } else {
                    await supabase.from('orders').update({
                        status: 'failed_injection',
                        provider_status: apiData.error_msg
                    }).eq('id', orderId);

                    console.error(`Error de Apigames: ${apiData.error_msg}`);
                }

            } else {
                console.log(`La orden ${orderId} ya no está pendiente (Estado actual: ${order.status}). Se omite la inyección.`);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}