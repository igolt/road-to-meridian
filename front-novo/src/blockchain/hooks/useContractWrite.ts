import { useState } from "react";
import { useProvider } from "./useProvider";
import { useWallet } from "../../wallet/WalletProvider";

interface UseContractWrite {
  isWriteLoading: boolean;
  initialize: (admin: string) => Promise<string>;
  registerProperty: (args: {
    builder: string;
    property_name: string;
    ele_quer: bigint | number | string;
    ele_tem: bigint | number | string;
    total_supply: bigint | number | string;
    nome_construtora?: string;
    ipfs?: string;
    sigla?: string;
  }) => Promise<{ txHash: string; newId: bigint }>;
  transferProperty: (args: { from: string; to: string; property_id: bigint | number | string; amount: bigint | number | string }) => Promise<string>;
}

export const useContractWrite = (): UseContractWrite => {
  const [isWriteLoading, setIsWriteLoading] = useState(false);
  const { contract, signAndSend } = useProvider();
  useWallet();

  const signWithFreighter = async (xdr: string, networkPassphrase: string): Promise<string> => {
    const freighter = (globalThis as any)?.freighterApi as any | undefined;
    if (!freighter) throw new Error("Freighter não instalada");
    return freighter.signTransaction(xdr, { networkPassphrase });
  };

  const toI128 = (v: bigint | number | string): bigint => BigInt(v);
  const toU128 = (v: bigint | number | string): bigint => BigInt(v);

  const initialize = async (admin: string): Promise<string> => {
    setIsWriteLoading(true);
    try {
      const tx = await contract(admin).initialize({ admin });
      const hash = await signAndSend(tx.toXDR(), signWithFreighter);
      return hash;
    } finally {
      setIsWriteLoading(false);
    }
  };

  const registerProperty: UseContractWrite["registerProperty"] = async ({ builder, property_name, ele_quer, ele_tem, total_supply, nome_construtora, ipfs, sigla }) => {
    setIsWriteLoading(true);
    try {
      // Tenta chamada completa (contrato com parâmetros estendidos)
      let tx;
      try {
        tx = await (contract(builder) as any).register_property({
          builder,
          property_name,
          ele_quer: toI128(ele_quer) as any,
          ele_tem: toI128(ele_tem) as any,
          total_supply: toI128(total_supply) as any,
          ...(nome_construtora ? { nome_construtora } : {}),
          ...(ipfs ? { ipfs } : {}),
          ...(sigla ? { sigla } : {}),
        });
      } catch (_e) {
        // Fallback para versão curta (contrato antigo em rede)
        tx = await contract(builder).register_property({
          builder,
          property_name,
          ele_quer: toI128(ele_quer) as any,
          ele_tem: toI128(ele_tem) as any,
          total_supply: toI128(total_supply) as any,
        } as any);
      }

      try {
        const sim = await tx.simulate();
        const newId = BigInt(sim.result as unknown as string);
        const txHash = await signAndSend(tx.toXDR(), signWithFreighter);
        return { txHash, newId };
      } catch (simError: any) {
        // Se erro 1001 (Unauthorized), tenta inicializar o contrato primeiro
        if (simError.message && simError.message.includes('#1001')) {
          try {
            // Tenta inicializar - se já foi inicializado, isso vai falhar
            const initTx = await contract(builder).initialize({ admin: builder });
            await initTx.simulate();
            const initTxHash = await signAndSend(initTx.toXDR(), signWithFreighter);
            console.log('Contrato inicializado com sucesso:', initTxHash);
          } catch (initError: any) {
            // Se erro de inicialização, pode ser que já foi inicializado por outro usuário
            console.log('Contrato já foi inicializado por outro usuário');
          }

          // Após tentar inicializar, tenta novamente o register_property
          const retryTx = await contract(builder).register_property({
            builder,
            property_name,
            ele_quer: toI128(ele_quer) as any,
            ele_tem: toI128(ele_tem) as any,
            total_supply: toI128(total_supply) as any,
          } as any);

          const retrySim = await retryTx.simulate();
          const newId = BigInt(retrySim.result as unknown as string);
          const txHash = await signAndSend(retryTx.toXDR(), signWithFreighter);
          return { txHash, newId };
        } else {
          throw simError;
        }
      }
    } finally {
      setIsWriteLoading(false);
    }
  };

  const transferProperty: UseContractWrite["transferProperty"] = async ({ from, to, property_id, amount }) => {
    setIsWriteLoading(true);
    try {
      const tx = await contract(from).transfer_property({
        from,
        to,
        property_id: toU128(property_id) as any,
        amount: toI128(amount) as any,
      });
      const hash = await signAndSend(tx.toXDR(), signWithFreighter);
      return hash;
    } finally {
      setIsWriteLoading(false);
    }
  };

  return { isWriteLoading, initialize, registerProperty, transferProperty };
};


