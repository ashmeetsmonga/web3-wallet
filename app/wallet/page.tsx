"use client";
import { mnemonicState, selectedWalletState, Wallet, walletsState } from "@/state/state";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import * as bip from "bip39";
import { HDNodeWallet } from "ethers";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WalletPage = () => {
  const [wallets, setWallets] = useRecoilState(walletsState);
  const [mnemonic, _] = useRecoilState(mnemonicState);
  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletState);

  const router = useRouter();

  const generateWallet = () => {
    const seed = bip.mnemonicToSeedSync(mnemonic);
    const node = HDNodeWallet.fromSeed(seed);
    let walletCount = 0;
    if (wallets.length > 0) {
      const lastWallet = wallets[wallets.length - 1];
      walletCount = parseInt(lastWallet.path.split("'/")[2]) + 1;
    }

    const path = `m/44'/60'/${walletCount}'/0'`;
    const newWallet = node.derivePath(path);
    setWallets([...wallets, { key: newWallet.publicKey, path: path, privateKey: newWallet.privateKey }]);
  };

  useEffect(() => {
    if (wallets.length === 0) generateWallet();
  }, []);

  const handleDeleteWallet = (idx: number) => {
    const newWallets = [...wallets];
    newWallets.splice(idx, 1);
    setWallets(newWallets);
  };

  const handleSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    router.push("/info");
  };

  return (
    <CardContent className="flex flex-col w-full items-center py-6 px-8 h-full justify-between">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl text-white font-bold">Wallets</h1>
        <div className="flex flex-col w-full gap-2 mt-4 h-[450px] overflow-y-auto scrollbar scrollbar-none scrollbar-thumb-primary">
          {wallets.map((wallet, idx) => (
            <div key={wallet.path} className="w-full mb-2 bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center cursor-pointer hover:bg-gray-100">
              <div onClick={() => handleSelect(wallet)} className="w-4/5">
                <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{wallet.key}</p>
                <p className="font-thin text-xs text-primary">path: {wallet.path}</p>
              </div>
              <div className="flex gap-2 z-10">
                <Clipboard className="hover:scale-110 transition-transform" />
                <Trash2 className="hover:scale-110 transition-transform" onClick={() => handleDeleteWallet(idx)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <Button className="w-full dark" onClick={generateWallet}>
          Add New Wallet
        </Button>
      </div>
    </CardContent>
  );
};

export default WalletPage;
