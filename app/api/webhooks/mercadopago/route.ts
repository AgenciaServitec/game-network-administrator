import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

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

            console.log(`¡Pago confirmado! Conectando con FazerCards para inyectar ${order.product_code} al ID ${order.player_id}...`);

            const apiKey = process.env.FAZERCARDS_API_KEY!;

            const payloadObj = {
                category_id: "free_fire_latam",
                offer_id: order.product_code,
                fields: {
                    "player_id": String(order.player_id)
                }
            };

            const apiResponse = await fetch('https://api.fzr.cards/api/v2/topups/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Idempotency-Key': String(orderId)
                },
                body: JSON.stringify(payloadObj)
            });

            const apiData = await apiResponse.json();

            if (apiResponse.ok && apiData.ok === true) {
                await supabase.from('orders').update({
                    status: 'paid',
                    provider_status: `FazerCards: Inyección iniciada (ID: ${apiData.order?.id || 'OK'})`
                }).eq('id', orderId);

                console.log(`¡Inyección Exitosa en FazerCards!`);
            } else {
                await supabase.from('orders').update({
                    status: 'failed_injection',
                    provider_status: `Error: ${apiData.error || 'Desconocido'} (Code: ${apiData.code || 'N/A'})`
                }).eq('id', orderId);

                console.error(`Error de FazerCards:`, apiData.error);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}