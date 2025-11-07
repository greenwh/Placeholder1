/**
 * Wizard Progress Indicator
 * Shows current step and allows navigation between completed steps
 */

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { WizardStep } from './WizardContext';

interface WizardProgressProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

const steps = [
  { step: 1 as WizardStep, label: 'Blue Book', description: 'Select listings' },
  { step: 2 as WizardStep, label: 'Inputs', description: 'Functional data' },
  { step: 3 as WizardStep, label: 'Generate', description: 'AI responses' },
  { step: 4 as WizardStep, label: 'Review', description: 'Final review' },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of 4: {steps[currentStep - 1].label}
          </span>
          <span className="text-xs text-text-muted">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <nav aria-label="Progress" className="hidden md:block">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.step;
            const isCurrent = currentStep === step.step;
            const isClickable = isCompleted || isCurrent;

            return (
              <li key={step.step} className="flex-1 relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 transition-colors',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step Button */}
                <button
                  onClick={() => isClickable && onStepClick?.(step.step)}
                  disabled={!isClickable}
                  className={cn(
                    'relative flex flex-col items-center group',
                    isClickable && 'cursor-pointer',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {/* Circle */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                      isCompleted && 'bg-primary text-white',
                      isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                      !isCompleted && !isCurrent && 'bg-surface text-text-muted border-2 border-border'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.step}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        'text-sm font-medium',
                        isCurrent && 'text-primary',
                        isCompleted && 'text-text',
                        !isCompleted && !isCurrent && 'text-text-muted'
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{step.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
