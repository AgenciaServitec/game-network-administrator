import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'mercadoPago';
    isLoading?: boolean;
}

export function Button({
                           children,
                           variant = 'primary',
                           isLoading,
                           className = '',
                           disabled,
                           ...props
                       }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide px-4 py-3";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-[#eab308]",
        secondary: "bg-card text-foreground border border-border hover:border-muted",
        mercadoPago: "bg-[#009EE3] text-white hover:bg-[#008ACA]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
}