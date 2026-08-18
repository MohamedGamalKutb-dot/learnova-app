import { Spinner } from '@heroui/react';

interface LoadingStateProps {
  label?: string;
  labelAr?: string;
  isArabic?: boolean;
  isDark?: boolean;
  /** 'full' fills the viewport, 'inline' fits within its container */
  variant?: 'full' | 'inline';
}

/**
 * Reusable loading state with consistent spinner and optional label.
 */
export default function LoadingState({
  label = 'Loading...',
  labelAr = 'جاري التحميل...',
  isArabic = false,
  isDark = false,
  variant = 'inline',
}: LoadingStateProps) {
  const containerClass =
    variant === 'full'
      ? 'min-h-screen flex flex-col items-center justify-center'
      : 'flex flex-col items-center justify-center py-16';

  return (
    <div className={containerClass}>
      <Spinner size="lg" color="primary" />
      <p
        className={`mt-4 text-sm ${
          isDark ? 'text-subtext-dark' : 'text-subtext'
        }`}
      >
        {isArabic ? labelAr : label}
      </p>
    </div>
  );
}
