import React from 'react';
import { DeployPlan, ComplianceRules } from '@/core/types';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Step3RulesProps {
  plan: Partial<DeployPlan>;
  onUpdate: (updates: Partial<DeployPlan>) => void;
}

export const Step3Rules: React.FC<Step3RulesProps> = ({ plan, onUpdate }) => {
  const updateComplianceRules = (updates: Partial<ComplianceRules>) => {
    onUpdate({
      complianceRules: {
        ...plan.complianceRules,
        ...updates
      }
    });
  };

  const isEVM = plan.stack === 'EVM';
  const complianceRules = plan.complianceRules || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Compliance & Rules</h2>
        <p className="text-muted-foreground">
          Configure compliance features and trading restrictions for your RWA token.
        </p>
      </div>

      {/* EVM Compliance Rules */}
      {isEVM && (
        <Card>
          <CardHeader>
            <CardTitle>EVM Compliance Features</CardTitle>
            <CardDescription>
              Enable compliance features for regulatory requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="kyc">Require KYC</Label>
                <p className="text-sm text-muted-foreground">
                  Only allow transfers to whitelisted addresses
                </p>
              </div>
              <Switch
                id="kyc"
                checked={complianceRules.requireKYC || false}
                onCheckedChange={(checked) => updateComplianceRules({ requireKYC: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lockups">Enable Lockups</Label>
                <p className="text-sm text-muted-foreground">
                  Allow time-based token lockups
                </p>
              </div>
              <Switch
                id="lockups"
                checked={complianceRules.lockups || false}
                onCheckedChange={(checked) => updateComplianceRules({ lockups: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pausable">Pausable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow pausing all token transfers
                </p>
              </div>
              <Switch
                id="pausable"
                checked={complianceRules.pausable || false}
                onCheckedChange={(checked) => updateComplianceRules({ pausable: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="snapshots">Snapshots</Label>
                <p className="text-sm text-muted-foreground">
                  Enable balance snapshots for governance
                </p>
              </div>
              <Switch
                id="snapshots"
                checked={complianceRules.snapshots || false}
                onCheckedChange={(checked) => updateComplianceRules({ snapshots: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stellar Compliance Rules */}
      {!isEVM && (
        <Card>
          <CardHeader>
            <CardTitle>Stellar Asset Flags</CardTitle>
            <CardDescription>
              Configure asset flags for compliance and control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="authRequired">Authorization Required</Label>
                <p className="text-sm text-muted-foreground">
                  Require issuer approval for trustlines
                </p>
              </div>
              <Switch
                id="authRequired"
                checked={complianceRules.authRequired || false}
                onCheckedChange={(checked) => updateComplianceRules({ authRequired: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="authRevocable">Authorization Revocable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow revoking trustline authorizations
                </p>
              </div>
              <Switch
                id="authRevocable"
                checked={complianceRules.authRevocable || false}
                onCheckedChange={(checked) => updateComplianceRules({ authRevocable: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Whitelist Configuration */}
      {(complianceRules.requireKYC || complianceRules.authRequired) && (
        <Card>
          <CardHeader>
            <CardTitle>Whitelist Configuration</CardTitle>
            <CardDescription>
              {isEVM 
                ? 'Add addresses to the KYC whitelist'
                : 'Pre-approve trustlines for specific accounts'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whitelist">Addresses (comma-separated)</Label>
              <Input
                id="whitelist"
                placeholder={isEVM ? "0x1234..., 0x5678..." : "G1234..., G5678..."}
                value={complianceRules.whitelist?.join(', ') || ''}
                onChange={(e) => {
                  const addresses = e.target.value
                    .split(',')
                    .map(addr => addr.trim())
                    .filter(addr => addr.length > 0);
                  updateComplianceRules({ whitelist: addresses });
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isEVM 
                  ? 'Enter Ethereum addresses separated by commas'
                  : 'Enter Stellar addresses separated by commas'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lockup Configuration */}
      {complianceRules.lockups && isEVM && (
        <Card>
          <CardHeader>
            <CardTitle>Lockup Configuration</CardTitle>
            <CardDescription>
              Configure time-based token lockups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lockAddress">Address to Lock</Label>
              <Input
                id="lockAddress"
                placeholder="0x..."
                value={complianceRules.lockAddress || ''}
                onChange={(e) => updateComplianceRules({ lockAddress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lockUntil">Lock Until (Unix Timestamp)</Label>
              <Input
                id="lockUntil"
                type="number"
                placeholder="1640995200"
                value={complianceRules.lockUntil || ''}
                onChange={(e) => updateComplianceRules({ lockUntil: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unix timestamp when the lock expires
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Regulatory compliance</li>
              <li>• Investor protection</li>
              <li>• Risk management</li>
              <li>• Legal framework support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {isEVM ? (
                <>
                  <div><strong>KYC Required:</strong> {complianceRules.requireKYC ? 'Yes' : 'No'}</div>
                  <div><strong>Lockups:</strong> {complianceRules.lockups ? 'Yes' : 'No'}</div>
                  <div><strong>Pausable:</strong> {complianceRules.pausable ? 'Yes' : 'No'}</div>
                  <div><strong>Snapshots:</strong> {complianceRules.snapshots ? 'Yes' : 'No'}</div>
                </>
              ) : (
                <>
                  <div><strong>Auth Required:</strong> {complianceRules.authRequired ? 'Yes' : 'No'}</div>
                  <div><strong>Auth Revocable:</strong> {complianceRules.authRevocable ? 'Yes' : 'No'}</div>
                </>
              )}
              {complianceRules.whitelist && complianceRules.whitelist.length > 0 && (
                <div><strong>Whitelist:</strong> {complianceRules.whitelist.length} addresses</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
