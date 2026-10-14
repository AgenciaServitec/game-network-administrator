export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-card border border-border rounded-xl shadow-2xl p-6 ${className}`}>
            {children}
        </div>
    );
}