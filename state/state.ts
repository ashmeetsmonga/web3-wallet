import { atom } from "recoil";

export interface Wallet {
  key: string;
  path: string;
  privateKey: string;
}

export const mnemonicState = atom({
  key: "mnemonic",
  default: "",
});

export const walletsState = atom({
  key: "wallets",
  default: [] as Wallet[],
});

export const selectedWalletState = atom({
  key: "selectedWallet",
  default: {} as Wallet,
});
