import { motion } from 'framer-motion';
import { MedicalDocument } from '@/lib/storage';

interface DocumentHistoryProps {
  documents: MedicalDocument[];
  onViewDocument: (doc: MedicalDocument) => void;
  selectedDocumentId: string | null;
}

export const DocumentHistory = ({ documents, onViewDocument, selectedDocumentId }: DocumentHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="font-semibold text-slate-600 mb-1">No Documents Yet</h3>
        <p className="text-sm text-slate-500">Upload your first medical document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-slate-800 mb-3">Document History</h3>
      
      {documents.map((doc, index) => (
        <motion.div
          key={`${doc.id}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border ${doc.id === selectedDocumentId ? 'border-blue-400 shadow-md' : 'border-white/20'} hover:bg-white/20 transition-colors cursor-pointer`}
          onClick={() => onViewDocument(doc)}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-slate-800 truncate max-w-48">
                {doc.fileName}
              </h4>
              <p className="text-xs text-slate-600">
                {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadDate)}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.processingStatus)}`}>
              {doc.processingStatus.toUpperCase()}
            </span>
          </div>
          
          {doc.extractedData && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>{doc.extractedData.biomarkers?.length || 0} biomarkers</span>
                <span>•</span>
                <span>{doc.extractedData.medications?.length || 0} medications</span>
                <span>•</span>
                <span>{doc.extractedData.recommendations?.length || 0} recommendations</span>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
