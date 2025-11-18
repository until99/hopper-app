import type { ReactNode } from 'react';
import Navbar from '../../layout/components/Navbar';
import Notification from '../../../shared/components/Notification';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Notification />
      <main>{children}</main>
    </div>
  );
}
