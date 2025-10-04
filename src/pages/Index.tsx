import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, TrendingUp, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { ImmuneAvatar } from '@/components/ImmuneAvatar';
import { LoggingModal } from '@/components/LoggingModal';
import { OnboardingSurvey } from '@/components/OnboardingSurvey';
import {
  getUser,
  createUser,
  addLog,
  seedDemoData,
  resetDemo,
  type User,
} from '@/lib/storage';
import {
  calculateXPGain,
  updateStreak,
  addXP,
  getAvatarState,
  generateInsight,
  getConfidenceLevel,
  getLeaderboard,
} from '@/lib/gamification';
import { toast } from 'sonner';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [avatarState, setAvatarState] = useState(getAvatarState());
  const [latestInsight, setLatestInsight] = useState<string>('');

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setAvatarState(getAvatarState());
      setLatestInsight(generateInsight());
    } else {
      setShowSurvey(true);
    }
    setIsLoading(false);

    // Listen for modal open event from bottom nav
    const handleOpenModal = () => setIsLoggingModalOpen(true);
    window.addEventListener('openLoggingModal', handleOpenModal);
    return () => window.removeEventListener('openLoggingModal', handleOpenModal);
  }, []);

  const handleSurveyComplete = (
    answers: User['surveyAnswers'],
    avatarType: User['avatarType']
  ) => {
    const newUser = createUser(answers, avatarType);
    setUser(newUser);
    setShowSurvey(false);
    toast.success('Welcome to Helsi! 🎉');
  };

  const handleLogSubmit = (logData: any) => {
    const xpGain = calculateXPGain(logData);
    addLog(logData);
    addXP(xpGain.total);
    const streakStatus = updateStreak();

    const updatedUser = getUser();
    setUser(updatedUser);
    setAvatarState(getAvatarState());
    setLatestInsight(generateInsight());

    // Check if user logged "bad" but honest data
    const hasNegativeData = logData.mood === 'Low' || logData.stress === 'High' || logData.sleep === 'Poor' || logData.food === 'Alcohol' || logData.supplements === 'Skipped';

    if (xpGain.bonus > 0) {
      if (hasNegativeData) {
        toast.success(`🎉 ${xpGain.reason} +${xpGain.total} XP!`, {
          description: 'Honest logging is the first step to improvement! 💪',
        });
      } else {
        toast.success(`🎉 ${xpGain.reason} +${xpGain.total} XP!`, {
          description: 'All categories logged! Bonus activated!',
        });
      }
    } else {
      if (hasNegativeData) {
        toast.success(`+${xpGain.total} XP earned!`, {
          description: 'Thanks for being honest - that takes courage! 🌟',
        });
      } else {
        toast.success(`+${xpGain.total} XP earned!`);
      }
    }

    if (streakStatus.current > 1 && !streakStatus.broken) {
      toast.success(`🔥 ${streakStatus.current} day streak!`);
    }
  };

  const handleSeedDemo = () => {
    seedDemoData();
    const demoUser = getUser();
    setUser(demoUser);
    setAvatarState(getAvatarState());
    setLatestInsight(generateInsight());
    toast.success('Demo data loaded! Explore the perfect journey 🚀');
  };

  const handleResetDemo = () => {
    resetDemo();
    setUser(null);
    setShowSurvey(true);
    toast.info('Demo reset. Start fresh! ♻️');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (showSurvey) {
    return <OnboardingSurvey onComplete={handleSurveyComplete} />;
  }

  if (!user) return null;

  const confidence = getConfidenceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 relative overflow-hidden flex flex-col">
      {/* Decorative Nature Elements - Full Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Clouds floating around - moved lower */}
        <div className="absolute top-24 right-20 opacity-50 animate-pulse">
          <div className="text-5xl">☁️</div>
        </div>
        <div className="absolute top-32 left-16 opacity-40">
          <div className="text-4xl">☁️</div>
        </div>
        <div className="absolute top-48 right-32 opacity-30">
          <div className="text-3xl">☁️</div>
        </div>

        {/* Sun - moved lower */}
        <div className="absolute top-20 left-8">
          <div className="text-5xl">☀️</div>
        </div>

        {/* Birds - moved lower */}
        <div className="absolute top-44 right-1/4 opacity-60">
          <div className="text-2xl">🐦</div>
        </div>
      </div>

      {/* Header - Prominent Stats */}
      <header className="relative z-10 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-12 bg-white/25 backdrop-blur-md rounded-3xl px-8 py-6 mx-4 shadow-2xl">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-400" />
                <span className="text-sm text-white/90 font-semibold">XP</span>
              </div>
              <p className="text-3xl font-bold text-white">{user.xp}</p>
            </div>
            <div className="w-px h-12 bg-white/40"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                <span className="text-sm text-white/90 font-semibold">Streak</span>
              </div>
              <p className="text-3xl font-bold text-white animate-flicker">
                🔥 {user.streak}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Takes remaining space and centers avatar */}
      <main className="flex-1 flex items-center justify-center relative z-10 -mt-8">
        {/* Avatar - Centered and Large */}
        <div className="flex justify-center">
          <ImmuneAvatar
            state={avatarState.state}
            color={avatarState.color}
            scale={avatarState.scale}
            size={280}
            avatarType={user.avatarType}
          />
        </div>
      </main>

      {/* Latest Insight - Sticky Bottom with more spacing */}
      {latestInsight && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-32 left-0 right-0 z-40 px-4"
        >
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-foreground/90 font-medium">{latestInsight}</p>
                <p className="text-xs mt-1 text-foreground/60">
                  {confidence.level} confidence • {confidence.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* Logging Modal */}
      <LoggingModal
        isOpen={isLoggingModalOpen}
        onClose={() => setIsLoggingModalOpen(false)}
        onSubmit={handleLogSubmit}
      />
    </div>
  );
};

export default Index;
