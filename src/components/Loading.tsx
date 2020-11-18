import React from 'react';

import { useTheme } from '@material-ui/core/styles';

export default function Loading(){
  const theme = useTheme();
  return (
    <div style={{
      backgroundColor: theme.palette.background.default,
      width: '100%', height: '100%', zIndex: 10000,
      position: 'fixed', top: 0, left: 0,
      textAlign: 'center',
    }}>
      <div style={{
        position: 'relative', top: '50%',
        transform: 'translateY(-50%)'
      }}>
        <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <path fill="none" stroke={theme.palette.primary.main} strokeWidth="8" strokeDasharray="202.70525329589844 53.883674926757806" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" strokeLinecap="round" style={{ transform: 'scale(0.75)', transformOrigin: '50px 50px' }}>
            <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.4285714285714284s" keyTimes="0;1" values="0;256.58892822265625"></animate>
          </path>
        </svg>
      </div>
    </div>
  );
}
