/**
 * Step 2: Functional Inputs
 * Dynamic form generation based on SSA-3373 schema
 * Progressive disclosure: shows one question group at a time
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useWizard } from '../WizardContext';
import { FORM_QUESTION_GROUPS } from '@/config/form-questions';
import type { FormQuestion, SSAFormData } from '@/types/ssa-form';

export const FunctionalInputs: React.FC = () => {
  const { draftData, updateDraftData } = useWizard();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<SSAFormData>>(
    (draftData.functionalInputs as Partial<SSAFormData>) || {}
  );

  const currentGroup = FORM_QUESTION_GROUPS[currentGroupIndex];
  const totalGroups = FORM_QUESTION_GROUPS.length;

  // Update wizard data when form data changes
  useEffect(() => {
    updateDraftData({
      functionalInputs: formData,
    });
  }, [formData, updateDraftData]);

  // Get value from nested object path
  const getValueByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Set value in nested object path
  const setValueByPath = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = { ...current[key] };
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return result;
  };

  // Check if a question should be shown based on conditionals
  const shouldShowQuestion = (question: FormQuestion): boolean => {
    if (!question.conditional) return true;

    const dependentValue = getValueByPath(formData, question.conditional.dependsOn);
    return dependentValue === question.conditional.value;
  };

  // Handle input change
  const handleChange = (question: FormQuestion, value: any) => {
    setFormData((prev) => setValueByPath(prev, question.path, value));
  };

  // Handle checkbox list change
  const handleChecklistChange = (question: FormQuestion, option: string, checked: boolean) => {
    const currentValue = (getValueByPath(formData, question.path) as string[]) || [];
    let newValue: string[];

    if (checked) {
      newValue = [...currentValue, option];
    } else {
      newValue = currentValue.filter((v) => v !== option);
    }

    setFormData((prev) => setValueByPath(prev, question.path, newValue));
  };

  // Render input based on question type
  const renderInput = (question: FormQuestion) => {
    const value = getValueByPath(formData, question.path);

    switch (question.type) {
      case 'boolean':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                checked={value === true}
                onChange={() => handleChange(question, true)}
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                checked={value === false}
                onChange={() => handleChange(question, false)}
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span>No</span>
            </label>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(question, e.target.value)}
            placeholder={question.placeholder}
            className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        );

      case 'checklist':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const currentValue = (getValueByPath(formData, question.path) as string[]) || [];
              const isChecked = currentValue.includes(option);

              return (
                <label
                  key={option}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-surface cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleChecklistChange(question, option, e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'time':
      case 'date':
      case 'phone':
      case 'ssn':
      case 'text':
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(question, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
          />
        );
    }
  };

  // Calculate overall completion
  const completedGroups = FORM_QUESTION_GROUPS.filter((group, index) => {
    if (index > currentGroupIndex) return false;
    const visibleQuestions = group.questions.filter((q) => {
      if (!q.conditional) return true;
      const dependentValue = getValueByPath(formData, q.conditional.dependsOn);
      return dependentValue === q.conditional.value;
    });
    return visibleQuestions.some((q) => {
      const value = getValueByPath(formData, q.path);
      return value !== undefined && value !== null && value !== '';
    });
  }).length;

  const progressPercent = Math.round((completedGroups / totalGroups) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Section {currentGroupIndex + 1} of {totalGroups}
          </span>
          <span className="font-medium">{progressPercent}% Complete</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Group */}
      <div className="border border-border rounded-lg p-6 bg-surface">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="default">{currentGroupIndex + 1}</Badge>
            <h2 className="text-2xl font-bold">{currentGroup.title}</h2>
          </div>
          <p className="text-text-muted">{currentGroup.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentGroup.questions.filter(shouldShowQuestion).map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block font-medium">
                {question.label}
                {question.required && <span className="text-error ml-1">*</span>}
              </label>
              {question.helpText && (
                <p className="text-sm text-text-muted">{question.helpText}</p>
              )}
              {renderInput(question)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 py-4">
        <Button
          variant="outline"
          onClick={() => setCurrentGroupIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentGroupIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Section
        </Button>

        <div className="flex gap-2">
          {FORM_QUESTION_GROUPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGroupIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentGroupIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-border-hover'
              )}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>

        {currentGroupIndex < totalGroups - 1 ? (
          <Button onClick={() => setCurrentGroupIndex((prev) => Math.min(totalGroups - 1, prev + 1))}>
            Next Section
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => {}} className="bg-success hover:bg-success/90">
            <Check className="h-4 w-4 mr-2" />
            Complete Inputs
          </Button>
        )}
      </div>

      {/* Summary of completed sections */}
      <div className="border-t border-border pt-4">
        <p className="text-sm text-text-muted mb-2">Completed Sections:</p>
        <div className="flex flex-wrap gap-2">
          {FORM_QUESTION_GROUPS.map((group, index) => {
            const hasData = group.questions.some((q) => {
              const value = getValueByPath(formData, q.path);
              return value !== undefined && value !== null && value !== '';
            });

            return (
              <Badge
                key={group.id}
                variant={hasData ? 'success' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setCurrentGroupIndex(index)}
              >
                {hasData && <Check className="h-3 w-3 mr-1" />}
                {group.title}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
