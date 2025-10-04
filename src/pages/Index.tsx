import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard'>('home');

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
    toast.success('Welcome to The Immune Graph! 🎉');
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

    if (xpGain.bonus > 0) {
      toast.success(`🎉 ${xpGain.reason} +${xpGain.total} XP!`, {
        description: 'All categories logged! Bonus activated!',
      });
    } else {
      toast.success(`+${xpGain.total} XP earned!`);
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

  const leaderboard = getLeaderboard();
  const confidence = getConfidenceLevel();

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <header className="bg-gradient-primary p-6 rounded-b-3xl shadow-card">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">The Immune Graph</h1>
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
        {/* Tab Navigation */}
        <div className="flex gap-2 bg-background rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-primary text-primary-foreground shadow-button'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Twin Home
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-primary text-primary-foreground shadow-button'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Leaderboard
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Avatar Card */}
              <div className="bg-card rounded-3xl shadow-card p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Your Immune Twin</h2>
                <div className="flex justify-center mb-4">
                  <ImmuneAvatar
                    state={avatarState.state}
                    color={avatarState.color}
                    scale={avatarState.scale}
                    size={140}
                  />
                </div>
                <p className="text-muted-foreground">
                  {avatarState.state === 'Happy' && "Your twin feels great today! 😊"}
                  {avatarState.state === 'Energized' && "Wow! Your twin is energized! ⚡"}
                  {avatarState.state === 'Neutral' && "Your twin is feeling steady 👍"}
                  {avatarState.state === 'Low' && "Your twin needs some care 💙"}
                  {avatarState.state === 'Tired' && "Your twin is tired. Rest up! 😴"}
                </p>
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

              {/* Demo Controls */}
              <div className="bg-card rounded-3xl shadow-card p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Demo Controls
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleSeedDemo}
                    className="flex-1 py-3 bg-gradient-accent text-accent-foreground rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    View Perfect Journey
                  </button>
                  <button
                    onClick={handleResetDemo}
                    className="flex-1 py-3 bg-muted text-foreground rounded-2xl font-semibold hover:bg-muted/80 transition-all"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-3xl shadow-card p-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-accent" />
                Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl flex items-center gap-4 ${
                      entry.id === user.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-2xl font-bold text-muted-foreground w-8">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.xp} XP • 🔥 {entry.streak} days
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        {entry.consistencyScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Consistency Score = days logged + (complete logs × 0.5)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLoggingModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-accent text-accent-foreground rounded-full shadow-energized flex items-center justify-center hover:shadow-2xl transition-all"
      >
        <Plus className="w-8 h-8" />
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
