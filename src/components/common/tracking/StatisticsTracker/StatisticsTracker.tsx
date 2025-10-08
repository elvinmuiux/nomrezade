'use client';

import { useEffect } from 'react';
import { useStatistics } from '@/shared/hooks/useStatistics';

const SESSION_KEY = 'session_tracked';

const StatisticsTracker = () => {
  const { incrementUsers } = useStatistics();

  useEffect(() => {
    // Check if this session has already been tracked
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    // Increment active users and mark session as tracked
    incrementUsers();
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, [incrementUsers]);

  return null; // This component does not render anything
};

export default StatisticsTracker;
