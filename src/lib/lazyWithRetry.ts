import React, { lazy } from 'react';

/**
 * Enhanced React.lazy with automatic chunk retry logic.
 * Resilient against temporary container spin-up pauses, network drops, and mobile reconnects.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3,
  delayMs = 1200
): React.LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remaining: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (remaining <= 0) {
              console.error('Dynamic module load failed after retries:', error);
              reject(error);
              return;
            }
            console.warn(`Dynamic module load failed. Retrying in ${delayMs}ms (${remaining} attempts left)...`);
            setTimeout(() => {
              attempt(remaining - 1);
            }, delayMs);
          });
      };
      attempt(retries);
    })
  );
}
