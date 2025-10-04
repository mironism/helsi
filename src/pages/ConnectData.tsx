import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Activity, Check, AlertCircle, Watch } from 'lucide-react';
import { toast } from 'sonner';
import { processMedicalDocument, generateMedicalInsights } from '@/lib/medicalService';
import { getMedicalDocuments } from '@/lib/storage';
import { MedicalDocument } from '@/lib/storage';
import { MedicalDataVisualization } from '@/components/MedicalDataVisualization';
import { DocumentHistory } from '@/components/DocumentHistory';
import { MedicalInsightCard } from '@/components/MedicalInsightCard';

const ConnectData = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [medicalDocs, setMedicalDocs] = useState<MedicalDocument[]>([]);
  const [medicalInsight, setMedicalInsight] = useState<string>('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MedicalDocument | null>(null);

  // Debug selected document changes
  useEffect(() => {
    console.log('Selected document changed:', selectedDocument);
  }, [selectedDocument]);

  // Load medical documents on component mount
  useEffect(() => {
    const docs = getMedicalDocuments();
    setMedicalDocs(docs);
    
    // Set the most recent completed document as selected
    if (docs.length > 0) {
      const completedDocs = docs.filter(doc => doc.processingStatus === 'completed');
      if (completedDocs.length > 0) {
        const latestDoc = completedDocs.sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )[0];
        setSelectedDocument(latestDoc);
      } else {
        // If no completed docs, select the most recent one
        const latestDoc = docs.sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )[0];
        setSelectedDocument(latestDoc);
      }
    }
    
    // Only generate insights if we have medical documents
    if (docs.length > 0) {
      generateInsights();
    }
  }, []);

  const generateInsights = async () => {
    setIsGeneratingInsight(true);
    try {
      const insight = await generateMedicalInsights();
      setMedicalInsight(insight);
    } catch (error) {
      console.error('Error generating insights:', error);
      setMedicalInsight('Unable to generate insights at this time.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Process each file
      for (const file of Array.from(files)) {
        const medicalDoc = await processMedicalDocument(file);
        setMedicalDocs(prev => [...prev, medicalDoc]);
        setUploadedFiles(prev => [...prev, file.name]);
        
        // Set the newly processed document as selected
        console.log('Setting selected document:', medicalDoc);
        setSelectedDocument(medicalDoc);
        
        toast.success(`${file.name} processed successfully!`, {
          description: 'AI extracted health data from your document',
        });
      }
      
      // Generate new insights after processing
      await generateInsights();
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process some files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConnectWearable = (wearableName: string) => {
    toast.info(`${wearableName} integration coming soon!`, {
      description: 'We\'ll notify you when this feature is ready.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 relative overflow-hidden pb-20">
      {/* Decorative Nature Elements - Full Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Clouds floating around - moved lower */}
        <div className="absolute top-24 right-20 opacity-50 animate-pulse">
          <div className="text-5xl">☁️</div>
        </div>
        <div className="absolute top-32 left-16 opacity-40">
          <div className="text-4xl">☁️</div>
        </div>
        <div className="absolute top-48 right-32 opacity-30">
          <div className="text-3xl">☁️</div>
        </div>

        {/* Sun - moved lower */}
        <div className="absolute top-20 left-8">
          <div className="text-4xl animate-pulse">☀️</div>
        </div>

        {/* Birds flying */}
        <div className="absolute top-16 right-12 opacity-60">
          <div className="text-2xl">🕊️</div>
        </div>
        <div className="absolute top-28 left-24 opacity-40">
          <div className="text-xl">🕊️</div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Connect Your Data</h1>
          <p className="text-slate-600">Upload medical reports and connect your health devices</p>
        </motion.div>

        {/* Upload Medical Reports */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Upload Medical Reports</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Click to upload files</p>
              <p className="text-sm text-slate-500">PDF, JPG, PNG up to 10MB</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                <span>Processing your documents...</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">{file}</span>
                  <span className="text-sm text-green-600 font-medium">✓ Analyzed</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Document History */}
        {medicalDocs.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
          >
            <DocumentHistory
              documents={medicalDocs}
              onViewDocument={setSelectedDocument}
              selectedDocumentId={selectedDocument?.id || null}
            />
          </motion.div>
        )}

        {/* Medical Data Visualization */}
        {selectedDocument && selectedDocument.extractedData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
          >
            <MedicalDataVisualization
              data={selectedDocument.extractedData}
              documentType={selectedDocument.extractedData.documentType || 'medical_document'}
            />
          </motion.div>
        )}

        {/* Medical Insights - Interactive Components */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">AI Health Insights</h3>
          
          {selectedDocument && selectedDocument.extractedData ? (
            <div className="grid gap-4">
              {/* Document Summary */}
              {selectedDocument.extractedData.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4"
                >
                  <h4 className="font-semibold text-slate-800 mb-3">Document Summary</h4>
                  <p className="text-slate-700 leading-relaxed">{selectedDocument.extractedData.summary}</p>
                </motion.div>
              )}
              
              {/* Biomarkers Insight */}
              {selectedDocument.extractedData.biomarkers && selectedDocument.extractedData.biomarkers.length > 0 && (
                <MedicalInsightCard
                  type="biomarker"
                  title="Biomarker Analysis"
                  data={selectedDocument.extractedData.biomarkers}
                />
              )}
              
              {/* Medications Insight */}
              {selectedDocument.extractedData.medications && selectedDocument.extractedData.medications.length > 0 && (
                <MedicalInsightCard
                  type="medication"
                  title="Medications Identified"
                  data={selectedDocument.extractedData.medications}
                />
              )}
              
              {/* Diagnoses Insight */}
              {selectedDocument.extractedData.diagnoses && selectedDocument.extractedData.diagnoses.length > 0 && (
                <MedicalInsightCard
                  type="diagnosis"
                  title="Medical Diagnoses"
                  data={selectedDocument.extractedData.diagnoses}
                />
              )}
              
              {/* Recommendations Insight */}
              {selectedDocument.extractedData.recommendations && selectedDocument.extractedData.recommendations.length > 0 && (
                <MedicalInsightCard
                  type="recommendation"
                  title="Medical Recommendations"
                  data={selectedDocument.extractedData.recommendations}
                />
              )}
              
              {/* Lifestyle Connection */}
              <MedicalInsightCard
                type="lifestyle"
                title="Lifestyle Connection"
                data={[]}
                userLogs={[]}
              />
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center">
              <h4 className="font-semibold text-slate-800 mb-2">No Document Selected</h4>
              <p className="text-slate-600 mb-4">Upload and analyze a medical document to see AI-powered health insights.</p>
              <div className="text-sm text-slate-500">
                <p>Supported formats: PDF, JPG, PNG</p>
                <p>Max file size: 10MB</p>
              </div>
            </div>
          )}
          
          {/* Generate New Insight Button */}
          <div className="mt-6">
            <button
              onClick={generateInsights}
              disabled={isGeneratingInsight}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingInsight ? 'Generating...' : 'Generate New Insight'}
            </button>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Privacy First</h3>
              <p className="text-slate-600 text-sm">
                Your data is encrypted and stored securely. You can delete your data at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConnectData;