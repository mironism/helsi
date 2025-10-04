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

export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
  reason?: string;
}

export interface ExtractedMedicalData {
  documentType: string;
  summary: string;
  biomarkers: Biomarker[];
  medications: Medication[];
  diagnoses: string[];
  recommendations: string[];
  extractedAt: string;
}

export interface MedicalDocument {
  id: string;
  uploadDate: string;
  userId: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'lab_report';
  processingStatus: 'processing' | 'completed' | 'failed';
  fileSize: number;
  mimeType: string;
  extractedData?: ExtractedMedicalData;
}

const STORAGE_KEYS = {
  USER: 'immune_graph_user',
  LOGS: 'immune_graph_logs',
  MEDICAL_DOCS: 'immune_graph_medical_docs',
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

// Medical document operations
export const getMedicalDocuments = (): MedicalDocument[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEDICAL_DOCS);
  return data ? JSON.parse(data) : [];
};

export const saveMedicalDocuments = (docs: MedicalDocument[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEDICAL_DOCS, JSON.stringify(docs));
};

export const addMedicalDocument = (doc: MedicalDocument): MedicalDocument => {
  const docs = getMedicalDocuments();
  docs.push(doc);
  saveMedicalDocuments(docs);
  return doc;
};

export const updateMedicalDocument = (id: string, updates: Partial<MedicalDocument>): void => {
  const docs = getMedicalDocuments();
  const index = docs.findIndex(doc => doc.id === id);
  if (index !== -1) {
    docs[index] = { ...docs[index], ...updates };
    saveMedicalDocuments(docs);
  }
};

export const resetDemo = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.MEDICAL_DOCS);
};

// Insights interface
export interface Insight {
  recovery: number;
  strain: number;
  sleepScore: number;
  trends: Array<{
    title: string;
    value: string;
    trend: 'up' | 'down';
    icon: any;
    color: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// Generate insights from logs
export const getInsights = (): Insight => {
  const logs = getLogs();
  
  if (logs.length < 2) {
    return {
      recovery: 0,
      strain: 0,
      sleepScore: 0,
      trends: [],
      recommendations: []
    };
  }

  // Calculate recovery score based on recent logs
  const recentLogs = logs.slice(-7); // Last 7 days
  const goodSleepCount = recentLogs.filter(l => l.sleep === 'Good').length;
  const happyMoodCount = recentLogs.filter(l => l.mood === 'Happy').length;
  const lowStressCount = recentLogs.filter(l => l.stress === 'Low').length;
  
  const recovery = Math.round(((goodSleepCount + happyMoodCount + lowStressCount) / (recentLogs.length * 3)) * 100);
  
  // Calculate strain (based on stress and activity)
  const highStressCount = recentLogs.filter(l => l.stress === 'High').length;
  const strain = Math.min(21, Math.round((highStressCount / recentLogs.length) * 21));
  
  // Calculate sleep score
  const sleepScore = Math.round((goodSleepCount / recentLogs.length) * 100);
  
  // Generate trends
  const trends = [];
  if (goodSleepCount > recentLogs.length / 2) {
    trends.push({
      title: 'Sleep Quality',
      value: `${goodSleepCount}/${recentLogs.length} good nights`,
      trend: 'up' as const,
      icon: 'Moon',
      color: 'text-blue-500'
    });
  }
  
  if (happyMoodCount > recentLogs.length / 2) {
    trends.push({
      title: 'Mood Trend',
      value: `${happyMoodCount}/${recentLogs.length} happy days`,
      trend: 'up' as const,
      icon: 'Smile',
      color: 'text-green-500'
    });
  }
  
  if (lowStressCount < recentLogs.length / 2) {
    trends.push({
      title: 'Stress Levels',
      value: `${recentLogs.length - lowStressCount}/${recentLogs.length} high stress days`,
      trend: 'down' as const,
      icon: 'AlertTriangle',
      color: 'text-red-500'
    });
  }
  
  // Generate recommendations
  const recommendations = [];
  
  if (recovery < 50) {
    recommendations.push({
      title: 'Focus on Recovery',
      description: 'Your recovery score is low. Prioritize sleep and stress management.',
      priority: 'high' as const
    });
  }
  
  if (sleepScore < 70) {
    recommendations.push({
      title: 'Improve Sleep Quality',
      description: 'Consistent sleep hygiene can boost your energy and mood.',
      priority: 'medium' as const
    });
  }
  
  if (strain > 15) {
    recommendations.push({
      title: 'Manage Stress',
      description: 'High strain detected. Consider meditation or relaxation techniques.',
      priority: 'high' as const
    });
  }
  
  if (recentLogs.filter(l => l.supplements === 'Taken').length < recentLogs.length / 2) {
    recommendations.push({
      title: 'Consistent Supplements',
      description: 'Taking supplements regularly can support your immune system.',
      priority: 'low' as const
    });
  }
  
  return {
    recovery,
    strain,
    sleepScore,
    trends,
    recommendations
  };
};
