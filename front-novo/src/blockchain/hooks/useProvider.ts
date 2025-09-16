import { Client, networks } from "@/blockchain/lib/src";
import { Transaction } from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";
import type { Server as SorobanServer } from "@stellar/stellar-sdk/rpc";

export interface UseProviderReturn {
  contract: (publicKey?: string) => Client;
  sorobanServer: SorobanServer;
  signAndSend: (xdr: string, sign: (xdr: string, networkPassphrase: string) => Promise<string>) => Promise<string>;
}

export const useProvider = (): UseProviderReturn => {
  const SOROBAN_RPC_ENDPOINT = "https://soroban-testnet.stellar.org";
  const sorobanServer = new Server(SOROBAN_RPC_ENDPOINT);

  const contract = (publicKey?: string) => {
    const options: any = {
      contractId: networks.testnet.contractId,
      networkPassphrase: networks.testnet.networkPassphrase,
      rpcUrl: SOROBAN_RPC_ENDPOINT,
    };
    if (publicKey) options.publicKey = publicKey;
    return new Client(options);
  };

  const signAndSend = async (
    xdr: string,
    sign: (xdr: string, networkPassphrase: string) => Promise<string>
  ) => {
    const signedXdr = await sign(xdr, networks.testnet.networkPassphrase);
    const tx = new (Transaction as any)(signedXdr, networks.testnet.networkPassphrase);
    const result = await sorobanServer.sendTransaction(tx);
    let status = result.status as string;
    while (status === "PENDING") {
      const txResult = await sorobanServer.getTransaction(result.hash);
      status = txResult.status as string;
    }
    return result.hash as string;
  };

  return { contract, sorobanServer, signAndSend };
};


