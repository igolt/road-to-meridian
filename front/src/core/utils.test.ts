import { describe, it, expect } from 'vitest';
import { 
  isValidEthereumAddress, 
  isValidStellarAddress, 
  parseUnits, 
  formatUnits,
  buildExplorerUrl 
} from './utils';

describe('Address Validation', () => {
  describe('isValidEthereumAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidEthereumAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')).toBe(true);
      expect(isValidEthereumAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      expect(isValidEthereumAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b')).toBe(false); // too short
      expect(isValidEthereumAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6a')).toBe(false); // too long
      expect(isValidEthereumAddress('742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')).toBe(false); // no 0x prefix
      expect(isValidEthereumAddress('')).toBe(false);
    });
  });

  describe('isValidStellarAddress', () => {
    it('should validate correct Stellar addresses', () => {
      expect(isValidStellarAddress('GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ')).toBe(true);
    });

    it('should reject invalid Stellar addresses', () => {
      expect(isValidStellarAddress('GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674J')).toBe(false); // too short
      expect(isValidStellarAddress('GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZZ')).toBe(false); // too long
      expect(isValidStellarAddress('')).toBe(false);
    });
  });
});

describe('Number Formatting', () => {
  describe('parseUnits', () => {
    it('should parse whole numbers correctly', () => {
      expect(parseUnits('1000', 18)).toBe(BigInt('1000000000000000000000'));
      expect(parseUnits('1', 6)).toBe(BigInt('1000000'));
    });

    it('should parse decimal numbers correctly', () => {
      expect(parseUnits('1.5', 18)).toBe(BigInt('1500000000000000000'));
      expect(parseUnits('0.123456', 6)).toBe(BigInt('123456'));
    });

    it('should handle zero values', () => {
      expect(parseUnits('0', 18)).toBe(BigInt('0'));
      expect(parseUnits('0.0', 6)).toBe(BigInt('0'));
    });
  });

  describe('formatUnits', () => {
    it('should format whole numbers correctly', () => {
      expect(formatUnits(BigInt('1000000000000000000000'), 18)).toBe('1000.0');
      expect(formatUnits(BigInt('1000000'), 6)).toBe('1.0');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatUnits(BigInt('1500000000000000000'), 18)).toBe('1.5');
      expect(formatUnits(BigInt('123456'), 6)).toBe('0.123456');
    });

    it('should handle zero values', () => {
      expect(formatUnits(BigInt('0'), 18)).toBe('0.0');
    });
  });
});

describe('URL Building', () => {
  describe('buildExplorerUrl', () => {
    it('should build EVM explorer URLs correctly', () => {
      const txHash = '0x1234567890abcdef';
      const address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      expect(buildExplorerUrl('polygon-amoy', 'tx', txHash))
        .toBe('https://www.oklink.com/amoy/tx/0x1234567890abcdef');
      
      expect(buildExplorerUrl('polygon', 'address', address))
        .toBe('https://polygonscan.com/address/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    });

    it('should build Stellar explorer URLs correctly', () => {
      const txHash = 'abc123def456';
      const address = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      
      expect(buildExplorerUrl('testnet', 'tx', txHash))
        .toBe('https://testnet.stellarchain.io/tx/abc123def456');
      
      expect(buildExplorerUrl('mainnet', 'address', address))
        .toBe('https://stellar.expert/address/GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ');
    });
  });
});
