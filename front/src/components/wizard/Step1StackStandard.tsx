import React from 'react';
import { DeployPlan, ChainStack, TokenStandard, Network } from '@/core/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Step1StackStandardProps {
  plan: Partial<DeployPlan>;
  onUpdate: (updates: Partial<DeployPlan>) => void;
}

export const Step1StackStandard: React.FC<Step1StackStandardProps> = ({ plan, onUpdate }) => {
  const handleStackChange = (stack: ChainStack) => {
    onUpdate({ 
      stack,
      standard: stack === 'EVM' ? 'ERC-20' : 'ClassicAsset',
      network: stack === 'EVM' ? 'polygon-amoy' : 'testnet'
    });
  };

  const handleStandardChange = (standard: TokenStandard) => {
    onUpdate({ standard });
  };

  const handleNetworkChange = (network: Network) => {
    onUpdate({ network });
  };

  const getEVMStandards = (): TokenStandard[] => {
    return ['ERC-20', 'ERC-721', 'ERC-1155'];
  };

  const getStellarStandards = (): TokenStandard[] => {
    const standards: TokenStandard[] = ['ClassicAsset'];
    if (import.meta.env.VITE_ENABLE_SOROBAN === 'true') {
      standards.push('SorobanToken');
    }
    return standards;
  };

  const getEVMNetworks = (): { value: Network; label: string }[] => {
    return [
      { value: 'polygon-amoy', label: 'Polygon Amoy (Testnet)' },
      { value: 'polygon', label: 'Polygon Mainnet' }
    ];
  };

  const getStellarNetworks = (): { value: Network; label: string }[] => {
    return [
      { value: 'testnet', label: 'Stellar Testnet' },
      { value: 'mainnet', label: 'Stellar Mainnet' }
    ];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Token Platform</h2>
        <p className="text-muted-foreground">
          Select the blockchain platform and token standard for your RWA token.
        </p>
      </div>

      {/* Chain Stack Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chain Stack</CardTitle>
          <CardDescription>
            Choose between EVM-compatible chains or Stellar for your token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={plan.stack} onValueChange={handleStackChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select chain stack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EVM">EVM (Ethereum, Polygon, etc.)</SelectItem>
              <SelectItem value="Stellar">Stellar</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Token Standard Selection */}
      {plan.stack && (
        <Card>
          <CardHeader>
            <CardTitle>Token Standard</CardTitle>
            <CardDescription>
              {plan.stack === 'EVM' 
                ? 'Choose the ERC token standard for your asset'
                : 'Choose the Stellar token type'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={plan.standard} onValueChange={handleStandardChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select token standard" />
              </SelectTrigger>
              <SelectContent>
                {plan.stack === 'EVM' 
                  ? getEVMStandards().map(standard => (
                      <SelectItem key={standard} value={standard}>
                        {standard}
                      </SelectItem>
                    ))
                  : getStellarStandards().map(standard => (
                      <SelectItem key={standard} value={standard}>
                        {standard === 'ClassicAsset' ? 'Classic Asset (Issuer/Distributor)' : 'Soroban Token'}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Network Selection */}
      {plan.stack && plan.standard && (
        <Card>
          <CardHeader>
            <CardTitle>Network</CardTitle>
            <CardDescription>
              Select the network for deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={plan.network} onValueChange={handleNetworkChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {plan.stack === 'EVM'
                  ? getEVMNetworks().map(network => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))
                  : getStellarNetworks().map(network => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      {plan.stack && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {plan.stack === 'EVM' ? 'EVM Benefits' : 'Stellar Benefits'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.stack === 'EVM' ? (
                  <>
                    <li>• Wide wallet compatibility</li>
                    <li>• Rich DeFi ecosystem</li>
                    <li>• Advanced smart contract features</li>
                    <li>• High transaction throughput</li>
                  </>
                ) : (
                  <>
                    <li>• Fast, low-cost transactions</li>
                    <li>• Built-in compliance features</li>
                    <li>• Native asset issuance</li>
                    <li>• Cross-border capabilities</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Stack:</strong> {plan.stack}</div>
                <div><strong>Standard:</strong> {plan.standard}</div>
                <div><strong>Network:</strong> {plan.network}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
