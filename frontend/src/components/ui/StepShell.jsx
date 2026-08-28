import { motion } from 'framer-motion';
import GuideCharacter from '../guide/GuideCharacter.jsx';
import Button from './Button.jsx';

export default function StepShell({ children, onNext, nextLabel = 'Next', nextDisabled, hideNext }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-ivory px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full flex-col items-center"
      >
        {children}

        {!hideNext && (
          <div className="mt-10 flex items-center gap-3">
            <GuideCharacter size={36} />
            <Button onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
