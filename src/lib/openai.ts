// OpenAI API integration for medical document analysis
import { ExtractedMedicalData, Biomarker, Medication } from './storage';

// Initialize OpenAI client conditionally
export const initializeOpenAI = async () => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      console.log('No valid OpenAI API key found, using demo mode');
      return null;
    }

    const { OpenAI } = await import('openai');
    const client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    console.log('OpenAI client initialized successfully');
    return client;
  } catch (error) {
    console.log('OpenAI not available:', error);
    return null;
  }
};

// Analyze medical document with OpenAI
export const analyzeMedicalDocument = async (documentText: string): Promise<ExtractedMedicalData> => {
  const client = await initializeOpenAI();
  
  if (!client) {
    throw new Error('OpenAI client not available');
  }

  const prompt = `Analyze this medical document and extract structured data. Return a JSON object with the following structure:
{
  "documentType": "medical_document",
  "summary": "Brief summary of the document",
  "biomarkers": [
    {
      "name": "Biomarker name",
      "value": 123,
      "unit": "mg/dL",
      "referenceRange": "normal range",
      "status": "normal|high|low"
    }
  ],
  "medications": [
    {
      "name": "Medication name",
      "dosage": "500mg",
      "frequency": "twice daily",
      "reason": "prescribed for condition"
    }
  ],
  "diagnoses": ["Diagnosis 1", "Diagnosis 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "extractedAt": "2024-01-01T00:00:00.000Z"
}

Document text: ${documentText}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant. Extract structured medical data from documents. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const extractedData = JSON.parse(content);
    return extractedData;
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw error;
  }
};

// Generate personalized insights
export const generatePersonalizedInsights = async (medicalData: ExtractedMedicalData, userLogs: any[]): Promise<string> => {
  const client = await initializeOpenAI();
  
  if (!client) {
    throw new Error('OpenAI client not available');
  }

  const prompt = `Based on this medical data and user lifestyle logs, generate personalized health insights:

Medical Data: ${JSON.stringify(medicalData, null, 2)}
User Logs: ${JSON.stringify(userLogs, null, 2)}

Provide insights in the following format:
- Document Summary
- Biomarker Analysis (highlight abnormal values)
- Medications (list and explain)
- Diagnoses (explain conditions)
- Lifestyle Connection (connect to user logs)
- Recommendations (actionable advice)

Use bullet points and be specific about the medical data.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant. Generate personalized health insights based on medical data and lifestyle logs. Be specific and actionable.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    return response.choices[0]?.message?.content || 'Unable to generate insights';
  } catch (error) {
    console.error('OpenAI insight generation failed:', error);
    throw error;
  }
};

// Validate extracted medical data
export const validateMedicalData = (data: any): data is ExtractedMedicalData => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.documentType === 'string' &&
    Array.isArray(data.biomarkers) &&
    Array.isArray(data.medications) &&
    Array.isArray(data.diagnoses) &&
    Array.isArray(data.recommendations)
  );
};
