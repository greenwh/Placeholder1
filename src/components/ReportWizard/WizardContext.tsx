/**
 * Wizard Context - Manages wizard state and navigation
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReportData } from '@/types/storage';

export type WizardStep = 1 | 2 | 3 | 4;

interface WizardState {
  currentStep: WizardStep;
  reportId: string | null;
  draftData: Partial<ReportData>;
  isAutoSaving: boolean;
  lastSaved: number | null;
}

interface WizardContextType extends WizardState {
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateDraftData: (data: Partial<ReportData>) => void;
  saveDraft: () => Promise<void>;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
};

interface WizardProviderProps {
  children: React.ReactNode;
  reportId?: string;
  initialData?: Partial<ReportData>;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  reportId: initialReportId,
  initialData,
}) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    reportId: initialReportId || null,
    draftData: initialData || {},
    isAutoSaving: false,
    lastSaved: null,
  });

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(4, prev.currentStep + 1) as WizardStep,
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as WizardStep,
    }));
  }, []);

  const updateDraftData = useCallback((data: Partial<ReportData>) => {
    setState((prev) => ({
      ...prev,
      draftData: { ...prev.draftData, ...data },
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    setState((prev) => ({ ...prev, isAutoSaving: true }));

    try {
      // TODO: Implement actual save to IndexedDB via reportStore
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate save

      setState((prev) => ({
        ...prev,
        isAutoSaving: false,
        lastSaved: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to save draft:', error);
      setState((prev) => ({ ...prev, isAutoSaving: false }));
    }
  }, []);

  const resetWizard = useCallback(() => {
    setState({
      currentStep: 1,
      reportId: null,
      draftData: {},
      isAutoSaving: false,
      lastSaved: null,
    });
  }, []);

  const value: WizardContextType = {
    ...state,
    goToStep,
    nextStep,
    previousStep,
    updateDraftData,
    saveDraft,
    resetWizard,
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};
