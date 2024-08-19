import { atom } from "recoil";

export interface Wallet {
  key: string;
  path: string;
}

export const mnemonicState = atom({
  key: "mnemonic",
  default: "",
});

export const walletsState = atom({
  key: "wallets",
  default: [] as Wallet[],
});
