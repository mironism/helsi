import { motion } from 'framer-motion';

interface InsightCardProps {
  type: 'biomarker' | 'medication' | 'diagnosis' | 'recommendation' | 'lifestyle';
  title: string;
  data: any;
  userLogs?: any[];
}

export const MedicalInsightCard = ({ type, title, data, userLogs }: InsightCardProps) => {

  const getColor = () => {
    switch (type) {
      case 'biomarker':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'medication':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'diagnosis':
        return 'from-purple-50 to-pink-50 border-purple-200';
      case 'recommendation':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'lifestyle':
        return 'from-amber-50 to-yellow-50 border-amber-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const renderBiomarkerInsight = () => {
    const abnormal = data.filter((b: any) => b.status !== 'normal');
    const normal = data.filter((b: any) => b.status === 'normal');
    
    return (
      <div className="space-y-3">
        {abnormal.length > 0 && (
          <div className="space-y-2">
            <div className="text-red-600 font-medium">
              Abnormal Values ({abnormal.length})
            </div>
            {abnormal.map((marker: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <div className="text-red-800 font-medium">{marker.name}: {marker.value} {marker.unit} ({marker.status.toUpperCase()})</div>
                  <div className="text-sm text-red-600">Normal: {marker.referenceRange}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {normal.length > 0 && (
          <div className="space-y-2">
            <div className="text-green-600 font-medium">
              Normal Values ({normal.length})
            </div>
            {normal.map((marker: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-green-800">{marker.name}: {marker.value} {marker.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMedicationInsight = () => {
    return (
      <div className="space-y-2">
        {data.map((med: any, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <div>
              <div className="text-blue-800 font-medium">{med.name}</div>
              {med.dosage && (
                <div className="text-sm text-blue-600">Dosage: {med.dosage}</div>
              )}
              {med.frequency && (
                <div className="text-sm text-blue-600">Frequency: {med.frequency}</div>
              )}
              {med.reason && (
                <div className="text-sm text-blue-600">Reason: {med.reason}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDiagnosisInsight = () => {
    return (
      <div className="space-y-2">
        {data.map((diagnosis: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span className="text-purple-800">{diagnosis}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderRecommendationInsight = () => {
    return (
      <div className="space-y-2">
        {data.map((rec: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span className="text-green-800">{rec}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderLifestyleInsight = () => {
    if (!userLogs || userLogs.length === 0) return null;
    
    const recentLogs = userLogs.slice(-7);
    const supplementCount = recentLogs.filter(l => l.supplements === 'Taken').length;
    const goodSleepCount = recentLogs.filter(l => l.sleep === 'Good').length;
    const exerciseCount = recentLogs.filter(l => l.exercise === 'Yes').length;
    
    return (
      <div className="space-y-2">
        <div className="text-amber-700 font-medium">Your Recent Activity</div>
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-1">•</span>
          <span className="text-amber-800">Supplements taken: {supplementCount} times</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-1">•</span>
          <span className="text-amber-800">Good sleep: {goodSleepCount} times</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-500 mt-1">•</span>
          <span className="text-amber-800">Exercise: {exerciseCount} times</span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'biomarker':
        return renderBiomarkerInsight();
      case 'medication':
        return renderMedicationInsight();
      case 'diagnosis':
        return renderDiagnosisInsight();
      case 'recommendation':
        return renderRecommendationInsight();
      case 'lifestyle':
        return renderLifestyleInsight();
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4"
    >
      <h4 className="font-semibold text-slate-800 mb-3">{title}</h4>
      {renderContent()}
    </motion.div>
  );
};
