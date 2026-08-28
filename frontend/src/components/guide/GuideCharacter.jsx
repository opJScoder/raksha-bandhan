import { motion } from 'framer-motion';

/**
 * A small handcrafted golden-ladoo-inspired guide.
 * Rendered as a self-contained SVG so it can be scaled, glowed, and
 * animated (travel, bounce, squash/stretch) from any parent.
 */
export default function GuideCharacter({ size = 64, mood = 'idle', className = '' }) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={
        mood === 'excited'
          ? { y: [0, -6, 0], scaleX: [1, 1.05, 1], scaleY: [1, 0.95, 1] }
          : { y: [0, -3, 0] }
      }
      transition={{ duration: mood === 'excited' ? 0.6 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* soft ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: 'radial-gradient(circle, rgba(228,199,132,0.55), transparent 70%)' }}
      />
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative drop-shadow-md">
        <defs>
          <radialGradient id="ladooBody" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#F6D98A" />
            <stop offset="55%" stopColor="#D4A84F" />
            <stop offset="100%" stopColor="#B08A38" />
          </radialGradient>
          <radialGradient id="ladooShine" cx="30%" cy="25%" r="30%">
            <stop offset="0%" stopColor="#FFF3D0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFF3D0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* body */}
        <circle cx="50" cy="54" r="34" fill="url(#ladooBody)" />
        {/* textured bumps, like a real ladoo */}
        {[[30, 40], [66, 38], [40, 70], [62, 68], [50, 28], [22, 58], [78, 58]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4.2" fill="#B08A38" opacity="0.35" />
        ))}
        <circle cx="50" cy="54" r="34" fill="url(#ladooShine)" />

        {/* tiny festive tilak/dot decoration */}
        <circle cx="50" cy="24" r="3" fill="#6E1737" opacity="0.85" />

        {/* eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.92, 0.95, 1] }}
          style={{ transformOrigin: '50px 54px' }}
        >
          <circle cx="41" cy="54" r="3.2" fill="#3B241C" />
          <circle cx="59" cy="54" r="3.2" fill="#3B241C" />
          <circle cx="42.2" cy="52.8" r="1" fill="#FFF7E8" />
          <circle cx="60.2" cy="52.8" r="1" fill="#FFF7E8" />
        </motion.g>

        {/* soft blush */}
        <ellipse cx="34" cy="62" rx="4.5" ry="2.6" fill="#E9A6A9" opacity="0.55" />
        <ellipse cx="66" cy="62" rx="4.5" ry="2.6" fill="#E9A6A9" opacity="0.55" />

        {/* smile */}
        <path d="M43 63 Q50 69 57 63" stroke="#3B241C" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>

      {/* sparkles */}
      <motion.span
        className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gold-light"
        animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="absolute bottom-1 -left-2 h-1.5 w-1.5 rounded-full bg-saffron-light"
        animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
      />
    </motion.div>
  );
}
