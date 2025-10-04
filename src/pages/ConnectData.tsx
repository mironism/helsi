import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Activity, Check, AlertCircle, Watch } from 'lucide-react';
import { toast } from 'sonner';

const ConnectData = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const wearables = [
    {
      id: 'whoop',
      name: 'WHOOP',
      icon: Activity,
      status: 'available',
      description: 'Import heart rate, recovery, and sleep data',
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      icon: Watch,
      status: 'available',
      description: 'Sync sleep stages, HRV, and body temperature',
    },
    {
      id: 'apple',
      name: 'Apple Health',
      icon: Activity,
      status: 'available',
      description: 'Connect steps, workouts, and health metrics',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
      setIsUploading(false);
      toast.success(`${fileNames.length} file(s) uploaded successfully!`, {
        description: 'AI is analyzing your reports...',
      });
    }, 1500);
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
          <div className="text-5xl">☀️</div>
        </div>

        {/* Birds - moved lower */}
        <div className="absolute top-44 right-1/4 opacity-60">
          <div className="text-2xl">🐦</div>
        </div>
      </div>

      {/* Header - Glassmorphism style like home page */}
      <header className="relative z-10 py-6">
        <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm rounded-full px-6 py-4 mx-4 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Connect Data</h1>
          <p className="text-slate-600 text-sm text-center">
            Upload reports or connect devices to enhance your Health Twin
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Upload Section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Upload Medical Reports</h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Upload blood work, test results, or doctor's notes. Our AI will extract relevant biomarkers.
          </p>

          {/* Upload Area */}
          <label className="block">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-colors
                ${isUploading
                  ? 'border-amber-500 bg-amber-50/50'
                  : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/50'
                }
              `}
            >
              {isUploading ? (
                <div className="space-y-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 mx-auto"
                  >
                    <Upload className="w-full h-full text-amber-500" />
                  </motion.div>
                  <p className="text-sm font-semibold text-amber-600">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Click to upload files</p>
                    <p className="text-xs text-slate-600 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </label>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-700">Uploaded Files</h3>
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-xl"
                >
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm flex-1 truncate text-slate-800">{file}</span>
                  <span className="text-xs text-slate-600">Analyzed</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>


        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-slate-800 mb-1">Privacy First</p>
            <p className="text-slate-600 text-xs">
              All data is encrypted and stored securely. You can delete your data anytime from Settings.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ConnectData;
