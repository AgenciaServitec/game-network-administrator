import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto-js';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { playerId, gameCode = 'freefire' } = body;

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID es requerido' }, { status: 400 });
        }

        const merchantId = process.env.APIGAMES_MERCHANT_ID;
        const secretKey = process.env.APIGAMES_SECRET_KEY;
        const baseUrl = process.env.APIGAMES_BASE_URL;

        if (!merchantId || !secretKey || !baseUrl) {
            return NextResponse.json({ error: 'Faltan credenciales en el servidor' }, { status: 500 });
        }

        const signatureRaw = `${merchantId}${secretKey}`;
        const signatureMd5 = crypto.MD5(signatureRaw).toString();

        const apigamesUrl = `${baseUrl}/merchant/${merchantId}/cek-username/${gameCode}?user_id=${playerId}&signature=${signatureMd5}`;

        const response = await fetch(apigamesUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (data.status === 1 && data.data?.is_valid) {
            return NextResponse.json({
                success: true,
                nickname: data.data.username,
            });
        }

        return NextResponse.json({ success: false, error: 'ID de jugador no encontrado' }, { status: 404 });

    } catch (error) {
        console.error('Error validando ID:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}