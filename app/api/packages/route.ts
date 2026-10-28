import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.CODESTORE_API_KEY!;

        const response = await fetch('https://api.codestore.app/v1/catalog', {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error al obtener el catálogo');
        }

        const freeFirePackage = data.data.catalog.find((pkg: any) =>
            pkg?.packageName?.includes('Free Fire LATAM')
        );

        if (!freeFirePackage) {
            return NextResponse.json({ success: true, packages: [] });
        }

        const exchangeRate = 3.80;
        const profitMargin = 1.35;

        const formattedPackages = freeFirePackage.products
            .filter((product: any) => product.inStock)
            .map((product: any) => {

                const finalPricePEN = (product.price * exchangeRate) * profitMargin;

                let codeType = 'diamonds';
                const nameLower = product.name.toLowerCase();

                if (nameLower.includes('semanal')) codeType = 'weekly';
                else if (nameLower.includes('mensual')) codeType = 'monthly';
                else if (nameLower.includes('pase') || nameLower.includes('level')) codeType = 'pass';

                return {
                    code: `${codeType}___${product.productId}___${product.sku}`,
                    name: product.name,
                    price: Number(finalPricePEN.toFixed(2)),
                    originalPrice: Number((finalPricePEN * 1.15).toFixed(2))
                };
            });

        return NextResponse.json({
            success: true,
            packages: formattedPackages
        });

    } catch (error: any) {
        console.error('Error obteniendo catálogo de Codestore:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}