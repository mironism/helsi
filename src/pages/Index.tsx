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
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <header className="bg-gradient-primary p-6 rounded-b-3xl shadow-card">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Helsi</h1>
              <p className="text-white/90 text-sm">Your health twin is learning</p>
            </div>
            <button
              onClick={handleResetDemo}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-white/80 text-xs font-semibold">XP</span>
              </div>
              <p className="text-2xl font-bold text-white">{user.xp}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-white/80 text-xs font-semibold">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white animate-flicker">
                🔥 {user.streak}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
              {/* Avatar Card with Nature Background */}
              <div className="bg-card rounded-3xl shadow-card overflow-hidden">
                {/* Nature Background Scene */}
                <div className="relative bg-gradient-to-b from-sky-200 to-green-100 p-6 pb-8">
                  {/* Sky & Clouds */}
                  <div className="absolute top-4 right-8 opacity-60">
                    <div className="text-4xl">☁️</div>
                  </div>
                  <div className="absolute top-8 left-12 opacity-40">
                    <div className="text-3xl">☁️</div>
                  </div>

                  {/* Sun */}
                  <div className="absolute top-4 left-4">
                    <div className="text-3xl">☀️</div>
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center relative z-10 pt-4">
                    <ImmuneAvatar
                      state={avatarState.state}
                      color={avatarState.color}
                      scale={avatarState.scale}
                      size={140}
                      avatarType={user.avatarType}
                    />
                  </div>

                  {/* Ground with grass and trees */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-4 pb-2">
                    <div className="text-2xl">🌳</div>
                    <div className="text-xl">🌿</div>
                    <div className="text-2xl">🌲</div>
                    <div className="text-xl">🌱</div>
                  </div>
                </div>

                {/* Text Section */}
                <div className="p-5 text-center">
                  <h2 className="text-lg font-bold mb-2">Your Health Twin</h2>
                  <p className="text-sm text-muted-foreground">
                    {(avatarState.state === 'Happy' || avatarState.state === 'Energized') && "Feeling great today! 😊"}
                    {avatarState.state === 'Neutral' && "Feeling steady 👍"}
                    {(avatarState.state === 'Low' || avatarState.state === 'Tired') && "Needs some care 💙"}
                  </p>
                </div>
              </div>

              {/* Latest Insight */}
              {latestInsight && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-secondary text-secondary-foreground rounded-3xl shadow-card p-6"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Latest Insight</h3>
                      <p className="text-sm leading-relaxed">{latestInsight}</p>
                      <p className="text-xs mt-2 opacity-80">
                        Confidence: {confidence.level} • {confidence.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLoggingModalOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-accent text-accent-foreground rounded-full shadow-energized flex items-center justify-center hover:shadow-2xl transition-all z-40"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

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
