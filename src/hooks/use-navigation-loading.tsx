'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from './use-loading';

export const useNavigationLoading = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // Show loading when navigation starts
    setIsNavigating(true);
    showLoading('Loading page...');

    // Hide loading after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsNavigating(false);
      hideLoading();
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsNavigating(false);
      hideLoading();
    };
  }, [pathname, searchParams, showLoading, hideLoading]);

  return { isNavigating };
}; 