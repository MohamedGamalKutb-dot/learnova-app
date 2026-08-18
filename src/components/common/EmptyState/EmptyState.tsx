import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  isArabic?: boolean;
  isDark?: boolean;
  action?: React.ReactNode;
}

/**
 * Reusable empty state component for when data lists are empty.
 * Business-agnostic — does not know about specific features.
 */
export default function EmptyState({
  title = 'No data found',
  titleAr = 'لا توجد بيانات',
  description = 'There is nothing to show here yet.',
  descriptionAr = 'لا يوجد شيء لعرضه هنا بعد.',
  icon = '📭',
  isArabic = false,
  isDark = false,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <span className="text-6xl mb-4" role="img" aria-label="empty">
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
        className={`text-sm max-w-sm ${
          isDark ? 'text-subtext-dark' : 'text-subtext'
        }`}
      >
        {isArabic ? descriptionAr : description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
