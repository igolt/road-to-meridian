import React, { useState } from 'react';
import { DeployPlan, DeploymentResult } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EVMDeployer } from '@/deployers/evmDeployer';
import { StellarDeployer } from '@/deployers/stellarDeployer';
import { buildExplorerUrl, generateStellarTOML, copyToClipboard } from '@/core/utils';
import { CheckCircle, ExternalLink, Copy, Download, AlertCircle } from 'lucide-react';

interface Step4PreviewProps {
  plan: DeployPlan;
  onDeploy: (plan: DeployPlan) => void;
}

export const Step4Preview: React.FC<Step4PreviewProps> = ({ plan, onDeploy }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);

  const addProgressMessage = (message: string) => {
    setProgressMessages(prev => [...prev, message]);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setProgressMessages([]);
    setDeploymentResult(null);

    try {
      const deployer = plan.stack === 'EVM' ? new EVMDeployer() : new StellarDeployer();
      
      addProgressMessage('Connecting wallet...');
      await deployer.connectWallet();
      
      addProgressMessage('Ensuring correct network...');
      await deployer.ensureNetwork(plan);
      
      addProgressMessage('Estimating deployment...');
      const estimate = await deployer.estimate(plan);
      addProgressMessage(`Estimated steps: ${estimate.steps.length}`);
      addProgressMessage(`Fees: ${estimate.feesHint}`);
      
      addProgressMessage('Starting deployment...');
      const result = await deployer.deploy(plan, addProgressMessage);
      
      setDeploymentResult(result);
      
      if (result.success) {
        addProgressMessage('Deployment completed successfully!');
      } else {
        addProgressMessage(`Deployment failed: ${result.error}`);
      }
    } catch (error) {
      addProgressMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDeploymentResult({
        success: false,
        artifacts: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const downloadTOML = () => {
    if (deploymentResult?.artifacts.tomlContent) {
      const blob = new Blob([deploymentResult.artifacts.tomlContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stellar.toml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const copyAddress = async (address: string) => {
    await copyToClipboard(address);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Preview & Deploy</h2>
        <p className="text-muted-foreground">
          Review your deployment configuration and deploy your RWA token.
        </p>
      </div>

      {/* Deployment Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Plan</CardTitle>
          <CardDescription>
            Review your token configuration before deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Platform Configuration</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Stack:</strong> {plan.stack}</div>
                <div><strong>Standard:</strong> {plan.standard}</div>
                <div><strong>Network:</strong> {plan.network}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Token Details</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {plan.tokenConfig.name}</div>
                <div><strong>Symbol/Code:</strong> {
                  plan.stack === 'EVM' 
                    ? (plan.tokenConfig as any).symbol 
                    : (plan.tokenConfig as any).assetCode
                }</div>
                <div><strong>Property URI:</strong> {plan.tokenConfig.propertyURI}</div>
                {plan.tokenConfig.description && (
                  <div><strong>Description:</strong> {plan.tokenConfig.description}</div>
                )}
              </div>
            </div>
          </div>

          {plan.complianceRules && Object.keys(plan.complianceRules).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Compliance Rules</h4>
              <div className="space-y-1 text-sm">
                {plan.stack === 'EVM' ? (
                  <>
                    {plan.complianceRules.requireKYC && <div>• KYC Required</div>}
                    {plan.complianceRules.lockups && <div>• Lockups Enabled</div>}
                    {plan.complianceRules.pausable && <div>• Pausable</div>}
                    {plan.complianceRules.snapshots && <div>• Snapshots Enabled</div>}
                  </>
                ) : (
                  <>
                    {plan.complianceRules.authRequired && <div>• Authorization Required</div>}
                    {plan.complianceRules.authRevocable && <div>• Authorization Revocable</div>}
                  </>
                )}
                {plan.complianceRules.whitelist && plan.complianceRules.whitelist.length > 0 && (
                  <div>• Whitelist: {plan.complianceRules.whitelist.length} addresses</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Progress */}
      {isDeploying && (
        <Card>
          <CardHeader>
            <CardTitle>Deployment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {progressMessages.map((message, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Result */}
      {deploymentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {deploymentResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Deployment Successful
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Deployment Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deploymentResult.success ? (
              <>
                {/* Contract Addresses */}
                {deploymentResult.artifacts.tokenAddress && (
                  <div>
                    <h4 className="font-semibold mb-2">Contract Address</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {deploymentResult.artifacts.tokenAddress}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyAddress(deploymentResult.artifacts.tokenAddress)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Stellar Asset ID */}
                {deploymentResult.artifacts.assetId && (
                  <div>
                    <h4 className="font-semibold mb-2">Asset ID</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {deploymentResult.artifacts.assetId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyAddress(deploymentResult.artifacts.assetId)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* TOML Download */}
                {deploymentResult.artifacts.tomlContent && (
                  <div>
                    <h4 className="font-semibold mb-2">Stellar TOML</h4>
                    <Button
                      variant="outline"
                      onClick={downloadTOML}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download stellar.toml
                    </Button>
                  </div>
                )}

                {/* Transaction Links */}
                {deploymentResult.explorerLinks && deploymentResult.explorerLinks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Transaction Links</h4>
                    <div className="space-y-2">
                      {deploymentResult.explorerLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Transaction {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-red-600">
                <strong>Error:</strong> {deploymentResult.error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deploy Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          size="lg"
          className="px-8"
        >
          {isDeploying ? 'Deploying...' : 'Deploy Token'}
        </Button>
      </div>
    </div>
  );
};
