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
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <header className="bg-gradient-accent p-6 rounded-b-3xl shadow-card">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-accent-foreground mb-2">Connect Data</h1>
          <p className="text-accent-foreground/80 text-sm">
            Upload reports or connect devices to enhance your Health Twin
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <div className="bg-card rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Upload Medical Reports</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
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
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
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
                    <Upload className="w-full h-full text-primary" />
                  </motion.div>
                  <p className="text-sm font-semibold text-primary">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Click to upload files</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
              <h3 className="text-sm font-semibold text-muted-foreground">Uploaded Files</h3>
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                >
                  <Check className="w-4 h-4 text-energized flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{file}</span>
                  <span className="text-xs text-muted-foreground">Analyzed</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Wearables Section */}
        <div className="bg-card rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Connect Wearables</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Automatically sync data from your health tracking devices.
          </p>

          <div className="space-y-3">
            {wearables.map((wearable, index) => (
              <motion.button
                key={wearable.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleConnectWearable(wearable.name)}
                className="w-full flex items-center gap-4 p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center flex-shrink-0">
                  <wearable.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{wearable.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {wearable.description}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                    Connect
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-secondary mb-1">Privacy First</p>
            <p className="text-muted-foreground text-xs">
              All data is encrypted and stored securely. You can delete your data anytime from Settings.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ConnectData;
