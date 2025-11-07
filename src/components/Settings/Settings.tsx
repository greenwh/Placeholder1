import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Lock, Key, Cloud, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import { encryptionService } from '@/services/encryption/EncryptionService';
import { hasEnvAPIKeys, getEnvConfiguredProviders, getAPIConfigFromEnv } from '@/utils/env';

export const Settings: React.FC = () => {
  const { lock } = useAuthStore();
  const [selectedLLM, setSelectedLLM] = useState<'gemini' | 'openai' | 'claude' | 'xai'>('gemini');
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    claude: '',
    xai: '',
  });
  const [modelConfigs, setModelConfigs] = useState({
    gemini: 'gemini-2.0-flash-exp',
    openai: 'gpt-4o-mini',
    claude: 'claude-sonnet-4-5-20250929',
    xai: 'grok-beta',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hasEnvKeys = hasEnvAPIKeys();
  const envProviders = getEnvConfiguredProviders();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await indexedDBService.getConfig();
      if (config) {
        setSelectedLLM(config.selectedLLM);

        // Decrypt API keys
        const decryptedKeys = await encryptionService.decrypt(config.encryptedAPIKeys);
        const keys = JSON.parse(decryptedKeys);
        setApiKeys(keys);

        // Decrypt model configs if available
        if (config.encryptedModelConfigs) {
          try {
            const decryptedModels = await encryptionService.decrypt(config.encryptedModelConfigs);
            const models = JSON.parse(decryptedModels);
            setModelConfigs(models);
          } catch (err) {
            console.error('Failed to decrypt model configs:', err);
          }
        }
      }

      // Load environment variable API keys and models if available (pre-populate)
      if (hasEnvKeys) {
        const envConfig = getAPIConfigFromEnv();

        // Pre-populate API keys from env (can be overridden)
        setApiKeys(prev => ({
          gemini: envConfig.google?.apiKey || prev.gemini,
          openai: envConfig.openai?.apiKey || prev.openai,
          claude: envConfig.anthropic?.apiKey || prev.claude,
          xai: envConfig.xai?.apiKey || prev.xai,
        }));

        // Pre-populate model names from env (can be overridden)
        setModelConfigs(prev => ({
          gemini: envConfig.google?.model || prev.gemini,
          openai: envConfig.openai?.model || prev.openai,
          claude: envConfig.anthropic?.model || prev.claude,
          xai: envConfig.xai?.model || prev.xai,
        }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const config = await indexedDBService.getConfig();
      if (!config) {
        throw new Error('Config not found');
      }

      // Encrypt API keys
      const encryptedAPIKeys = await encryptionService.encrypt(JSON.stringify(apiKeys));

      // Encrypt model configs
      const encryptedModelConfigs = await encryptionService.encrypt(JSON.stringify(modelConfigs));

      await indexedDBService.saveConfig({
        ...config,
        selectedLLM,
        encryptedAPIKeys,
        encryptedModelConfigs,
        lastModified: Date.now(),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-text-muted">
          Configure your LLM provider, security settings, and preferences
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success">
          <p className="font-semibold">Settings Saved</p>
          <p className="text-sm mt-1">Your settings have been saved and encrypted successfully.</p>
        </Alert>
      )}

      {/* LLM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            LLM Provider Configuration
          </CardTitle>
          <CardDescription>
            Configure your AI provider API keys and models. All settings are encrypted before storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Variable Status */}
          {hasEnvKeys && (
            <Alert variant="info">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Environment Variables Detected</p>
                  <p className="text-sm mt-1">
                    Pre-populated from .env file for: {envProviders.join(', ')}
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    You can override these values below. Your changes will be saved to encrypted storage.
                  </p>
                </div>
              </div>
            </Alert>
          )}

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Default Provider
            </label>
            <select
              value={selectedLLM}
              onChange={(e) => setSelectedLLM(e.target.value as any)}
              className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="claude">Anthropic Claude</option>
              <option value="xai">xAI (Grok)</option>
            </select>
          </div>

          {/* API Keys and Models */}
          <div className="space-y-6">
            {/* Gemini */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Google Gemini
                {selectedLLM === 'gemini' && <Badge variant="success">Selected</Badge>}
              </h3>
              <Input
                type="password"
                label="API Key"
                placeholder="AIza..."
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                helpText="Get your API key from Google AI Studio"
              />
              <Input
                type="text"
                label="Model Name"
                placeholder="gemini-2.0-flash-exp"
                value={modelConfigs.gemini}
                onChange={(e) => setModelConfigs({ ...modelConfigs, gemini: e.target.value })}
                helpText="e.g., gemini-2.0-flash-exp, gemini-1.5-pro"
              />
            </div>

            {/* OpenAI */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                OpenAI
                {selectedLLM === 'openai' && <Badge variant="success">Selected</Badge>}
              </h3>
              <Input
                type="password"
                label="API Key"
                placeholder="sk-..."
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                helpText="Get your API key from platform.openai.com"
              />
              <Input
                type="text"
                label="Model Name"
                placeholder="gpt-4o-mini"
                value={modelConfigs.openai}
                onChange={(e) => setModelConfigs({ ...modelConfigs, openai: e.target.value })}
                helpText="e.g., gpt-4o-mini, gpt-4o, gpt-4-turbo"
              />
            </div>

            {/* Claude */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Anthropic Claude
                {selectedLLM === 'claude' && <Badge variant="success">Selected</Badge>}
              </h3>
              <Input
                type="password"
                label="API Key"
                placeholder="sk-ant-..."
                value={apiKeys.claude}
                onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
                helpText="Get your API key from console.anthropic.com"
              />
              <Input
                type="text"
                label="Model Name"
                placeholder="claude-sonnet-4-5-20250929"
                value={modelConfigs.claude}
                onChange={(e) => setModelConfigs({ ...modelConfigs, claude: e.target.value })}
                helpText="e.g., claude-sonnet-4-5-20250929, claude-3-5-sonnet-20241022"
              />
            </div>

            {/* xAI */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                xAI (Grok)
                {selectedLLM === 'xai' && <Badge variant="success">Selected</Badge>}
              </h3>
              <Input
                type="password"
                label="API Key"
                placeholder="xai-..."
                value={apiKeys.xai}
                onChange={(e) => setApiKeys({ ...apiKeys, xai: e.target.value })}
                helpText="Get your API key from console.x.ai"
              />
              <Input
                type="text"
                label="Model Name"
                placeholder="grok-beta"
                value={modelConfigs.xai}
                onChange={(e) => setModelConfigs({ ...modelConfigs, xai: e.target.value })}
                helpText="e.g., grok-beta, grok-2"
              />
            </div>
          </div>

          <Alert variant="info">
            <p className="text-sm">
              <strong>Note:</strong> API keys and model names are encrypted with your passphrase before being stored.
              You'll be charged directly by the provider based on your usage.
            </p>
          </Alert>

          <Button onClick={handleSaveSettings} isLoading={isSaving}>
            Save API Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your security and session preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <p className="font-medium">Auto-Lock Timeout</p>
              <p className="text-sm text-text-muted">
                Currently set to 30 minutes
              </p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <p className="font-medium">Session Status</p>
              <p className="text-sm text-text-muted">
                Your session is currently unlocked
              </p>
            </div>
            <Button variant="outline" onClick={lock}>
              Lock Now
            </Button>
          </div>

          <Alert variant="warning">
            <p className="text-sm">
              <strong>Remember:</strong> If you forget your passphrase, there is no way to recover your data.
              Consider using a password manager to store it securely.
            </p>
          </Alert>
        </CardContent>
      </Card>

      {/* Cloud Sync (Future Feature) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Sync (Coming Soon)
          </CardTitle>
          <CardDescription>
            Optionally sync your encrypted data to your personal cloud storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="info">
            <p className="text-sm">
              Cloud sync will be available in a future update. Your data will remain encrypted
              and synced to your personal OneDrive or Google Drive account.
            </p>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
