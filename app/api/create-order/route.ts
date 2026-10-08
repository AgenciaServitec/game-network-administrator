import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { playerId, nickname, productCode, price } = body;

        if (!playerId || !productCode || !price) {
            return NextResponse.json({ error: 'Faltan datos de la orden' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .insert([
                {
                    player_id: playerId,
                    nickname: nickname,
                    product_code: productCode,
                    price: price,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        const preference = new Preference(client);

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const mpResponse = await preference.create({
            body: {
                items: [
                    {
                        id: productCode,
                        title: `Recarga Free Fire - ${nickname}`,
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'PEN',
                    }
                ],
                external_reference: order.id,
                back_urls: {
                    success: `https://tudominio.com/success`,
                    failure: `https://tudominio.com/failure`,
                    pending: `https://tudominio.com/pending`,
                },
                auto_return: 'approved',
            }
        });
        return NextResponse.json({
            success: true,
            initPoint: mpResponse.sandbox_init_point || mpResponse.init_point
        });

    } catch (error) {
        console.error('Error creando orden y preferencia:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}