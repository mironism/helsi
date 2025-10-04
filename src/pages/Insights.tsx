import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Moon, Brain, Activity, Calendar, Target } from 'lucide-react';
import { getLogs, getUser } from '@/lib/storage';
import { getConfidenceLevel } from '@/lib/gamification';

const Insights = () => {
  const user = getUser();
  const logs = getLogs();
  const confidence = getConfidenceLevel();

  // Calculate insights from data
  const insights = useMemo(() => {
    if (logs.length < 2) {
      return {
        recovery: 0,
        strain: 0,
        sleepScore: 0,
        trends: [],
        recommendations: [],
      };
    }

    // Calculate recovery score (0-100) based on recent logs
    const recentLogs = logs.slice(-7); // Last 7 days
    const goodSleep = recentLogs.filter(l => l.sleep === 'Good').length;
    const lowStress = recentLogs.filter(l => l.stress === 'Low').length;
    const happyMood = recentLogs.filter(l => l.mood === 'Happy').length;

    const recovery = Math.round(((goodSleep + lowStress + happyMood) / (recentLogs.length * 3)) * 100);

    // Calculate strain score (0-21 scale like WHOOP)
    const highStress = recentLogs.filter(l => l.stress === 'High').length;
    const poorSleep = recentLogs.filter(l => l.sleep === 'Poor').length;
    const strain = Math.min(21, Math.round((highStress * 2 + poorSleep * 1.5) * 1.5));

    // Sleep score
    const sleepScore = Math.round((goodSleep / recentLogs.length) * 100);

    // Detect trends
    const trends = [];

    if (goodSleep >= 5) {
      trends.push({
        icon: Moon,
        title: 'Strong Sleep Pattern',
        value: `${goodSleep}/7 days`,
        trend: 'up' as const,
        color: 'text-energized',
      });
    } else if (poorSleep >= 3) {
      trends.push({
        icon: Moon,
        title: 'Sleep Needs Attention',
        value: `${poorSleep} poor nights`,
        trend: 'down' as const,
        color: 'text-low',
      });
    }

    if (lowStress >= 5) {
      trends.push({
        icon: Brain,
        title: 'Stress Under Control',
        value: `${lowStress}/7 days`,
        trend: 'up' as const,
        color: 'text-energized',
      });
    }

    if (happyMood >= 5) {
      trends.push({
        icon: Activity,
        title: 'Positive Mood Streak',
        value: `${happyMood}/7 days`,
        trend: 'up' as const,
        color: 'text-happy',
      });
    }

    // Generate recommendations
    const recommendations = [];

    if (sleepScore < 60) {
      recommendations.push({
        title: 'Prioritize Sleep',
        description: 'Your sleep quality is impacting recovery. Try going to bed 30min earlier.',
        priority: 'high' as const,
      });
    }

    if (highStress >= 3) {
      recommendations.push({
        title: 'Reduce Strain',
        description: 'High stress detected multiple times. Consider meditation or light activity.',
        priority: 'medium' as const,
      });
    }

    if (recovery > 80) {
      recommendations.push({
        title: 'Optimal Recovery',
        description: "You're recovered! This is a great day for challenging activities.",
        priority: 'low' as const,
      });
    }

    return { recovery, strain, sleepScore, trends, recommendations };
  }, [logs]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <header className="bg-gradient-secondary p-6 rounded-b-3xl shadow-card">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Insights</h1>
          <p className="text-white/80 text-sm">
            Based on {logs.length} data points • {confidence.level} confidence
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {logs.length < 2 ? (
          <div className="bg-card rounded-3xl shadow-card p-8 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Start Logging to See Insights</h2>
            <p className="text-muted-foreground">
              Log your health data for a few days to unlock personalized insights and trends.
            </p>
          </div>
        ) : (
          <>
            {/* Recovery Score - WHOOP Style */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-3xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recovery Score</h2>
                <Zap className="w-5 h-5 text-accent" />
              </div>

              <div className="flex items-end gap-4 mb-4">
                <div className="text-5xl font-bold">{insights.recovery}%</div>
                <div className={`flex items-center gap-1 mb-2 ${
                  insights.recovery >= 70 ? 'text-energized' :
                  insights.recovery >= 40 ? 'text-accent' : 'text-low'
                }`}>
                  {insights.recovery >= 70 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="text-sm font-semibold">
                    {insights.recovery >= 70 ? 'Excellent' : insights.recovery >= 40 ? 'Moderate' : 'Low'}
                  </span>
                </div>
              </div>

              {/* Recovery Bar */}
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.recovery}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${
                    insights.recovery >= 70 ? 'bg-energized' :
                    insights.recovery >= 40 ? 'bg-accent' : 'bg-low'
                  }`}
                />
              </div>

              <p className="text-sm text-muted-foreground mt-3">
                Based on sleep quality, stress levels, and mood over the last 7 days
              </p>
            </motion.div>

            {/* Strain & Sleep Scores */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl shadow-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-low" />
                  <h3 className="text-sm font-semibold text-muted-foreground">Strain</h3>
                </div>
                <div className="text-3xl font-bold">{insights.strain}</div>
                <p className="text-xs text-muted-foreground mt-1">Scale 0-21</p>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl shadow-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-semibold text-muted-foreground">Sleep</h3>
                </div>
                <div className="text-3xl font-bold">{insights.sleepScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Quality score</p>
              </motion.div>
            </div>

            {/* Trends */}
            {insights.trends.length > 0 && (
              <div className="bg-card rounded-3xl shadow-card p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  7-Day Trends
                </h2>
                <div className="space-y-3">
                  {insights.trends.map((trend, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 bg-muted rounded-2xl"
                    >
                      <trend.icon className={`w-5 h-5 ${trend.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{trend.title}</div>
                        <div className="text-xs text-muted-foreground">{trend.value}</div>
                      </div>
                      {trend.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-energized" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-low" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
              <div className="bg-card rounded-3xl shadow-card p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Recommendations
                </h2>
                <div className="space-y-3">
                  {insights.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`p-4 rounded-2xl border-l-4 ${
                        rec.priority === 'high' ? 'bg-low/10 border-low' :
                        rec.priority === 'medium' ? 'bg-accent/10 border-accent' :
                        'bg-energized/10 border-energized'
                      }`}
                    >
                      <h3 className="font-bold mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Insights;
