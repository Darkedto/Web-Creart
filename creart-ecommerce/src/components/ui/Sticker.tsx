import { CSSProperties, ReactNode } from 'react';

interface StickerProps {
  children: ReactNode;
  color?: string;
  rotate?: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function Sticker({
  children,
  color = 'var(--yellow)',
  rotate = '-4deg',
  size = 16,
  style,
  className,
}: StickerProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        background: color,
        color: 'var(--ink)',
        fontFamily: 'var(--fdisp2)',
        fontSize: size,
        padding: '4px 10px',
        transform: `rotate(${rotate})`,
        border: '2px solid var(--ink)',
        boxShadow: '2px 2px 0 var(--ink)',
        letterSpacing: '0.05em',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
