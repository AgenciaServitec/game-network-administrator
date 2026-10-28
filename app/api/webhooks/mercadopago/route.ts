import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
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

            console.log(`¡Pago confirmado! Conectando con Codestore para inyectar al ID ${order.player_id}...`);

            const [type, productId, sku] = order.product_code.split('___');

            const apiKey = process.env.CODESTORE_API_KEY!;
            const secretKey = process.env.CODESTORE_SECRET_KEY!;
            const method = 'POST';
            const targetPath = '/v1/orders/recharge';
            const timestamp = Date.now().toString();

            const payloadObj = {
                productId: productId,
                sku: sku,
                quantity: 1,
                partnerOrderId: String(orderId),
                playerId: String(order.player_id),
                zoneId: ''
            };

            const stringifiedBody = JSON.stringify(payloadObj);

            const signaturePayload = `${timestamp}.${method}.${targetPath}.${stringifiedBody}`;
            const signature = crypto
                .createHmac('sha256', secretKey)
                .update(signaturePayload)
                .digest('hex');

            const apiResponse = await fetch(`https://api.codestore.app${targetPath}`, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'x-timestamp': timestamp,
                    'x-signature': signature,
                    'Content-Type': 'application/json'
                },
                body: stringifiedBody
            });

            const apiData = await apiResponse.json();

            if (apiResponse.ok && apiData.success === true) {
                await supabase.from('orders').update({
                    status: 'paid',
                    provider_status: `Codestore: Procesando (ID: ${apiData.data?.orderId || 'OK'})`
                }).eq('id', orderId);

                console.log(`¡Inyección Exitosa en Codestore!`);
            } else {
                await supabase.from('orders').update({
                    status: 'failed_injection',
                    provider_status: `Error: ${apiData.message || 'Desconocido'}`
                }).eq('id', orderId);

                console.error(`Error de Codestore:`, apiData.message);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}