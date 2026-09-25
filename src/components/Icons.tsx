// Thin-line SVG icons. Unicode glyphs like ▶ or ✕ render as colour emoji on iOS,
// which breaks the look, so every UI icon goes through here.
type P = { className?: string; size?: number };
const svg = (size: number, className: string | undefined, children: React.ReactNode, fill = false) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

export const PlayIcon = ({ className, size = 14 }: P) => svg(size, className, <path d="M7 4.5v15l12.5-7.5z" />, true);
export const PauseIcon = ({ className, size = 14 }: P) => svg(size, className, <path d="M7 4.5h3.2v15H7zM13.8 4.5H17v15h-3.2z" />, true);
export const CloseIcon = ({ className, size = 18 }: P) => svg(size, className, <path d="M5 5l14 14M19 5L5 19" />);
export const HeartIcon = ({ className, size = 20, filled = false }: P & { filled?: boolean }) =>
  svg(size, className, <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />, filled);
export const ShareIcon = ({ className, size = 18 }: P) => svg(size, className, <path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4" />);
export const CheckIcon = ({ className, size = 14 }: P) => svg(size, className, <path d="M5 12.5l4.5 4.5L19 7.5" />);
export const ArrowUpIcon = ({ className, size = 18 }: P) => svg(size, className, <path d="M12 19V5M6 11l6-6 6 6" />);
export const ArrowDownIcon = ({ className, size = 18 }: P) => svg(size, className, <path d="M12 5v14M6 13l6 6 6-6" />);
