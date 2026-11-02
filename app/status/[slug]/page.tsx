'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Receipt, ArrowLeft, CreditCard, AlertTriangle, Crosshair } from 'lucide-react';

type StatusType = 'success' | 'failure' | 'pending';

const statusConfig = {
    success: {
        colorClass: 'text-[#00e5ff]',
        bgClass: 'bg-[#00e5ff]',
        borderClass: 'border-[#00e5ff]',
        shadowClass: 'shadow-[8px_8px_0px_#00e5ff]',
        glowClass: 'from-[#00e5ff]/30 via-[#00e5ff]/10 to-transparent',
        icon: CheckCircle2,
        tag: 'TRANSACCIÓN',
        tagState: 'COMPLETADA',
        title: '¡PAGO EXITOSO!',
        description: 'HEMOS RECIBIDO TU PAGO CORRECTAMENTE. NUESTRO SISTEMA AUTOMÁTICO YA ESTÁ INYECTANDO LOS DIAMANTES EN TU CUENTA.',
        footerIcon: CheckCircle2,
        footerText: 'ENTREGA COMPLETADA O EN PROCESO INMEDIATO',
    },
    failure: {
        colorClass: 'text-[#ff2a1f]',
        bgClass: 'bg-[#ff2a1f]',
        borderClass: 'border-[#ff2a1f]',
        shadowClass: 'shadow-[8px_8px_0px_#ff2a1f]',
        glowClass: 'from-[#ff2a1f]/35 via-[#ff6b00]/15 to-transparent',
        icon: XCircle,
        tag: 'TRANSACCIÓN',
        tagState: 'FALLIDA',
        title: 'PAGO RECHAZADO',
        description: 'LO SENTIMOS, NO PUDIMOS PROCESAR TU PAGO. NO TE PREOCUPES, NO SE HA REALIZADO NINGÚN CARGO EN TU CUENTA.',
        footerIcon: AlertTriangle,
        footerText: 'INTENTA CON OTRO MÉTODO DE PAGO',
    },
    pending: {
        colorClass: 'text-primary',
        bgClass: 'bg-primary',
        borderClass: 'border-primary',
        shadowClass: 'shadow-[8px_8px_0px_#ffb703]',
        glowClass: 'from-[#ffb703]/30 via-[#ff7b00]/15 to-transparent',
        icon: Clock,
        tag: 'TRANSACCIÓN',
        tagState: 'EN REVISIÓN',
        title: 'PAGO EN REVISIÓN',
        description: 'TU PAGO ESTÁ SIENDO PROCESADO POR MERCADO PAGO. LOS DIAMANTES SE INYECTARÁN AUTOMÁTICAMENTE APENAS SE APRUEBE.',
        footerIcon: Clock,
        footerText: 'TE NOTIFICAREMOS EL RESULTADO POR CORREO',
    }
};

const primaryBtn =
    'group w-full inline-flex items-center justify-center py-5 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm md:text-base uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer';

const secondaryBtn =
    'group w-full inline-flex items-center justify-center py-5 bg-[#070609] hover:bg-white/10 text-white font-black text-sm md:text-base uppercase tracking-[0.18em] border-2 border-white/20 hover:border-primary shadow-[6px_6px_0px_#1f1a29] hover:shadow-[2px_2px_0px_#1f1a29] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer';

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
        <div className={`max-w-lg w-full mx-auto p-8 text-center relative overflow-hidden border-2 ${currentStatus.borderClass} bg-[#110f16] ${currentStatus.shadowClass} z-10`}>
            <div className={`absolute top-0 left-0 w-full h-3 ${currentStatus.bgClass}`}></div>
            <div className={`absolute top-3 right-0 w-3 h-3 ${currentStatus.bgClass}`}></div>

            <div className="flex justify-center mb-6 mt-4">
                <div className={`inline-flex items-center gap-3 bg-[#120e17] border-2 ${currentStatus.borderClass} px-4 py-1.5 -skew-x-12`}>
                    <span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                        <Crosshair className={`w-3.5 h-3.5 animate-spin ${currentStatus.colorClass}`} style={{ animationDuration: '8s' }} />
                        {currentStatus.tag} — <span className={currentStatus.colorClass}>{currentStatus.tagState}</span>
                    </span>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <div className={`p-4 border-4 ${currentStatus.borderClass} ${currentStatus.colorClass} bg-[#070609] -skew-x-6`}>
                    <Icon className="w-16 h-16 skew-x-6" strokeWidth={3} />
                </div>
            </div>

            <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-[4px_4px_0px_#000000] ${currentStatus.colorClass}`}>
                {currentStatus.title}
            </h1>

            <div className={`pl-4 border-l-4 ${currentStatus.borderClass} mb-10 bg-black/40 py-2 pr-4 text-left`}>
                <p className="text-zinc-300 font-bold uppercase tracking-widest text-xs md:text-sm leading-relaxed">
                    {currentStatus.description}
                </p>
            </div>

            <div className="bg-[#070609] border-2 border-white/15 p-6 mb-10 text-left relative">
                <div className="absolute -top-3 left-4 bg-[#070609] px-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#ff2a1f]" />
                    DETALLES DE TRANSACCIÓN
                </div>

                <div className="space-y-4 text-sm font-bold uppercase tracking-widest mt-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-white/10 pb-3 gap-2">
                        <span className="text-zinc-400 text-xs">ESTADO DE RED:</span>
                        <span className={`font-black text-xs ${currentStatus.colorClass} bg-[#070609] px-3 py-1 border-2 ${currentStatus.borderClass}`}>
                            {statusParams}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1 gap-2">
                        <span className="text-zinc-400 text-xs">ID REFERENCIA:</span>
                        <span className="font-mono text-white font-black text-base break-all">{paymentId}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <FooterIcon className={`w-4 h-4 ${currentStatus.colorClass}`} />
                {currentStatus.footerText}
            </div>

            <div className="flex flex-col gap-5">
                {slug === 'failure' && (
                    <Link href="/#catalogo" className={primaryBtn}>
                        <CreditCard className="w-5 h-5 mr-3" /> INTENTAR OTRA VEZ
                    </Link>
                )}

                <Link href="/" className={slug === 'failure' ? secondaryBtn : primaryBtn}>
                    <ArrowLeft className="w-5 h-5 mr-3 stroke-[3] group-hover:-translate-x-1 transition-transform" /> VOLVER AL INICIO
                </Link>
            </div>
        </div>
    );
}

export default function StatusPage() {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-20 bg-[#070609] selection:bg-[#ff2a1f] selection:text-white min-h-[80vh] relative overflow-hidden bg-halftone">
            <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

            <div className="absolute -top-4 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
                <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
                    RECIBO
                </span>
            </div>

            <div className="absolute right-[5%] bottom-[10%] w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full blur-[130px] pointer-events-none z-0 bg-gradient-to-tr from-[#ff2a1f]/25 via-[#ffb703]/15 to-[#00e5ff]/10" />

            <Suspense fallback={
                           <div className="text-primary font-black uppercase tracking-[0.3em] animate-pulse flex flex-col items-center gap-4 relative z-10">
                              <Clock className="w-10 h-10 animate-spin" />
                              CARGANDO RECIBO...
                          </div>
                      }>
                <StatusContent />
            </Suspense>
        </div>
    );
}