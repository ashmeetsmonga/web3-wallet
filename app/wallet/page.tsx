"use client";
import { mnemonicState, selectedWalletState, Wallet, ethWalletsState, solWalletsState } from "@/state/state";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import * as bip from "bip39";
import { HDNodeWallet } from "ethers";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Keypair } from "@solana/web3.js";
import { HDKey } from "micro-ed25519-hdkey";

const WalletPage = () => {
  const [ethWallets, setEthWallets] = useRecoilState(ethWalletsState);
  const [solWallets, setSolWallets] = useRecoilState(solWalletsState);
  const [mnemonic, setMnemonic] = useRecoilState(mnemonicState);
  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletState);

  const router = useRouter();

  const generateEthWallet = () => {
    const seed = bip.mnemonicToSeedSync(mnemonic);
    const node = HDNodeWallet.fromSeed(seed);
    let walletCount = 0;
    if (ethWallets.length > 0) {
      const lastWallet = ethWallets[ethWallets.length - 1];
      walletCount = parseInt(lastWallet.path.split("'/")[2]) + 1;
    }

    const path = `m/44'/60'/${walletCount}'/0'`;
    const newWallet = node.derivePath(path);
    setEthWallets([...ethWallets, { key: newWallet.publicKey.substring(0, 42), path: path, privateKey: newWallet.privateKey, type: "eth" }]);
  };

  const generateSolWallet = () => {
    const seed = bip.mnemonicToSeedSync(mnemonic);
    let walletCount = 0;
    const hd = HDKey.fromMasterSeed(seed.toString("hex"));
    if (solWallets.length > 0) {
      const lastWallet = solWallets[solWallets.length - 1];
      walletCount = parseInt(lastWallet.path.split("'/")[2]) + 1;
    }
    const path = `m/44'/501'/${walletCount}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey);

    setSolWallets([...solWallets, { key: keypair.publicKey.toBase58(), path: path, privateKey: keypair.secretKey, type: "sol" }]);
  };

  useEffect(() => {
    if (ethWallets.length === 0) generateEthWallet();
    if (solWallets.length === 0) generateSolWallet();
  }, []);

  const handleDeleteWallet = (idx: number, type: string) => {
    if (type === "eth") {
      const newWallets = [...ethWallets];
      newWallets.splice(idx, 1);
      setEthWallets(newWallets);
    } else if (type === "sol") {
      const newWallets = [...solWallets];
      newWallets.splice(idx, 1);
      setSolWallets(newWallets);
    }
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
          <p className="text-white font-thin">Eth Wallets</p>
          {ethWallets.map((wallet, idx) => (
            <div key={wallet.path} className="w-full mb-2 bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center cursor-pointer hover:bg-gray-100">
              <div onClick={() => handleSelect(wallet)} className="w-4/5">
                <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{wallet.key}</p>
                <p className="font-thin text-xs text-primary">path: {wallet.path}</p>
              </div>
              <div className="flex gap-2 z-10">
                <Clipboard className="hover:scale-110 transition-transform" />
                <Trash2 className="hover:scale-110 transition-transform" onClick={() => handleDeleteWallet(idx, "eth")} />
              </div>
            </div>
          ))}
          <p className="text-white font-thin">Sol Wallets</p>
          {solWallets.map((wallet, idx) => (
            <div key={wallet.path} className="w-full mb-2 bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center cursor-pointer hover:bg-gray-100">
              <div onClick={() => handleSelect(wallet)} className="w-4/5">
                <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{wallet.key}</p>
                <p className="font-thin text-xs text-primary">path: {wallet.path}</p>
              </div>
              <div className="flex gap-2 z-10">
                <Clipboard className="hover:scale-110 transition-transform" />
                <Trash2 className="hover:scale-110 transition-transform" onClick={() => handleDeleteWallet(idx, "sol")} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex gap-2">
        <Button className="w-full dark" onClick={generateEthWallet}>
          Add New Eth Wallet
        </Button>
        <Button className="w-full dark" onClick={generateSolWallet}>
          Add New Sol Wallet
        </Button>
      </div>
    </CardContent>
  );
};

export default WalletPage;
