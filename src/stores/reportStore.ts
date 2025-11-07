/**
 * Report State Management
 * Manages encrypted reports and their metadata
 */

import { create } from 'zustand';
import { encryptionService } from '@/services/encryption/EncryptionService';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import type { Report, ReportData } from '@/types/storage';

interface ReportState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadReports: () => Promise<void>;
  createReport: (title: string, data: Partial<ReportData>) => Promise<string>;
  updateReport: (id: string, data: Partial<ReportData>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getDecryptedReport: (id: string) => Promise<ReportData | null>;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  isLoading: false,
  error: null,

  loadReports: async () => {
    try {
      set({ isLoading: true, error: null });
      const reports = await indexedDBService.getAllReports();
      set({ reports, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to load reports',
        isLoading: false,
      });
    }
  },

  createReport: async (title: string, data: Partial<ReportData>) => {
    try {
      set({ isLoading: true, error: null });

      const reportId = crypto.randomUUID();
      const now = Date.now();

      const reportData: ReportData = {
        id: reportId,
        title,
        selectedBlueBookListings: data.selectedBlueBookListings || [],
        functionalInputs: data.functionalInputs || [],
        generatedSections: data.generatedSections || [],
        createdAt: now,
        lastModified: now,
      };

      // Encrypt the report data and title
      const encryptedData = await encryptionService.encrypt(
        JSON.stringify(reportData)
      );
      const encryptedTitle = await encryptionService.encrypt(title);

      const report: Report = {
        id: reportId,
        encryptedData,
        encryptedTitle,
        lastModified: now,
        lastSyncTimestamp: null,
        syncStatus: 'local-only',
      };

      await indexedDBService.saveReport(report);

      // Reload reports
      await get().loadReports();
      set({ isLoading: false });

      return reportId;
    } catch (error) {
      set({
        error: 'Failed to create report',
        isLoading: false,
      });
      throw error;
    }
  },

  updateReport: async (id: string, dataUpdates: Partial<ReportData>) => {
    try {
      set({ isLoading: true, error: null });

      // Get existing report
      const existingReport = await indexedDBService.getReport(id);
      if (!existingReport) {
        throw new Error('Report not found');
      }

      // Decrypt existing data
      const existingDataStr = await encryptionService.decrypt(
        existingReport.encryptedData
      );
      const existingData: ReportData = JSON.parse(existingDataStr);

      // Merge updates
      const updatedData: ReportData = {
        ...existingData,
        ...dataUpdates,
        lastModified: Date.now(),
      };

      // Re-encrypt
      const encryptedData = await encryptionService.encrypt(
        JSON.stringify(updatedData)
      );

      // Update title if changed
      let encryptedTitle = existingReport.encryptedTitle;
      if (dataUpdates.title && dataUpdates.title !== existingData.title) {
        encryptedTitle = await encryptionService.encrypt(dataUpdates.title);
      }

      const updatedReport: Report = {
        ...existingReport,
        encryptedData,
        encryptedTitle,
        lastModified: Date.now(),
        syncStatus: 'pending',
      };

      await indexedDBService.saveReport(updatedReport);

      // Reload reports
      await get().loadReports();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to update report',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteReport: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await indexedDBService.deleteReport(id);

      // Reload reports
      await get().loadReports();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to delete report',
        isLoading: false,
      });
      throw error;
    }
  },

  getDecryptedReport: async (id: string) => {
    try {
      const report = await indexedDBService.getReport(id);
      if (!report) {
        return null;
      }

      const decryptedDataStr = await encryptionService.decrypt(
        report.encryptedData
      );
      return JSON.parse(decryptedDataStr) as ReportData;
    } catch (error) {
      set({ error: 'Failed to decrypt report' });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
