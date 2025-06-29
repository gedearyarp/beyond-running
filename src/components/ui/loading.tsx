'use client';

import React from 'react';

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

const dotSizeClasses = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2'
};

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Loading text */}
      <div className={`font-medium text-gray-700 tracking-wide ${sizeClasses[size]}`}>
        {text}
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-1">
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '160ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '320ms', animationDuration: '1.4s' }}
        />
      </div>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading size={size} text={text} className={className} />
    </div>
  );
};

// Inline loading for buttons or small areas
export const LoadingInline: React.FC<LoadingProps> = ({ 
  size = 'sm', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-0.5">
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '160ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`bg-gray-700 rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '320ms', animationDuration: '1.4s' }}
        />
      </div>
      <span className={`text-gray-700 ${sizeClasses[size]}`}>{text}</span>
    </div>
  );
};

export default Loading; 