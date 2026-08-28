import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_MB = 8;

export default function MemoryUpload({ preview, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Please keep photos under ${MAX_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(file, reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-sm">
      <p className="mb-1 font-display text-2xl text-wine">A memorable photo</p>
      <p className="mb-3 font-body text-sm text-ink/60">Optional — it becomes part of your letter.</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`focus-ring relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[3px] border-2 transition-colors ${
          dragOver ? 'border-saffron bg-saffron/5' : 'border-dashed border-gold/50 bg-ivory-dim'
        }`}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.img
              key="photo"
              src={preview}
              alt="Your memory"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-center px-4"
            >
              {/* simple polaroid-style placeholder frame, not a stock illustration */}
              <svg width="48" height="40" viewBox="0 0 48 40">
                <rect x="1" y="1" width="46" height="38" rx="2" fill="#FFF7E8" stroke="#D4A84F" strokeWidth="2" />
                <rect x="6" y="6" width="36" height="22" fill="#EFDDBB" />
                <circle cx="15" cy="17" r="3" fill="#D4A84F" />
                <path d="M8 26 L18 18 L26 24 L34 14 L40 26 Z" fill="#B08A38" opacity="0.6" />
              </svg>
              <p className="font-body text-sm text-ink/60">Drop a photo here, or tap to choose one</p>
            </motion.div>
          )}
        </AnimatePresence>

        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(null, null);
            }}
            className="focus-ring absolute right-2 top-2 rounded-full bg-ink/70 px-3 py-1 font-body text-xs text-ivory hover:bg-ink"
          >
            Remove
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 font-body text-sm text-wine">{error}</p>}
    </div>
  );
}
