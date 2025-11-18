import { Spinner } from '@phosphor-icons/react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner className={`${sizeClasses[size]} text-primary-600 animate-spin mb-4`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

export function PageLoading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}
