import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Upload, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  onAddClick?: () => void;
}

const BottomNav = ({ onAddClick }: BottomNavProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/connect', icon: Upload, label: 'Connect' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-sm border-t border-white/30 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-end justify-around h-16 relative">
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 top-0 h-0.5 bg-amber-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? 'hsl(25, 95%, 53%)' : 'hsl(215, 13%, 34%)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-col items-center"
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}

          {/* Center Add Button - Higher */}
          <div className="flex-1 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onAddClick}
              className="absolute -top-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          </div>

          {navItems.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 top-0 h-0.5 bg-amber-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? 'hsl(25, 95%, 53%)' : 'hsl(215, 13%, 34%)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-col items-center"
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
