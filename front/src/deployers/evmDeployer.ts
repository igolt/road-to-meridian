import { 
  Deployer, 
  DeployPlan, 
  DeploymentResult, 
  EVMTokenConfig,
  EVMNetwork
} from '@/core/types';
import { 
  parseUnits, 
  buildExplorerUrl, 
  isEVMNetwork,
  formatError 
} from '@/core/utils';
import { encodeFunctionData, createPublicClient, http } from 'viem';

// Network configurations
const NETWORKS = {
  'polygon-amoy': {
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://www.oklink.com/amoy'
  },
  'polygon': {
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
  }
};

// Load ABI dynamically
const loadABI = async (contractName: string) => {
  try {
    const module = await import(`../../EVM/artifacts/contracts/${contractName}.sol/${contractName}.json`);
    return module.default.abi;
  } catch (error) {
    console.error(`Failed to load ABI for ${contractName}:`, error);
    throw new Error(`Contract ABI not found: ${contractName}`);
  }
};

export class EVMDeployer implements Deployer {
  private publicClient: ReturnType<typeof createPublicClient>;

  constructor() {
    this.publicClient = createPublicClient({
      transport: http()
    });
  }

  async connectWallet(): Promise<void> {
    try {
      // For now, we'll assume wallet is connected via RainbowKit
      // In a real implementation, you'd check the connection status
      console.log('Wallet connection handled by RainbowKit');
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${formatError(error)}`);
    }
  }

  async ensureNetwork(plan: DeployPlan): Promise<void> {
    if (!isEVMNetwork(plan.network)) {
      throw new Error('Invalid network for EVM deployer');
    }

    try {
      // Network switching is handled by RainbowKit
      console.log(`Switching to network: ${plan.network}`);
    } catch (error) {
      throw new Error(`Failed to switch to network ${plan.network}: ${formatError(error)}`);
    }
  }

  async estimate(plan: DeployPlan): Promise<{ steps: string[]; feesHint: string }> {
    const steps = [];
    const tokenConfig = plan.tokenConfig as EVMTokenConfig;
    const complianceRules = plan.complianceRules;

    // Step 1: Deploy token contract
    steps.push(`Deploy ${plan.standard} token contract`);
    
    // Step 2: Deploy compliance registry if needed
    if (complianceRules?.requireKYC || complianceRules?.lockups || complianceRules?.pausable) {
      steps.push('Deploy ComplianceRegistry contract');
      steps.push('Configure compliance rules');
    }

    // Step 3: Apply initial operations
    if (tokenConfig.initialSupply) {
      steps.push(`Mint initial supply: ${tokenConfig.initialSupply} ${tokenConfig.symbol}`);
    }

    if (complianceRules?.whitelist && complianceRules.whitelist.length > 0) {
      steps.push(`Apply KYC to ${complianceRules.whitelist.length} addresses`);
    }

    const feesHint = 'Estimated gas: 0.001-0.005 MATIC (depending on compliance features)';
    
    return { steps, feesHint };
  }

  async deploy(plan: DeployPlan, onProgress: (msg: string) => void): Promise<DeploymentResult> {
    try {
      const tokenConfig = plan.tokenConfig as EVMTokenConfig;
      const complianceRules = plan.complianceRules;
      const artifacts: Record<string, string> = {};
      const transactionHashes: string[] = [];
      const explorerLinks: string[] = [];

      onProgress('Starting deployment...');

      // Step 1: Deploy token contract
      onProgress('Deploying token contract...');
      const tokenABI = await loadABI('RealEstateToken');
      
      const tokenConstructorArgs = [
        tokenConfig.name,
        tokenConfig.symbol,
        tokenConfig.initialSupply ? parseUnits(tokenConfig.initialSupply, tokenConfig.decimals || 18) : 0n,
        tokenConfig.propertyURI
      ];

      const tokenDeploymentData = encodeFunctionData({
        abi: tokenABI,
        args: tokenConstructorArgs
      });

      onProgress('Token contract deployment data prepared');
      onProgress('Note: Actual deployment requires wallet integration');

      // For demo purposes, we'll simulate a successful deployment
      const mockTokenAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

      artifacts.tokenAddress = mockTokenAddress;
      transactionHashes.push(mockTxHash);
      explorerLinks.push(buildExplorerUrl(plan.network, 'tx', mockTxHash));

      onProgress('Token contract deployed successfully (simulated)');

      // Step 2: Deploy compliance registry if needed
      if (complianceRules?.requireKYC || complianceRules?.lockups || complianceRules?.pausable) {
        onProgress('Deploying compliance registry...');
        onProgress('Compliance features configured (simulated)');
      }

      // Step 3: Apply initial operations
      if (tokenConfig.initialSupply && tokenConfig.initialSupply !== '0') {
        onProgress('Minting initial supply...');
        onProgress('Initial supply minted successfully (simulated)');
      }

      // Step 4: Apply compliance rules
      if (complianceRules?.whitelist && complianceRules.whitelist.length > 0) {
        onProgress('Applying KYC whitelist...');
        console.log('KYC addresses:', complianceRules.whitelist);
        onProgress(`KYC applied to ${complianceRules.whitelist.length} addresses (simulated)`);
      }

      onProgress('Deployment completed successfully!');

      return {
        success: true,
        artifacts,
        transactionHashes,
        explorerLinks
      };

    } catch (error) {
      const errorMessage = formatError(error);
      onProgress(`Deployment failed: ${errorMessage}`);
      
      return {
        success: false,
        artifacts: {},
        error: errorMessage
      };
    }
  }
}
