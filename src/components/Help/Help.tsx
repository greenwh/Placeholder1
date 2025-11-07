import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  Shield,
  HelpCircle,
  Lock,
  FileText,
  Book,
  ExternalLink
} from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & About</h1>
        <p className="text-text-muted">
          Learn about SSA Form-Assist and how to use it securely
        </p>
      </div>

      {/* Critical Disclaimers */}
      <Alert variant="error">
        <p className="font-semibold text-lg mb-2">IMPORTANT DISCLAIMERS</p>
        <ul className="space-y-2 text-sm">
          <li>• This application is <strong>NOT affiliated with the Social Security Administration</strong></li>
          <li>• This tool provides <strong>GUIDANCE ONLY</strong> and does not constitute legal or medical advice</li>
          <li>• You are <strong>SOLELY RESPONSIBLE</strong> for the accuracy of information submitted to the SSA</li>
          <li>• Always <strong>REVIEW AND VERIFY</strong> all generated content before submission</li>
        </ul>
      </Alert>

      {/* About SSA Form-Assist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            About SSA Form-Assist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            SSA Form-Assist is a privacy-first Progressive Web Application designed to help individuals
            complete the SSA Adult Function Report (Form SSA-3373) using AI assistance while maintaining
            HIPAA-level security through client-side encryption.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-surface border border-border">
              <Shield className="h-6 w-6 text-success mb-2" />
              <h3 className="font-semibold mb-1">Privacy-First</h3>
              <p className="text-sm text-text-muted">
                All your data is encrypted on your device before storage. We never have access to your information.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border">
              <Lock className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Zero-Knowledge</h3>
              <p className="text-sm text-text-muted">
                Your passphrase never leaves your device and is never stored anywhere.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <p className="font-medium">Select Blue Book Listings</p>
                <p className="text-sm text-text-muted">
                  Choose the SSA Blue Book listings that apply to your disability
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <p className="font-medium">Answer Questions</p>
                <p className="text-sm text-text-muted">
                  Provide information about your functional limitations in plain language
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <p className="font-medium">Generate AI Responses</p>
                <p className="text-sm text-text-muted">
                  AI helps formulate your answers in appropriate language for SSA forms
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                4
              </span>
              <div>
                <p className="font-medium">Review and Edit</p>
                <p className="text-sm text-text-muted">
                  Always review, edit, and verify all generated content for accuracy
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                5
              </span>
              <div>
                <p className="font-medium">Export and Submit</p>
                <p className="text-sm text-text-muted">
                  Export your completed report and submit it through official SSA channels
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">End-to-End Encryption</h4>
              <p className="text-sm text-text-muted">
                All your data is encrypted using AES-256-GCM encryption before being stored locally
                on your device. Your passphrase is the encryption key.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">No Server Storage</h4>
              <p className="text-sm text-text-muted">
                Your data never leaves your device unless you choose to enable optional cloud sync
                to your personal cloud storage account.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Passphrase Security</h4>
              <p className="text-sm text-text-muted">
                Your passphrase uses PBKDF2 with 600,000+ iterations for key derivation. The
                passphrase is never stored and only exists in memory during your session.
              </p>
            </div>
          </div>

          <Alert variant="warning">
            <p className="text-sm">
              <strong>Critical:</strong> If you lose your passphrase, there is NO WAY to recover your
              data. Please store your passphrase securely using a password manager.
            </p>
          </Alert>
        </CardContent>
      </Card>

      {/* Official Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Official SSA Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li>
              <a
                href="https://www.ssa.gov/forms/ssa-3373.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Form SSA-3373-BK (Official PDF)
              </a>
            </li>
            <li>
              <a
                href="https://www.ssa.gov/disability/professionals/bluebook/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                SSA Blue Book - Disability Evaluation
              </a>
            </li>
            <li>
              <a
                href="https://www.ssa.gov/disability/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                SSA Disability Benefits Homepage
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-text-muted">
            <p>SSA Form-Assist v0.1.0</p>
            <p className="mt-1">Built with privacy and security as the top priorities</p>
            <p className="mt-2 text-xs">
              This tool is not affiliated with or endorsed by the Social Security Administration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
