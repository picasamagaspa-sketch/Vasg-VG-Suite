'use client';

import { Suspense } from 'react';
import SuccessContent from './success-content';

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="success-shell">
          <div className="success-container">
            <div className="loading-state">
              <div className="spinner" />
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
