interface ThemePickerProps {
    themes: string[];
    onSelectTheme: (theme: string) => void;
}

const ThemePicker = ({ themes, onSelectTheme }: ThemePickerProps) => {
    return (
        <div className="flex-auto grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 content-start p-4 rounded-lg bg-base-200">
            {themes.map((theme) => (
                <button
                    key={theme}
                    className="group flex flex-col gap-1.5 p-2 rounded-lg transition-colors hover:bg-base-100"
                    onClick={() => onSelectTheme(theme)}
                    type="button"
                >
                    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={theme}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                            <div className="rounded bg-primary"></div>
                            <div className="rounded bg-secondary"></div>
                            <div className="rounded bg-accent"></div>
                            <div className="rounded bg-neutral"></div>
                        </div>
                    </div>
                    <span className="text-[11px] font-medium truncate w-full text-center">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ThemePicker;
