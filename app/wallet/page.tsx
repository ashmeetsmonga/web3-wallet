"use client";
import { mnemonicState, walletsState } from "@/state/state";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import * as bip from "bip39";
import { HDNodeWallet } from "ethers";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WalletPage = () => {
  const [wallets, setWallets] = useRecoilState(walletsState);
  const [mnemonic, _] = useRecoilState(mnemonicState);

  const generateWallet = () => {
    const seed = bip.mnemonicToSeedSync(mnemonic);
    const node = HDNodeWallet.fromSeed(seed);
    const walletCount = wallets.length;

    const path = `m/44'/60'/${walletCount}'/0'`;
    const newWallet = node.derivePath(path);
    setWallets([...wallets, { key: newWallet.publicKey, path: path }]);
  };

  useEffect(() => {
    generateWallet();
  }, []);

  return (
    <CardContent className="flex flex-col w-full items-center py-8 px-6 h-full justify-between">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl text-primary font-bold">Wallets</h1>
        <div className="flex flex-col w-full gap-2 mt-4 h-[450px] overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-primary">
          {wallets.map((wallet) => (
            <div key={wallet.path} className="w-full mb-2 bg-gray-900 rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center cursor-pointer hover:bg-gray-800">
              <div className="w-4/5">
                <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{wallet.key}</p>
                <p className="font-thin text-xs text-primary">path: {wallet.path}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <Button className="w-full" onClick={generateWallet}>
          Add New Wallet
        </Button>
      </div>
    </CardContent>
  );
};

export default WalletPage;
