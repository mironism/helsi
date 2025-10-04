// Configuration for OpenAI and demo data
export const OPENAI_CONFIG = {
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.1,
  MAX_REQUESTS_PER_MINUTE: 3,
  DEMO_MODE: !import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-api-key-here'
};

// Demo medical data for testing
export const DEMO_MEDICAL_DATA = {
  documentType: 'medical_document',
  summary: 'Demo medical document with sample lab results and recommendations.',
  biomarkers: [
    {
      name: 'Hemoglobin',
      value: 14.2,
      unit: 'g/dL',
      referenceRange: '12-16',
      status: 'normal'
    },
    {
      name: 'Cholesterol',
      value: 185,
      unit: 'mg/dL',
      referenceRange: '<200',
      status: 'normal'
    },
    {
      name: 'Vitamin D',
      value: 28,
      unit: 'ng/mL',
      referenceRange: '30-100',
      status: 'low'
    }
  ],
  medications: [
    {
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Daily',
      reason: 'Vitamin D deficiency'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      reason: 'Pre-diabetes management'
    }
  ],
  diagnoses: ['Vitamin D deficiency', 'Pre-diabetes'],
  recommendations: [
    'Take vitamin D supplements daily',
    'Monitor blood sugar levels',
    'Regular exercise',
    'Follow up in 3 months'
  ],
  extractedAt: new Date().toISOString()
};
