import type { ReactNode } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, backTo, backLabel = 'Back', action }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-4 sm:py-6 lg:py-8 -mb-4 sm:-mb-6 lg:-mb-8">
      <Container>
        <div className="flex flex-col gap-4 sm:gap-6">
          {backTo && (
            <Link 
              to={backTo} 
              className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              {backLabel}
            </Link>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-sm sm:text-base text-gray-600">
                  {description}
                </p>
              )}
            </div>
            
            {action && (
              <div className="shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className = '' }: PageContentProps) {
  return (
    <div className={`min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 ${className}`}>
      <Container>
        {children}
      </Container>
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          {description}
        </p>
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
