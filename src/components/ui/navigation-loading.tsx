'use client';

import { useNavigationLoading } from '@/hooks/use-navigation-loading';

export default function NavigationLoading() {
  const { isNavigating } = useNavigationLoading();

  // This component doesn't render anything visible
  // It just uses the hook to trigger loading state during navigation
  return null;
} 