import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  ClientOptions as ContractClientOptions,
  MethodOptions,
  u128,
  i128,
} from '@stellar/stellar-sdk/contract';

// Exportações específicas do stellar-sdk para evitar problemas de interop
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAZ6XYLIPSTTBLN4SPKZJBOBN6GG52XXASQHQ5UXYEVG2EZ7O3X7HNOS",
  }
} as const


export interface Property {
  builder: string;
  ele_quer: i128;
  ele_tem: i128;
  id: u128;
  name: string;
  total_supply: i128;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a register_property transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register_property: ({builder, property_name, ele_quer, ele_tem, total_supply}: {builder: string, property_name: string, ele_quer: i128, ele_tem: i128, total_supply: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_property transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_property: ({property_id}: {property_id: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Property>>

  /**
   * Construct and simulate a transfer_property transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_property: ({from, to, property_id, amount}: {from: string, to: string, property_id: u128, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({investment, property}: {investment: i128, property: Property}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAACFByb3BlcnR5AAAABgAAAAAAAAAHYnVpbGRlcgAAAAATAAAAAAAAAAhlbGVfcXVlcgAAAAsAAAAAAAAAB2VsZV90ZW0AAAAACwAAAAAAAAACaWQAAAAAAAoAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAx0b3RhbF9zdXBwbHkAAAAL",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAARcmVnaXN0ZXJfcHJvcGVydHkAAAAAAAAFAAAAAAAAAAdidWlsZGVyAAAAABMAAAAAAAAADXByb3BlcnR5X25hbWUAAAAAAAAQAAAAAAAAAAhlbGVfcXVlcgAAAAsAAAAAAAAAB2VsZV90ZW0AAAAACwAAAAAAAAAMdG90YWxfc3VwcGx5AAAACwAAAAEAAAAK",
        "AAAAAAAAAAAAAAAMZ2V0X3Byb3BlcnR5AAAAAQAAAAAAAAALcHJvcGVydHlfaWQAAAAACgAAAAEAAAfQAAAACFByb3BlcnR5",
        "AAAAAAAAAAAAAAARdHJhbnNmZXJfcHJvcGVydHkAAAAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAC3Byb3BlcnR5X2lkAAAAAAoAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAACAAAAAAAAAAppbnZlc3RtZW50AAAAAAALAAAAAAAAAAhwcm9wZXJ0eQAAB9AAAAAIUHJvcGVydHkAAAABAAAACw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        register_property: this.txFromJSON<u128>,
        get_property: this.txFromJSON<Property>,
        transfer_property: this.txFromJSON<null>,
        balance: this.txFromJSON<i128>
  }
}