'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Receipt, ArrowLeft, CreditCard, AlertTriangle } from 'lucide-react';
import { Card, Button } from '@/components/ui';

type StatusType = 'success' | 'failure' | 'pending';

const statusConfig = {
    success: {
        colorClass: 'text-success',
        bgClass: 'bg-success',
        borderClass: 'border-success',
        icon: CheckCircle2,
        title: '¡PAGO EXITOSO!',
        description: 'HEMOS RECIBIDO TU PAGO CORRECTAMENTE. NUESTRO SISTEMA AUTOMÁTICO YA ESTÁ INYECTANDO LOS DIAMANTES EN TU CUENTA.',
        footerIcon: CheckCircle2,
        footerText: 'ENTREGA COMPLETADA O EN PROCESO INMEDIATO',
    },
    failure: {
        colorClass: 'text-destructive',
        bgClass: 'bg-destructive',
        borderClass: 'border-destructive',
        icon: XCircle,
        title: 'PAGO RECHAZADO',
        description: 'LO SENTIMOS, NO PUDIMOS PROCESAR TU PAGO. NO TE PREOCUPES, NO SE HA REALIZADO NINGÚN CARGO EN TU CUENTA.',
        footerIcon: AlertTriangle,
        footerText: 'INTENTA CON OTRO MÉTODO DE PAGO',
    },
    pending: {
        colorClass: 'text-primary',
        bgClass: 'bg-primary',
        borderClass: 'border-primary',
        icon: Clock,
        title: 'PAGO EN REVISIÓN',
        description: 'TU PAGO ESTÁ SIENDO PROCESADO POR MERCADO PAGO. LOS DIAMANTES SE INYECTARÁN AUTOMÁTICAMENTE APENAS SE APRUEBE.',
        footerIcon: Clock,
        footerText: 'TE NOTIFICAREMOS EL RESULTADO POR CORREO',
    }
};

function StatusContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const slug = (params.slug as StatusType) || 'failure';
    const currentStatus = statusConfig[slug] || statusConfig.failure;

    const paymentId = searchParams.get('payment_id') || 'N/A';
    const statusParams = searchParams.get('status') || slug.toUpperCase();

    const Icon = currentStatus.icon;
    const FooterIcon = currentStatus.footerIcon;

    return (
        <Card className="max-w-lg w-full mx-auto p-8 text-center relative overflow-hidden border-2 border-border bg-card shadow-2xl">
            <div className={`absolute top-0 left-0 w-full h-3 ${currentStatus.bgClass}`}></div>

            <div className="flex justify-center mb-8 mt-4">
                <div className={`p-4 border-4 ${currentStatus.borderClass} ${currentStatus.colorClass} bg-background`}>
                    <Icon className="w-16 h-16" strokeWidth={3} />
                </div>
            </div>

            <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 ${currentStatus.colorClass}`}>
                {currentStatus.title}
            </h1>

            <p className="text-muted font-bold uppercase tracking-widest text-sm mb-10 leading-relaxed">
                {currentStatus.description}
            </p>

            <div className="bg-background border-2 border-border p-6 mb-10 text-left relative">
                <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    DETALLES DE TRANSACCIÓN
                </div>

                <div className="space-y-4 text-sm font-bold uppercase tracking-widest mt-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-border pb-3 gap-2">
                        <span className="text-muted">ESTADO DE RED:</span>
                        <span className={`font-black ${currentStatus.colorClass} bg-background px-3 py-1 border-2 ${currentStatus.borderClass}`}>
                            {statusParams}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1 gap-2">
                        <span className="text-muted">ID REFERENCIA:</span>
                        <span className="font-mono text-foreground font-black text-base">{paymentId}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted text-xs font-black uppercase tracking-widest mb-8">
                <FooterIcon className={`w-4 h-4 ${currentStatus.colorClass}`} />
                {currentStatus.footerText}
            </div>

            <div className="flex flex-col gap-4">
                {slug === 'failure' && (
                    <Link href="/#catalogo" className="w-full">
                        <Button variant="primary" className="w-full py-5 text-base font-black tracking-widest">
                            <CreditCard className="w-5 h-5 mr-3" /> INTENTAR OTRA VEZ
                        </Button>
                    </Link>
                )}

                <Link href="/" className="w-full">
                    <Button variant={slug === 'failure' ? 'secondary' : 'primary'} className="w-full py-5 text-base font-black tracking-widest">
                        <ArrowLeft className="w-5 h-5 mr-3" /> VOLVER AL INICIO
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

export default function StatusPage() {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-20 bg-background selection:bg-primary selection:text-black min-h-[80vh]">
            <Suspense fallback={
                           <div className="text-primary font-black uppercase tracking-widest animate-pulse flex flex-col items-center gap-4">
                              <Clock className="w-10 h-10 animate-spin" />
                              CARGANDO RECIBO...
                          </div>
                      }>
                <StatusContent />
            </Suspense>
        </div>
    );
}