import { NextResponse } from "next/server";

export async function GET(){
    try {
        const apiKey = process.env.FAZERCARDS_API_KEY;

        const response = await fetch('https://api.fzr.cards/api/v2/topups/offers?category_id=free_fire_latam', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        const data = await response.json();

        if  (!data.ok) throw new Error('Error al obtener catalogo');

        const exchangeRate = 3.75;
        const profitMargin = 1.35;

        const formattedPackages = data.offers.map((offer : any) =>({
            code : offer.offer_id,
            name: offer.name,
            price: parseFloat(offer.price_usd) * exchangeRate * profitMargin,
        }))

        return NextResponse.json({ success: true, packages: formattedPackages });
    } catch (error) {
        console.error('Error fetching packages:', error);
        return NextResponse.json({ success: false, packages: [] }, { status: 500 });
    }
}