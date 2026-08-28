import { motion } from 'framer-motion';

export default function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) {
  const base =
    'relative font-display text-lg tracking-wide px-8 py-3 rounded-[2px] transition-colors focus-ring select-none';
  const variants = {
    primary:
      'bg-wine text-ivory shadow-paper border border-gold/40 hover:bg-wine-light disabled:opacity-40 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent text-wine border border-wine/30 hover:bg-wine/5 disabled:opacity-40',
    gold: 'bg-gradient-to-b from-gold-light to-gold text-ink shadow-glow border border-gold-dark/40',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {/* corner ornament, referencing letter-seal wax corners rather than a generic button */}
      <span className="pointer-events-none absolute -top-1 -left-1 h-2 w-2 rounded-full bg-gold-light/70" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-gold-light/70" />
      {children}
    </motion.button>
  );
}
