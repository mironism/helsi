import { motion } from 'framer-motion';

interface ImmuneAvatarProps {
  state: 'Happy' | 'Neutral' | 'Low' | 'Energized' | 'Tired';
  color: string;
  scale?: number;
  size?: number;
}

export const ImmuneAvatar = ({ state, color, scale = 1, size = 120 }: ImmuneAvatarProps) => {
  const renderAvatar = () => {
    const commonProps = {
      width: size,
      height: size,
      viewBox: "0 0 120 120",
      style: { filter: `drop-shadow(0 0 ${scale * 10}px ${color})` },
    };

    switch (state) {
      case 'Happy':
        return (
          <svg {...commonProps}>
            <circle cx="60" cy="60" r="50" fill={color} />
            <circle cx="45" cy="50" r="5" fill="white" />
            <circle cx="75" cy="50" r="5" fill="white" />
            <path d="M 40 70 Q 60 85 80 70" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        );
      
      case 'Energized':
        return (
          <svg {...commonProps}>
            <circle cx="60" cy="60" r="50" fill={color} />
            <circle cx="45" cy="50" r="6" fill="white" />
            <circle cx="75" cy="50" r="6" fill="white" />
            <path d="M 35 65 Q 60 80 85 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Energy sparks */}
            <motion.path
              d="M 20 30 L 25 35 L 20 40"
              stroke={color}
              strokeWidth="3"
              fill="none"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d="M 100 30 L 95 35 L 100 40"
              stroke={color}
              strokeWidth="3"
              fill="none"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </svg>
        );
      
      case 'Low':
        return (
          <svg {...commonProps}>
            <circle cx="60" cy="60" r="50" fill={color} />
            <circle cx="45" cy="55" r="4" fill="white" />
            <circle cx="75" cy="55" r="4" fill="white" />
            <path d="M 40 75 Q 60 65 80 75" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Tear */}
            <ellipse cx="80" cy="62" rx="3" ry="5" fill="lightblue" opacity="0.7" />
          </svg>
        );
      
      case 'Tired':
        return (
          <svg {...commonProps}>
            <circle cx="60" cy="60" r="50" fill={color} />
            <line x1="40" y1="50" x2="50" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="70" y1="50" x2="80" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="60" cy="70" rx="10" ry="5" fill="white" opacity="0.5" />
            {/* Zzz */}
            <text x="85" y="35" fill={color} fontSize="16" fontWeight="bold">Z</text>
            <text x="92" y="25" fill={color} fontSize="12" fontWeight="bold" opacity="0.7">z</text>
          </svg>
        );
      
      default: // Neutral
        return (
          <svg {...commonProps}>
            <circle cx="60" cy="60" r="50" fill={color} />
            <circle cx="45" cy="50" r="5" fill="white" />
            <circle cx="75" cy="50" r="5" fill="white" />
            <line x1="45" y1="70" x2="75" y2="70" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: scale,
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
