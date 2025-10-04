import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    food?: string;
    sleep?: string;
    mood?: string;
    stress?: string;
    supplements?: string;
  }) => void;
}

export const LoggingModal = ({ isOpen, onClose, onSubmit }: LoggingModalProps) => {
  const [logData, setLogData] = useState<{
    food?: string;
    sleep?: string;
    mood?: string;
    stress?: string;
    supplements?: string;
  }>({});

  const categories = [
    {
      label: 'Food',
      key: 'food' as const,
      options: [
        { emoji: '🥗', value: 'Clean' },
        { emoji: '🍕', value: 'Gluten' },
        { emoji: '🍪', value: 'Sugar' },
        { emoji: '🍺', value: 'Alcohol' },
      ],
    },
    {
      label: 'Sleep',
      key: 'sleep' as const,
      options: [
        { emoji: '😴', value: 'Good' },
        { emoji: '😵', value: 'Poor' },
      ],
    },
    {
      label: 'Mood',
      key: 'mood' as const,
      options: [
        { emoji: '😊', value: 'Happy' },
        { emoji: '😐', value: 'Neutral' },
        { emoji: '😔', value: 'Low' },
      ],
    },
    {
      label: 'Stress',
      key: 'stress' as const,
      options: [
        { emoji: '😌', value: 'Low' },
        { emoji: '😬', value: 'Medium' },
        { emoji: '🔥', value: 'High' },
      ],
    },
    {
      label: 'Supplements',
      key: 'supplements' as const,
      options: [
        { emoji: '💊', value: 'Taken' },
        { emoji: '❌', value: 'Skipped' },
      ],
    },
  ];

  const handleSelect = (key: string, value: string) => {
    setLogData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Check if user logged "bad" data but was honest
    const hasNegativeData = logData.mood === 'Low' || logData.stress === 'High' || logData.sleep === 'Poor' || logData.food === 'Alcohol' || logData.supplements === 'Skipped';
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: hasNegativeData ? ['#FF6B6B', '#4ECDC4', '#45B7D1'] : ['#58CC02', '#1CB0F6', '#FF9600'],
    });

    onSubmit(logData);
    setLogData({});
    setTimeout(() => onClose(), 500);
  };

  const filledCount = Object.keys(logData).filter(k => logData[k as keyof typeof logData]).length;
  const canSubmit = filledCount > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[2rem] shadow-2xl z-50 max-h-[75vh] overflow-y-auto pb-safe"
          >
            <div className="p-6 pb-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">How are you feeling?</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.key}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      {category.label}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {category.options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelect(category.key, option.value)}
                          className={`
                            flex-1 min-w-[70px] px-4 py-3 rounded-2xl font-semibold
                            transition-all shadow-sm
                            ${
                              logData[category.key] === option.value
                                ? 'bg-primary text-primary-foreground shadow-button scale-105'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                            }
                          `}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="text-xs">{option.value}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`
                  w-full mt-8 py-4 rounded-2xl font-bold text-lg
                  transition-all shadow-button
                  ${
                    canSubmit
                      ? 'bg-primary text-primary-foreground hover:shadow-lg'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {filledCount === 5 ? (
                  '✨ Submit (+30 XP Bonus!)'
                ) : canSubmit ? (
                  `Submit (+${10 + (filledCount === 5 ? 20 : 0)} XP)`
                ) : (
                  'Select at least one'
                )}
              </motion.button>

              {filledCount === 5 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-accent font-semibold mt-2"
                >
                  🎉 All categories filled! Bonus XP activated!
                </motion.p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
