import { User, Log, getUser, saveUser, getLogs } from './storage';

export interface XPGain {
  base: number;
  bonus: number;
  total: number;
  reason: string;
}

export interface StreakStatus {
  current: number;
  broken: boolean;
  lastLogDate: string | null;
}

export const calculateXPGain = (log: Omit<Log, 'id' | 'userId' | 'timestamp'>): XPGain => {
  const base = 10;
  const categoriesFilled = [log.food, log.sleep, log.mood, log.stress, log.supplements].filter(Boolean).length;
  const bonus = categoriesFilled === 5 ? 20 : 0;
  
  return {
    base,
    bonus,
    total: base + bonus,
    reason: bonus > 0 ? 'All categories filled!' : 'Log submitted',
  };
};

export const updateStreak = (): StreakStatus => {
  const user = getUser();
  if (!user) throw new Error('No user found');

  const now = new Date();
  const today = now.toDateString();
  
  if (!user.lastLogDate) {
    // First log ever
    user.streak = 1;
    user.lastLogDate = now.toISOString();
  } else {
    const lastLog = new Date(user.lastLogDate);
    const lastLogDay = lastLog.toDateString();
    
    if (lastLogDay === today) {
      // Already logged today, no streak change
      return {
        current: user.streak,
        broken: false,
        lastLogDate: user.lastLogDate,
      };
    }
    
    const daysSinceLastLog = Math.floor((now.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastLog === 1) {
      // Consecutive day
      user.streak += 1;
      user.lastLogDate = now.toISOString();
    } else if (daysSinceLastLog > 1) {
      // Streak broken
      user.streak = 1;
      user.lastLogDate = now.toISOString();
      saveUser(user);
      return {
        current: 1,
        broken: true,
        lastLogDate: now.toISOString(),
      };
    }
  }
  
  saveUser(user);
  return {
    current: user.streak,
    broken: false,
    lastLogDate: user.lastLogDate,
  };
};

export const addXP = (amount: number): void => {
  const user = getUser();
  if (!user) throw new Error('No user found');
  
  user.xp += amount;
  saveUser(user);
};

export const getAvatarState = (): {
  state: 'Happy' | 'Neutral' | 'Low' | 'Energized' | 'Tired';
  color: string;
  scale: number;
} => {
  const user = getUser();
  const logs = getLogs();
  
  if (!user || logs.length === 0) {
    return { state: 'Neutral', color: 'hsl(195, 92%, 54%)', scale: 1.0 };
  }
  
  // Get most recent log
  const recentLog = logs[logs.length - 1];
  
  // Determine state based on mood + sleep + stress
  let state: 'Happy' | 'Neutral' | 'Low' | 'Energized' | 'Tired' = 'Neutral';
  let color = 'hsl(195, 92%, 54%)'; // blue
  
  if (recentLog.mood === 'Happy' && recentLog.sleep === 'Good') {
    state = 'Energized';
    color = 'hsl(45, 100%, 51%)'; // yellow
  } else if (recentLog.mood === 'Happy') {
    state = 'Happy';
    color = 'hsl(100, 98%, 42%)'; // green
  } else if (recentLog.mood === 'Low' || recentLog.stress === 'High') {
    state = 'Low';
    color = 'hsl(0, 100%, 64%)'; // red
  } else if (recentLog.sleep === 'Poor') {
    state = 'Tired';
    color = 'hsl(0, 0%, 62%)'; // gray
  }
  
  // Scale based on streak
  const scale = 1.0 + (user.streak * 0.05);
  
  return { state, color, scale };
};

export const generateInsight = (): string => {
  const logs = getLogs();
  
  if (logs.length < 2) {
    return "Keep logging to unlock personalized insights about your health patterns!";
  }
  
  const insights = [
    `Your fatigue tends to spike 36h after poor sleep + sugar intake. (n=${logs.length})`,
    `You logged high stress ${logs.filter(l => l.stress === 'High').length} times this week. Try our calm protocol.`,
    `Your energy peaks when sleep is good + supplements are consistent. (n=${logs.length})`,
    `Pattern detected: Low mood correlates with sugar + poor sleep combo. (n=${logs.length})`,
    `Great job! Your streak shows consistency pays off. Keep it up! (n=${logs.length})`,
  ];
  
  // Rotate based on log count
  return insights[logs.length % insights.length];
};

export const getConfidenceLevel = (): { level: 'Low' | 'Medium' | 'High'; message: string } => {
  const logs = getLogs();
  const count = logs.length;
  
  if (count < 3) return { level: 'Low', message: `Need ${3 - count} more logs` };
  if (count < 8) return { level: 'Medium', message: `${count} data points` };
  return { level: 'High', message: `${count}+ data points` };
};

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streak: number;
  consistencyScore: number;
  avatarType: string;
}

export const getLeaderboard = (): LeaderboardEntry[] => {
  const user = getUser();
  if (!user) return [];
  
  const logs = getLogs();
  const daysLogged = new Set(logs.map(l => new Date(l.timestamp).toDateString())).size;
  const completeLogs = logs.filter(l => l.food && l.sleep && l.mood && l.stress && l.supplements).length;
  
  const userEntry: LeaderboardEntry = {
    id: user.id,
    name: 'You',
    xp: user.xp,
    streak: user.streak,
    consistencyScore: daysLogged + (completeLogs * 0.5),
    avatarType: user.avatarType,
  };
  
  // Mock friends
  const mockFriends: LeaderboardEntry[] = [
    {
      id: 'friend_1',
      name: 'Sarah',
      xp: 180,
      streak: 5,
      consistencyScore: 7.5,
      avatarType: 'Calm',
    },
    {
      id: 'friend_2',
      name: 'Mike',
      xp: 150,
      streak: 6,
      consistencyScore: 8,
      avatarType: 'Charger',
    },
    {
      id: 'friend_3',
      name: 'Emma',
      xp: 220,
      streak: 8,
      consistencyScore: 10,
      avatarType: 'Explorer',
    },
  ];
  
  const allEntries = [userEntry, ...mockFriends];
  return allEntries.sort((a, b) => b.consistencyScore - a.consistencyScore);
};
