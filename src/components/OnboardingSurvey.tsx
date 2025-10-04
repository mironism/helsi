import { useState } from 'react';
import { motion } from 'framer-motion';

interface SurveyAnswers {
  sleepQuality: string;
  fatigueFrequency: string;
  tracksHealth: string;
  mainGoal: string;
}

interface OnboardingSurveyProps {
  onComplete: (answers: SurveyAnswers, avatarType: 'Explorer' | 'Calm' | 'Charger') => void;
}

export const OnboardingSurvey = ({ onComplete }: OnboardingSurveyProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<'Explorer' | 'Calm' | 'Charger'>('Explorer');

  const questions = [
    {
      question: "How's your average sleep quality?",
      key: 'sleepQuality' as const,
      options: ['Good', 'Fair', 'Poor'],
    },
    {
      question: "How often do you feel fatigued?",
      key: 'fatigueFrequency' as const,
      options: ['Rarely', 'Sometimes', 'Often'],
    },
    {
      question: "Do you track health data?",
      key: 'tracksHealth' as const,
      options: ['Yes', 'No', 'Sometimes'],
    },
    {
      question: "What's your main health goal?",
      key: 'mainGoal' as const,
      options: ['Energy', 'Sleep', 'Mood', 'Understanding patterns'],
    },
  ];

  const avatarTypes = [
    { type: 'Explorer' as const, emoji: '🔍', desc: 'Curious & Data-Driven' },
    { type: 'Calm' as const, emoji: '🧘', desc: 'Balanced & Mindful' },
    { type: 'Charger' as const, emoji: '⚡', desc: 'High-Energy & Active' },
  ];

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[step];
    setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }));
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // Move to avatar selection
    }
  };

  const handleComplete = () => {
    onComplete(answers as SurveyAnswers, selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-3xl shadow-card p-8 max-w-md w-full"
      >
        {step < questions.length ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Question {step + 1} of {questions.length}
              </p>
            </div>

            {/* Question */}
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                {questions[step].question}
              </h2>

              <div className="space-y-3">
                {questions[step].options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 rounded-2xl bg-muted hover:bg-primary hover:text-primary-foreground font-semibold transition-all text-left shadow-sm"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          // Avatar Selection
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-2">Pick your Immune Twin!</h2>
            <p className="text-muted-foreground mb-6">
              Choose the avatar that best represents you
            </p>

            <div className="space-y-3 mb-8">
              {avatarTypes.map((avatar) => (
                <motion.button
                  key={avatar.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAvatar(avatar.type)}
                  className={`w-full p-4 rounded-2xl font-semibold transition-all text-left shadow-sm flex items-center gap-4 ${
                    selectedAvatar === avatar.type
                      ? 'bg-primary text-primary-foreground shadow-button'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-4xl">{avatar.emoji}</span>
                  <div>
                    <div className="font-bold">{avatar.type}</div>
                    <div className="text-sm opacity-80">{avatar.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-button hover:shadow-lg transition-all"
            >
              Start Your Journey! 🚀
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
