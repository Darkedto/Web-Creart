import { CSSProperties } from 'react';

interface TapeStripProps {
  color?: string;
  width?: number;
  rotate?: string;
  style?: CSSProperties;
}

export function TapeStrip({
  color = 'var(--yellow)',
  width = 60,
  rotate = '-3deg',
  style,
}: TapeStripProps) {
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height: 18,
        background: color,
        transform: `rotate(${rotate})`,
        opacity: 0.85,
        boxShadow: '1px 1px 0 rgba(0,0,0,0.15)',
        ...style,
      }}
    />
  );
}
