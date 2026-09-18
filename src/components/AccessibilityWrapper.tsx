import React, { useEffect, useRef } from 'react';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  activeModalOpen?: boolean;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({ children, activeModalOpen }) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management & focus trap for modals
  useEffect(() => {
    if (activeModalOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the active dialog or its first input
      const timer = setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          const focusable = dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            (dialog as HTMLElement).focus();
          }
        }
      }, 50);

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return;

        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleTabKey);
      };
    } else {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [activeModalOpen]);

  // Enhance tool cards and interactive elements with ARIA attributes
  useEffect(() => {
    const autoEnhanceCards = () => {
      const cards = document.querySelectorAll('.glass-card, .tool-card');
      cards.forEach((card) => {
        if (card.tagName === 'BUTTON' || card.tagName === 'A') {
          if (!card.getAttribute('aria-label')) {
            const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading && heading.textContent) {
              card.setAttribute('aria-label', `Open ${heading.textContent.trim()}`);
            }
          }
        } else if (card.getAttribute('onclick') || card.classList.contains('cursor-pointer')) {
          if (!card.getAttribute('role')) {
            card.setAttribute('role', 'button');
          }
          if (!card.getAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
          }
          if (!card.getAttribute('aria-label')) {
            const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading && heading.textContent) {
              card.setAttribute('aria-label', `Tool card: ${heading.textContent.trim()}`);
            }
          }
        }
      });
    };

    autoEnhanceCards();
    const timer = setTimeout(autoEnhanceCards, 500);
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};
