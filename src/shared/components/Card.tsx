import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <div className={`px-6 py-5 border-b border-gray-200 bg-gray-50 ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
    return (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
    return (
        <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
            {children}
        </p>
    );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
    return (
        <div className={`px-6 py-5 ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`} {...props}>
            {children}
        </div>
    );
}
