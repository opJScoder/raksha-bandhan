export default function TextInput({ label, value, onChange, placeholder, maxLength = 40, autoFocus }) {
  return (
    <label className="block w-full max-w-sm">
      <span className="mb-2 block font-display text-xl text-wine">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className="w-full rounded-[2px] border-b-2 border-gold/50 bg-transparent px-1 py-2 font-body text-lg text-ink placeholder:text-ink/30 focus-ring focus:border-wine"
      />
    </label>
  );
}
