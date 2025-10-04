import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Trash2, LogOut, Bell, Shield, HelpCircle, RotateCcw } from 'lucide-react';
import { getUser, saveUser, resetDemo } from '@/lib/storage';
import { toast } from 'sonner';

const Settings = () => {
  const user = getUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || 'You');

  if (!user) return null;

  const handleSaveName = () => {
    if (name.trim()) {
      user.name = name.trim();
      saveUser(user);
      setIsEditingName(false);
      toast.success('Name updated successfully!');
    }
  };

  const handleResetDemo = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetDemo();
      toast.info('Demo reset. Refreshing...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          action: () => setIsEditingName(true),
          color: 'text-primary',
        },
        {
          icon: Bell,
          label: 'Notifications',
          action: () => toast.info('Notifications coming soon!'),
          color: 'text-accent',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          label: 'Privacy Settings',
          action: () => toast.info('Privacy settings coming soon!'),
          color: 'text-secondary',
        },
        {
          icon: Trash2,
          label: 'Delete All Data',
          action: handleResetDemo,
          color: 'text-low',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          action: () => toast.info('Help center coming soon!'),
          color: 'text-neutral',
        },
        {
          icon: RotateCcw,
          label: 'Reset Demo',
          action: handleResetDemo,
          color: 'text-muted-foreground',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <header className="bg-gradient-secondary p-6 rounded-b-3xl shadow-card">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/80 text-sm">Manage your account and preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setName(user.name);
                      setIsEditingName(false);
                    }}
                    className="px-4 py-2 bg-muted text-foreground rounded-xl font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.avatarType} • {user.xp} XP • {user.streak} day streak
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{user.xp}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{user.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-muted-foreground">Days Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-card rounded-3xl shadow-card p-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.label}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-2xl transition-colors"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="flex-1 text-left font-semibold">{item.label}</span>
                  <span className="text-muted-foreground">›</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Helsi v1.0.0</p>
          <p className="mt-1">Made with ❤️ for your health</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
