/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVM_PROJECT_NAME: string
  readonly VITE_DEFAULT_PROPERTY_URI: string
  readonly VITE_ALCHEMY_ID?: string
  readonly VITE_INFURA_ID?: string
  readonly VITE_STELLAR_HORIZON_URL: string
  readonly VITE_ENABLE_SOROBAN: string
  readonly VITE_SOROBAN_RPC_URL?: string
  readonly VITE_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
