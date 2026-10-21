import {NextResponse} from "next/server";

interface Offer {
    offer_id: string;
    name: string;
    price_usd: string | number;
}

export async function GET(){
    try {
        const apiKey = process.env.FAZERCARDS_API_KEY;
        let exchangeRate = 3.44;

        try {
            const rateResponse = await fetch('https://open.er-api.com/v6/latest/USD', {
                next: { revalidate: 3600 }
            });
            const rateData = await rateResponse.json();
            if (rateData?.rates?.PEN) {
                exchangeRate = rateData.rates.PEN;
            }
        } catch (rateError) {
            console.warn('Usando TC de respaldo:', rateError);
        }

        const response = await fetch('https://api.fzr.cards/api/v2/topups/offers?category_id=free_fire_latam', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        const data = await response.json();
        if (!data.ok) throw new Error('Error al obtener catalogo');

        const getProfitMargin = (priceUsd: number) => {
            if (priceUsd < 1.00) return 1.20;
            if (priceUsd < 5.00) return 1.15;
            if (priceUsd < 15.00) return 1.18;
            return 1.12;
        };

        const offersMap = new Map<string, Offer>(
            data.offers.map((o: Offer) => [o.offer_id, o])
        );

        const calculatePrice = (offerId: string) => {
            const offer = offersMap.get(offerId);
            if (!offer) return null;

            const usdPrice = typeof offer.price_usd === 'number'
                ? offer.price_usd
                : parseFloat(offer.price_usd);

            const dynamicMargin = getProfitMargin(usdPrice);

            return Math.ceil(Number((usdPrice * exchangeRate * dynamicMargin).toFixed(2)));
        };

        const compareMap: Record<string, string> = {
            '110_diamonds': '100_diamonds',
            '572_diamonds': '530_diamonds',
            '1166_diamonds': '1080_diamonds',
            '2398_diamonds': '2200_diamonds'
        };

        const excludedIds = ['100_diamonds', '210_diamonds', '530_diamonds', '1080_diamonds', '2200_diamonds'];

        const formattedPackages = [];

        for (const offer of data.offers as Offer[]) {
            if (excludedIds.includes(offer.offer_id)) continue;

            const basePrice = calculatePrice(offer.offer_id);
            if (!basePrice) continue;

            let originalPrice = null;

            if (compareMap[offer.offer_id]) {
                const badPrice = calculatePrice(compareMap[offer.offer_id]);
                if (badPrice && badPrice > basePrice) {
                    originalPrice = badPrice;
                }
            }

            formattedPackages.push({
                code: offer.offer_id,
                name: offer.name,
                price: basePrice,
                originalPrice: originalPrice
            });
        }

        return NextResponse.json({ success: true, packages: formattedPackages });
    } catch (error) {
        console.error('Error fetching packages:', error);
        return NextResponse.json({ success: false, packages: [] }, { status: 500 });
    }
}