import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Slug requerido' }, { status: 400 });
        }

        const { data: gameConfig, error: gameError } = await supabase
            .from('games_config')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (gameError || !gameConfig) {
            return NextResponse.json({ success: false, error: 'Juego no encontrado' });
        }

        const { data: productConfigs } = await supabase
            .from('product_config')
            .select('*')
            .eq('game_slug', slug)
            .eq('is_active', true);

        const configMap = new Map();
        if (productConfigs) {
            productConfigs.forEach(p => configMap.set(p.product_code, p.price_pen));
        }

        const apiKey = process.env.CODESTORE_API_KEY!;
        const response = await fetch('https://api.codestore.app/v1/catalog', {
            method: 'GET',
            headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error('Error al obtener catálogo de Codestore');

        const codestorePackage = data.data.catalog.find((pkg: any) =>
            pkg?.packageName === gameConfig.codestore_match
        );

        if (!codestorePackage) {
            return NextResponse.json({ success: true, packages: [] });
        }

        const formattedPackages = codestorePackage.products
            .filter((product: any) => product.inStock)
            .map((product: any) => {
                const nameLower = product.name.toLowerCase();
                let codeType = 'diamonds';
                if (nameLower.includes('semanal') || nameLower.includes('weekly')) codeType = 'weekly';
                else if (nameLower.includes('mensual') || nameLower.includes('monthly')) codeType = 'monthly';
                else if (nameLower.includes('pase') || nameLower.includes('level') || nameLower.includes('pass')) codeType = 'pass';

                const productCode = `${codeType}___${product.productId}___${product.sku}`;

                if (configMap.has(productCode)) {
                    const finalPrice = configMap.get(productCode);
                    return {
                        code: productCode,
                        name: product.name,
                        price: Number(finalPrice),
                        originalPrice: Number((finalPrice * 1.15).toFixed(2))
                    };
                }
                return null;
            })
            .filter(Boolean);

        formattedPackages.sort((a: any, b: any) => a.price - b.price);

        return NextResponse.json({
            success: true,
            packages: formattedPackages
        });

    } catch (error) {
        console.error('Error en api/packages:', error);
        return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
    }
}