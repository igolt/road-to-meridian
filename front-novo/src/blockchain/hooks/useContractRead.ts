import { useProvider } from "./useProvider";
import { useState } from "react";
import type { Property } from "@/blockchain/lib/src";

export interface UseContractReadReturn {
  isReadLoading: boolean;
  getProperty: (propertyId: bigint | number | string) => Promise<Property | null>;
  simulateBalance: (investment: bigint | number | string, property: Property) => Promise<bigint>;
}

export const useContractRead = (): UseContractReadReturn => {
  const [isReadLoading, setIsReadLoading] = useState(false);
  const { contract } = useProvider();

  const toU128 = (v: bigint | number | string): bigint => BigInt(v);
  const toI128 = (v: bigint | number | string): bigint => BigInt(v);

  const getProperty = async (propertyId: bigint | number | string): Promise<Property | null> => {
    setIsReadLoading(true);
    try {
      const tx = await contract().get_property({ property_id: toU128(propertyId) as any });
      const sim = await tx.simulate();
      return sim.result as Property;
    } catch {
      return null;
    } finally {
      setIsReadLoading(false);
    }
  };

  const simulateBalance = async (
    investment: bigint | number | string,
    property: Property
  ): Promise<bigint> => {
    const tx = await contract().balance({ investment: toI128(investment) as any, property });
    const sim = await tx.simulate();
    return BigInt(sim.result as unknown as string);
  };

  return { isReadLoading, getProperty, simulateBalance };
};


