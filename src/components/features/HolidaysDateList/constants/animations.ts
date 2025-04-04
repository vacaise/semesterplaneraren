
import { HTMLMotionProps } from 'framer-motion';

export const ANIMATION_CONFIG: HTMLMotionProps<'div'> = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' },
};
