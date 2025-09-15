import React from 'react';
import { DeployPlan, EVMTokenConfig, StellarTokenConfig } from '@/core/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Step2BasicsProps {
  plan: Partial<DeployPlan>;
  onUpdate: (updates: Partial<DeployPlan>) => void;
}

export const Step2Basics: React.FC<Step2BasicsProps> = ({ plan, onUpdate }) => {
  const updateTokenConfig = (updates: Partial<EVMTokenConfig | StellarTokenConfig>) => {
    const currentConfig = plan.tokenConfig || {};
    onUpdate({
      tokenConfig: {
        ...currentConfig,
        ...updates
      }
    });
  };

  const isEVM = plan.stack === 'EVM';
  const tokenConfig = plan.tokenConfig || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Token Basics</h2>
        <p className="text-muted-foreground">
          Configure the basic properties of your RWA token.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Essential token properties that will be visible to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Token Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Downtown Office Building Token"
              value={(tokenConfig as any).name || ''}
              onChange={(e) => updateTokenConfig({ name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="symbol">
              {isEVM ? 'Token Symbol *' : 'Asset Code *'}
            </Label>
            <Input
              id="symbol"
              placeholder={isEVM ? "e.g., DOBT" : "e.g., DOBT"}
              value={isEVM ? (tokenConfig as EVMTokenConfig).symbol || '' : (tokenConfig as StellarTokenConfig).assetCode || ''}
              onChange={(e) => updateTokenConfig(
                isEVM ? { symbol: e.target.value } : { assetCode: e.target.value }
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isEVM 
                ? 'Short identifier for your token (3-5 characters recommended)'
                : 'Short identifier for your asset (1-12 characters, uppercase letters and numbers only)'
              }
            </p>
          </div>

          <div>
            <Label htmlFor="propertyURI">Property URI *</Label>
            <Input
              id="propertyURI"
              placeholder="https://ipfs.io/ipfs/... or https://example.com/property-docs"
              value={(tokenConfig as any).propertyURI || ''}
              onChange={(e) => updateTokenConfig({ propertyURI: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to property documentation, legal documents, or metadata
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the real-world asset"
              value={(tokenConfig as any).description || ''}
              onChange={(e) => updateTokenConfig({ description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* EVM-specific fields */}
      {isEVM && (
        <Card>
          <CardHeader>
            <CardTitle>EVM Configuration</CardTitle>
            <CardDescription>
              Token-specific settings for EVM chains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input
                id="initialSupply"
                type="number"
                placeholder="1000000"
                value={(tokenConfig as EVMTokenConfig).initialSupply || ''}
                onChange={(e) => updateTokenConfig({ initialSupply: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Initial token supply (will be minted to your wallet)
              </p>
            </div>

            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                type="number"
                min="0"
                max="18"
                placeholder="18"
                value={(tokenConfig as EVMTokenConfig).decimals || 18}
                onChange={(e) => updateTokenConfig({ decimals: parseInt(e.target.value) || 18 })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of decimal places (18 is standard for most tokens)
              </p>
            </div>

            {plan.standard === 'ERC-721' && (
              <div>
                <Label htmlFor="baseTokenURI">Base Token URI (Optional)</Label>
                <Input
                  id="baseTokenURI"
                  placeholder="https://api.example.com/metadata/"
                  value={(tokenConfig as EVMTokenConfig).baseTokenURI || ''}
                  onChange={(e) => updateTokenConfig({ baseTokenURI: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Base URI for NFT metadata (individual token URIs will be {`{baseURI}/{tokenId}`})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stellar-specific fields */}
      {!isEVM && (
        <Card>
          <CardHeader>
            <CardTitle>Stellar Configuration</CardTitle>
            <CardDescription>
              Asset-specific settings for Stellar network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="issuerAccount">Issuer Account</Label>
              <Input
                id="issuerAccount"
                placeholder="G..."
                value={(tokenConfig as StellarTokenConfig).issuerAccount || ''}
                onChange={(e) => updateTokenConfig({ issuerAccount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Stellar account public key (will be connected via Freighter)
              </p>
            </div>

            <div>
              <Label htmlFor="homeDomain">Home Domain (Optional)</Label>
              <Input
                id="homeDomain"
                placeholder="example.com"
                value={(tokenConfig as StellarTokenConfig).homeDomain || ''}
                onChange={(e) => updateTokenConfig({ homeDomain: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Domain for TOML file (e.g., example.com for https://example.com/.well-known/stellar.toml)
              </p>
            </div>

            <div>
              <Label htmlFor="distributionAccount">Distribution Account (Optional)</Label>
              <Input
                id="distributionAccount"
                placeholder="G..."
                value={(tokenConfig as StellarTokenConfig).distributionAccount || ''}
                onChange={(e) => updateTokenConfig({ distributionAccount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Account to receive initial asset distribution (leave empty to use issuer account)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ERC-1155 Tranches */}
      {isEVM && plan.standard === 'ERC-1155' && (
        <Card>
          <CardHeader>
            <CardTitle>Token Tranches</CardTitle>
            <CardDescription>
              Define different tranches for your ERC-1155 token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              ERC-1155 tokens support multiple token types. Add tranches to represent different asset classes or risk levels.
            </p>
            {/* Tranche management UI would go here */}
            <div className="text-center py-4 text-muted-foreground">
              Tranche management coming soon...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
