// localStorage abstraction layer - future-proof for backend migration

export interface User {
  id: string;
  name: string;
  avatarType: 'Explorer' | 'Calm' | 'Charger';
  surveyAnswers: {
    sleepQuality: string;
    fatigueFrequency: string;
    tracksHealth: string;
    mainGoal: string;
  };
  xp: number;
  streak: number;
  lastLogDate: string | null;
  createdAt: string;
}

export interface Log {
  id: string;
  userId: string;
  timestamp: string;
  food?: string;
  sleep?: string;
  mood?: string;
  stress?: string;
  supplements?: string;
}

const STORAGE_KEYS = {
  USER: 'immune_graph_user',
  LOGS: 'immune_graph_logs',
};

// User operations
export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const createUser = (surveyAnswers: User['surveyAnswers'], avatarType: User['avatarType']): User => {
  const user: User = {
    id: `user_${Date.now()}`,
    name: 'You',
    avatarType,
    surveyAnswers,
    xp: 0,
    streak: 0,
    lastLogDate: null,
    createdAt: new Date().toISOString(),
  };
  saveUser(user);
  return user;
};

// Log operations
export const getLogs = (): Log[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  return data ? JSON.parse(data) : [];
};

export const saveLogs = (logs: Log[]): void => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const addLog = (logData: Omit<Log, 'id' | 'userId' | 'timestamp'>): Log => {
  const user = getUser();
  if (!user) throw new Error('No user found');

  const log: Log = {
    id: `log_${Date.now()}`,
    userId: user.id,
    timestamp: new Date().toISOString(),
    ...logData,
  };

  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);

  return log;
};

// Demo functions
export const seedDemoData = (): void => {
  const demoUser: User = {
    id: 'demo_user',
    name: 'You',
    avatarType: 'Explorer',
    surveyAnswers: {
      sleepQuality: 'Good',
      fatigueFrequency: 'Sometimes',
      tracksHealth: 'Sometimes',
      mainGoal: 'Energy',
    },
    xp: 210,
    streak: 7,
    lastLogDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveUser(demoUser);

  const demoLogs: Log[] = Array.from({ length: 7 }, (_, i) => ({
    id: `log_${i}`,
    userId: 'demo_user',
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    food: 'Clean', // Always clean food for perfect journey
    sleep: 'Good', // Always good sleep for perfect journey
    mood: 'Happy', // Always happy mood for perfect journey
    stress: 'Low', // Always low stress for perfect journey
    supplements: 'Taken', // Always taking supplements for perfect journey
  }));
  saveLogs(demoLogs);
};

export const resetDemo = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
};
