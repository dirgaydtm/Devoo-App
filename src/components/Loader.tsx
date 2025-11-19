const Loader = () => {
    const cellColors = [
        'bg-primary', 'bg-primary/90', 'bg-linear-to-br from-primary/80 to-secondary/40',
        'bg-primary/70', 'bg-linear-to-br from-primary/60 to-secondary/60', 'bg-secondary/70',
        'bg-linear-to-br from-primary/40 to-secondary/80', 'bg-secondary/90', 'bg-secondary'
    ];

    const delays = [0, 100, 200, 100, 200, 200, 300, 300, 400];

    return (
        <div className="flex flex-wrap w-[calc(3*(52px+2*1px))] h-[calc(3*(52px+2*1px))]">
            {cellColors.map((color, index) => (
                <div
                    key={index}
                    className={`flex-[0_0_52px] m-px box-border rounded animate-ripple ${color}`}
                    style={{
                        animationDelay: `${delays[index]}ms`,
                    }}
                />
            ))}
            <style>{`
        @keyframes ripple {
          0%, 60%, 100% { opacity: 0; }
          30% { opacity: 1; }
        }
        .animate-ripple {
          animation: ripple 1.5s ease infinite;
        }
      `}</style>
        </div>
    );
};

export default Loader;
