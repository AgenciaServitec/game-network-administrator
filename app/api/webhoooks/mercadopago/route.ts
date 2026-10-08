import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const paymentId = body?.data?.id || req.nextUrl.searchParams.get('data.id') || req.nextUrl.searchParams.get('id');

        if (!paymentId) {
            return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
        }

        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        if (paymentInfo.status === 'approved') {
            const orderId = paymentInfo.external_reference;

            const { data: order, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (fetchError || !order) {
                console.error('Orden no encontrada en base de datos:', orderId);
                return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
            }

            if (order.status === 'pending') {

                await supabase
                    .from('orders')
                    .update({ status: 'paid' })
                    .eq('id', orderId);

                console.log(`¡Pago confirmado! Preparando inyección de ${order.product_code} para el ID ${order.player_id}...`);

            } else {
                console.log(`La orden ${orderId} ya fue procesada anteriormente.`);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}