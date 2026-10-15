import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { playerId, gameCode } = body;

        if (!playerId) {
            return NextResponse.json({ error: 'Player ID es requerido' }, { status: 400 });
        }

        const apiKey = process.env.FAZERCARDS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Falta la API Key en el servidor' }, { status: 500 });
        }


        const categoryId = gameCode === 'freefire' ? 'free_fire' : gameCode;

        const response = await fetch('https://api.fzr.cards/api/v2/topups/validate-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({
                category_id: categoryId,
                fields: {
                    player_id: playerId
                }
            })
        });

        const data = await response.json();

        if (data.ok) {
            const nickname = data.name || data.player_name || data.result?.name || data.data?.name || 'Cuenta Verificada';

            return NextResponse.json({
                success: true,
                nickname: nickname,
            });
        }

        return NextResponse.json({
            success: false,
            error: data.error || 'ID de jugador no encontrado'
        }, { status: 404 });

    } catch (error) {
        console.error('Error validando ID con FazerCards:', error);
        return NextResponse.json({ error: 'Error de conexión con el proveedor' }, { status: 500 });
    }
}