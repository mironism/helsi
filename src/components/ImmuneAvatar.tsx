import { motion } from 'framer-motion';

interface ImmuneAvatarProps {
  state: 'Happy' | 'Neutral' | 'Low' | 'Energized' | 'Tired';
  color: string;
  scale?: number;
  size?: number;
  avatarType?: string;
}

export const ImmuneAvatar = ({ state, color, scale = 1, size = 120 }: ImmuneAvatarProps) => {
  const renderAvatar = () => {
    // Use your custom SVGs based on state - only 3 states
    const getCustomAvatarPath = () => {
      switch (state) {
        case 'Tired':
        case 'Low':
          return '/tired-avatar.svg'; // Super tired for bad states
        case 'Happy':
        case 'Energized':
          return '/happy-avatar.svg'; // Happy for good states
        case 'Neutral':
        default:
          return '/neutral-avatar.svg'; // Just tired for neutral
      }
    };

    return (
      <div 
        style={{ 
          width: size, 
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <img
          src={getCustomAvatarPath()}
          alt={`${state} avatar`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            filter: `drop-shadow(0 2px ${scale * 6}px ${color}40)`
          }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="inline-block"
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {renderAvatar()}
      </motion.div>
    </motion.div>
  );
};