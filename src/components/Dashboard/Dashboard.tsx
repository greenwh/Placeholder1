import * as React from 'react';
import { ReportList } from './ReportList';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Zap, Cloud } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-muted">
          Manage your SSA Adult Function Reports securely and privately
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Security</p>
                <p className="text-lg font-semibold">End-to-End Encrypted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Storage</p>
                <p className="text-lg font-semibold">Local-First</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Cloud className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Cloud Sync</p>
                <p className="text-lg font-semibold">Optional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <ReportList />
    </div>
  );
};
