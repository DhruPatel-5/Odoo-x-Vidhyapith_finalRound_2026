/**
 * ShineBorder.jsx
 * Animated conic-gradient border glow effect.
 * Usage: Wrap key dashboard cards, ECO pending status, admin alerts.
 *
 * Props:
 *   colors   — array of CSS colors for the gradient (default: blue/purple)
 *   borderWidth — px width of the shine border (default: 2)
 *   duration    — animation duration in seconds (default: 4)
 *   className   — extra classes for the outer wrapper
 *   children    — inner content
 */
const ShineBorder = ({
  children,
  colors = ['#0077B6', '#7C3AED', '#00B4D8'],
  borderWidth = 2,
  duration = 4,
  className = '',
}) => {
  const gradient = `conic-gradient(from var(--shine-angle), ${colors.join(', ')}, ${colors[0]})`;

  return (
    <div
      className={`shine-border-wrap relative rounded-2xl ${className}`}
      style={{
        padding: borderWidth,
        background: gradient,
        '--shine-duration': `${duration}s`,
      }}
    >
      {/* Match .glass-card (index.css) — never use solid bg-white or it kills the shine + glass look */}
      <div
        className="relative h-full rounded-[14px] overflow-hidden border border-white/[0.12]
                   bg-white/[0.07] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]"
      >
        {children}
      </div>
    </div>
  );
};

export default ShineBorder;
