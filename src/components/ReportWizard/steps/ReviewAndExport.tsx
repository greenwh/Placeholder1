/**
 * Step 4: Review & Export
 * Final review of all sections with export options
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Download,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useWizard } from '../WizardContext';
import { useReportStore } from '@/stores/reportStore';

// SSA Questions (matching AIGeneration.tsx)
const SSA_QUESTIONS = [
  {
    id: 'daily_routine',
    question: 'Describe what you do from the time you wake up until you go to bed.',
  },
  {
    id: 'household_tasks',
    question: 'Describe your ability to do household chores and yard work.',
  },
  {
    id: 'going_out',
    question: 'Describe your ability to go out alone and use transportation.',
  },
  {
    id: 'social_life',
    question: 'How have your illnesses or conditions affected your social activities and relationships?',
  },
  {
    id: 'physical_limitations',
    question:
      'Describe your physical limitations, including how far you can walk, how much you can lift, and how long you can stand or sit.',
  },
  {
    id: 'mental_limitations',
    question:
      'Describe any difficulties with memory, concentration, following instructions, or handling stress.',
  },
];

export const ReviewAndExport: React.FC = () => {
  const { draftData, goToStep } = useWizard();
  const { createReport } = useReportStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const generatedSections = (draftData.generatedSections as Record<string, string>) || {};
  const blueBookListings = draftData.selectedBlueBookListings || [];
  const functionalInputs = draftData.functionalInputs || {};

  // Calculate completion
  const completedQuestions = SSA_QUESTIONS.filter((q) => generatedSections[q.id]);
  const completionPercent = Math.round((completedQuestions.length / SSA_QUESTIONS.length) * 100);

  // Copy single section to clipboard
  const handleCopySection = async (questionId: string, text: string) => {
    try {
      const question = SSA_QUESTIONS.find((q) => q.id === questionId);
      const formatted = `${question?.question}\n\n${text}`;
      await navigator.clipboard.writeText(formatted);
      setCopiedSection(questionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy entire report to clipboard
  const handleCopyAll = async () => {
    try {
      let fullReport = '=== SSA ADULT FUNCTION REPORT ===\n\n';

      if (blueBookListings.length > 0) {
        fullReport += 'SELECTED DISABILITY LISTINGS:\n';
        fullReport += blueBookListings.map((id) => `• ${id}`).join('\n');
        fullReport += '\n\n';
      }

      fullReport += '=== FUNCTIONAL REPORT RESPONSES ===\n\n';

      SSA_QUESTIONS.forEach((question, index) => {
        const response = generatedSections[question.id];
        if (response) {
          fullReport += `${index + 1}. ${question.question}\n\n`;
          fullReport += `${response}\n\n`;
          fullReport += '---\n\n';
        }
      });

      fullReport += `Generated on: ${new Date().toLocaleDateString()}\n`;

      await navigator.clipboard.writeText(fullReport);
      setCopiedSection('all');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  // Print report
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Save report to IndexedDB
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Create report title
      const reportTitle = `SSA Report - ${new Date().toLocaleDateString()}`;

      // Prepare report data
      const reportData = {
        title: reportTitle,
        selectedBlueBookListings: blueBookListings,
        functionalInputs: functionalInputs,
        generatedSections: generatedSections,
        createdAt: Date.now(),
        lastModified: Date.now(),
      };

      // Save using reportStore
      await createReport(reportTitle, reportData);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save report:', err);
      setSaveError(err.message || 'Failed to save report');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Print Styles */}
      {isPrinting && (
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}</style>
      )}

      {/* Header */}
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-2">Review Your Report</h2>
        <p className="text-text-muted">
          Review all sections below, then save or export your completed report
        </p>
      </div>

      {/* Completion Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Completion Status</h3>
            <p className="text-sm text-text-muted mt-1">
              {completedQuestions.length} of {SSA_QUESTIONS.length} questions answered
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{completionPercent}%</div>
            <p className="text-sm text-text-muted">Complete</p>
          </div>
        </div>

        <div className="h-3 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {completionPercent < 100 && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-5 w-5" />
            <div className="ml-2">
              <p className="font-semibold">Incomplete Report</p>
              <p className="text-sm mt-1">
                Some questions haven't been answered. You can still save this report, but consider
                completing all sections for the best results.
              </p>
            </div>
          </Alert>
        )}
      </Card>

      {/* Export Options */}
      <Card className="p-6 no-print">
        <h3 className="text-xl font-semibold mb-4">Export Options</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button onClick={handleCopyAll} variant="outline" className="w-full">
            {copiedSection === 'all' ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 mr-2" />
                Copy All
              </>
            )}
          </Button>
          <Button onClick={handlePrint} variant="outline" className="w-full">
            <Printer className="h-5 w-5 mr-2" />
            Print
          </Button>
          <Button onClick={handleSave} isLoading={isSaving} className="w-full">
            <Save className="h-5 w-5 mr-2" />
            Save Report
          </Button>
          <Button variant="outline" className="w-full" disabled>
            <Download className="h-5 w-5 mr-2" />
            PDF (Coming Soon)
          </Button>
        </div>

        {saveSuccess && (
          <Alert variant="success" className="mt-4">
            <CheckCircle className="h-5 w-5" />
            <div className="ml-2">
              <p className="font-semibold">Report Saved!</p>
              <p className="text-sm mt-1">
                Your report has been encrypted and saved to your device. You can access it from the
                Dashboard.
              </p>
            </div>
          </Alert>
        )}

        {saveError && (
          <Alert variant="error" className="mt-4">
            <AlertCircle className="h-5 w-5" />
            <div className="ml-2">
              <p className="font-semibold">Save Failed</p>
              <p className="text-sm mt-1">{saveError}</p>
            </div>
          </Alert>
        )}
      </Card>

      {/* Report Content */}
      <div id="print-content" className="space-y-6">
        {/* Blue Book Listings Summary */}
        {blueBookListings.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selected Disability Listings</h3>
              <Button variant="ghost" size="sm" onClick={() => goToStep(1)} className="no-print">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blueBookListings.map((listing) => (
                <Badge key={listing} variant="default">
                  {listing}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Generated Responses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Functional Report Responses</h3>

          {SSA_QUESTIONS.map((question, index) => {
            const response = generatedSections[question.id];
            const hasResponse = !!response;

            return (
              <Card key={question.id} className={`p-6 ${!hasResponse ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={hasResponse ? 'success' : 'secondary'}>
                        Question {index + 1}
                      </Badge>
                      {hasResponse && <CheckCircle className="h-5 w-5 text-success" />}
                    </div>
                    <h4 className="font-semibold text-lg">{question.question}</h4>
                  </div>
                  {hasResponse && (
                    <div className="flex gap-2 no-print">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection(question.id, response)}
                      >
                        {copiedSection === question.id ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {hasResponse ? (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-text">{response}</p>
                    <p className="text-sm text-text-muted mt-2">{response.length} characters</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No response generated for this question</p>
                    <Button variant="outline" size="sm" onClick={() => goToStep(3)} className="mt-3">
                      Generate Response
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-text-muted pt-6 border-t border-border">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <p className="mt-2 no-print">
            This report is encrypted and stored securely on your device. Remember to keep your
            passphrase safe.
          </p>
        </div>
      </div>
    </div>
  );
};
