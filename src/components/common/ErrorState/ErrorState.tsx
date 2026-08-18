import { motion } from 'framer-motion';
import { Button } from '@heroui/react';

interface ErrorStateProps {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  isArabic?: boolean;
  isDark?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  retryLabelAr?: string;
}

/**
 * Reusable error state component for failed async operations.
 * Business-agnostic — always shows a consistent error UI with optional retry.
 */
export default function ErrorState({
  title = 'Something went wrong',
  titleAr = 'حدث خطأ ما',
  description = 'An error occurred while loading. Please try again.',
  descriptionAr = 'حدث خطأ أثناء التحميل. حاول مرة أخرى.',
  icon = '⚠️',
  isArabic = false,
  isDark = false,
  onRetry,
  retryLabel = 'Try Again',
  retryLabelAr = 'حاول مرة أخرى',
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <span className="text-6xl mb-4" role="img" aria-label="error">
        {icon}
      </span>
      <h3
        className={`text-xl font-bold mb-2 ${
          isDark ? 'text-text-dark' : 'text-text'
        }`}
      >
        {isArabic ? titleAr : title}
      </h3>
      <p
        className={`text-sm max-w-sm mb-4 ${
          isDark ? 'text-subtext-dark' : 'text-subtext'
        }`}
      >
        {isArabic ? descriptionAr : description}
      </p>
      {onRetry && (
        <Button
          color="primary"
          variant="flat"
          onPress={onRetry}
          className="mt-2"
        >
          {isArabic ? retryLabelAr : retryLabel}
        </Button>
      )}
    </motion.div>
  );
}
