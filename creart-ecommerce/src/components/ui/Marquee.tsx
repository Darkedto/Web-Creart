interface MarqueeProps {
  text: string;
  bg?: string;
  color?: string;
  height?: number;
  speed?: number;
}

export function Marquee({
  text,
  bg = 'var(--ink)',
  color = 'var(--yellow)',
  height = 52,
  speed = 30,
}: MarqueeProps) {
  const repeated = text.repeat(4);

  return (
    <div
      style={{
        background: bg,
        color,
        height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderTop: '3px solid var(--ink)',
        borderBottom: '3px solid var(--ink)',
      }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `marquee ${speed}s linear infinite`,
          fontFamily: 'var(--fdisp)',
          fontSize: 24,
          letterSpacing: '0.04em',
        }}
      >
        <span style={{ paddingRight: 24 }}>{repeated}</span>
        <span style={{ paddingRight: 24 }}>{repeated}</span>
      </div>
    </div>
  );
}
