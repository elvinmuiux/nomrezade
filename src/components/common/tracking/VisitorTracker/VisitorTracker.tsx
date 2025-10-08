'use client';

import { useEffect } from 'react';
import { VisitorUtils } from '@/shared/utils/visitor';

const VisitorTracker = () => {
  useEffect(() => {
    // Track visitor on component mount
    VisitorUtils.trackVisitor();
  }, []);

  return null; // This component doesn't render anything
};

export default VisitorTracker;
