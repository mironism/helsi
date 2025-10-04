import { motion } from 'framer-motion';
import { Droplet, Heart, Sun, Activity, AlertTriangle } from 'lucide-react';
import { ExtractedMedicalData } from '@/lib/storage';

interface MedicalDataVisualizationProps {
  data: ExtractedMedicalData;
  documentType?: string;
}

export const MedicalDataVisualization = ({ data, documentType = 'medical_document' }: MedicalDataVisualizationProps) => {
  const getBiomarkerIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hemoglobin') || lowerName.includes('blood')) {
      return <Droplet className="w-4 h-4" />;
    } else if (lowerName.includes('cholesterol') || lowerName.includes('heart')) {
      return <Heart className="w-4 h-4" />;
    } else if (lowerName.includes('vitamin') || lowerName.includes('d')) {
      return <Sun className="w-4 h-4" />;
    } else {
      return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'high':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'high':
      case 'low':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  if (!data.biomarkers || data.biomarkers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No biomarker data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-slate-800">Extracted Medical Data</h3>
      </div>
      
      <div className="grid gap-3">
        {data.biomarkers.map((biomarker, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${getStatusColor(biomarker.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getBiomarkerIcon(biomarker.name)}
                <span className="font-semibold">{biomarker.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(biomarker.status)}
                <span className="text-sm font-medium capitalize">{biomarker.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {biomarker.value} <span className="text-sm font-normal text-slate-600">{biomarker.unit}</span>
              </div>
              <div className="text-sm text-slate-600">
                Normal: {biomarker.referenceRange}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
