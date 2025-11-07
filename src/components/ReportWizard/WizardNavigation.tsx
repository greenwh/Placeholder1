/**
 * Wizard Navigation - Back/Next buttons with mobile swipe support
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoBack: boolean;
  isAutoSaving?: boolean;
  lastSaved?: number | null;
  onNext: () => void;
  onBack: () => void;
  className?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoBack,
  isAutoSaving,
  lastSaved,
  onNext,
  onBack,
  className,
}) => {
  const formatLastSaved = (timestamp: number | null) => {
    if (!timestamp) return null;

    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Saved just now';
    if (seconds < 60) return `Saved ${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes}m ago`;

    return 'Saved';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-4 border-t border-border bg-background',
        className
      )}
    >
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack}
        className="min-w-[100px]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Auto-save Status */}
      <div className="flex-1 text-center">
        {isAutoSaving && (
          <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <Save className="h-4 w-4 animate-pulse" />
            <span>Saving...</span>
          </div>
        )}
        {!isAutoSaving && lastSaved && (
          <div className="text-sm text-text-muted">{formatLastSaved(lastSaved)}</div>
        )}
      </div>

      {/* Next Button */}
      {currentStep < totalSteps ? (
        <Button onClick={onNext} disabled={!canGoNext} className="min-w-[100px]">
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext} className="min-w-[100px]">
          Complete
        </Button>
      )}
    </div>
  );
};
