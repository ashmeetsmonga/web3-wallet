import { atom } from "recoil";

export interface Wallet {
  key: string;
  path: string;
  privateKey: string | Uint8Array;
  type: string;
}

export const mnemonicState = atom({
  key: "mnemonic",
  default: "",
});

export const ethWalletsState = atom({
  key: "ethWallets",
  default: [] as Wallet[],
});

export const solWalletsState = atom({
  key: "solWallets",
  default: [] as Wallet[],
});

export const selectedWalletState = atom({
  key: "selectedWallet",
  default: {} as Wallet,
});
