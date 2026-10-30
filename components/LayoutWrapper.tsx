'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    return (
        <>
            {!isLogin && <Header />}

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {!isLogin && <Footer />}
        </>
    );
}