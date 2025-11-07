import * as React from 'react';
import { useEffect, useState } from 'react';
import { FileText, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { useReportStore } from '@/stores/reportStore';
import { encryptionService } from '@/services/encryption/EncryptionService';

interface DecryptedReportMeta {
  id: string;
  title: string;
  lastModified: number;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'local-only';
}

interface ReportListProps {
  onCreateNew: () => void;
}

export const ReportList: React.FC<ReportListProps> = ({ onCreateNew }) => {
  const { reports, isLoading, error, loadReports, deleteReport } = useReportStore();
  const [decryptedMeta, setDecryptedMeta] = useState<DecryptedReportMeta[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    const decryptTitles = async () => {
      if (reports.length === 0) return;

      setIsDecrypting(true);
      try {
        const decrypted = await Promise.all(
          reports.map(async (report) => {
            try {
              const title = await encryptionService.decrypt(report.encryptedTitle);
              return {
                id: report.id,
                title,
                lastModified: report.lastModified,
                syncStatus: report.syncStatus,
              };
            } catch {
              return {
                id: report.id,
                title: '[Decryption Error]',
                lastModified: report.lastModified,
                syncStatus: report.syncStatus,
              };
            }
          })
        );
        setDecryptedMeta(decrypted);
      } catch (err) {
        console.error('Failed to decrypt report titles:', err);
      } finally {
        setIsDecrypting(false);
      }
    };

    decryptTitles();
  }, [reports]);

  const handleDeleteReport = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteReport(id);
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getSyncStatusBadge = (status: string) => {
    const variants = {
      synced: { variant: 'success' as const, label: 'Synced' },
      pending: { variant: 'warning' as const, label: 'Pending Sync' },
      conflict: { variant: 'error' as const, label: 'Conflict' },
      'local-only': { variant: 'secondary' as const, label: 'Local Only' },
    };

    const config = variants[status as keyof typeof variants] || variants['local-only'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (error) {
    return (
      <Alert variant="error">
        <p className="font-semibold">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </Alert>
    );
  }

  if (isLoading && reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
        <p className="text-text-muted">Loading reports...</p>
      </div>
    );
  }

  if (decryptedMeta.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-text-muted" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          Create your first report to get started with the SSA Adult Function Report assistance.
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Your Reports ({decryptedMeta.length})
        </h2>
        <Button onClick={onCreateNew}>
          <Plus className="h-5 w-5 mr-2" />
          New Report
        </Button>
      </div>

      {isDecrypting && (
        <Alert variant="info">
          <p className="text-sm">Decrypting report titles...</p>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decryptedMeta.map((meta) => (
          <Card key={meta.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{meta.title}</h3>
                  <p className="text-sm text-text-muted">
                    {formatDate(meta.lastModified)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-surface rounded-md transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              {getSyncStatusBadge(meta.syncStatus)}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Open report - coming in Week 3!')}
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReport(meta.id, meta.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
