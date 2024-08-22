"use client";

import { CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import * as bip from "bip39";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";
import { ethWalletsState, mnemonicState, solWalletsState } from "@/state/state";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MnemonicPage = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicRecoil, setMnemonicRecoil] = useRecoilState(mnemonicState);
  const [ethWallets, setEthWallets] = useRecoilState(ethWalletsState);
  const [solWallets, setSolWallets] = useRecoilState(solWalletsState);

  const router = useRouter();

  const generateMnemonic = () => {
    const newMnemonic = bip.generateMnemonic();
    setMnemonic(newMnemonic);
  };

  useEffect(() => {
    generateMnemonic();
  }, []);

  const handleMnemonic = () => {
    setMnemonicRecoil(mnemonic);
    setEthWallets([]);
    setSolWallets([]);
    router.push("/wallet");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${type} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${type.toLowerCase()}`));
  };

  return (
    <CardContent className="flex flex-col items-center px-8 py-6 gap-8 h-full">
      <h1 className="text-4xl font-bold">Mnemonic Phrase</h1>
      <div className="flex flex-col w-full justify-between h-full">
        <div className="w-full">
          <div className="grid grid-cols-3 gap-4 w-full">
            {mnemonic.split(" ").map((word) => (
              <div key={word} className="bg-white text-black w-full py-2 text-center rounded">
                {word}
              </div>
            ))}
          </div>
          <Button onClick={generateMnemonic} className=" w-full mt-10">
            Refresh Mnemonic Phrase
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between">
            <Button onClick={() => copyToClipboard(mnemonic, "Mnemonic Phrase")}>Copy Phrase</Button>
            <Button onClick={() => localStorage.setItem("mnemonic_phrase", mnemonic)} className="">
              Save in LocalStorage
            </Button>
          </div>
          <Button onClick={handleMnemonic} className="w-full">
            Generate Wallet
          </Button>
        </div>
      </div>
    </CardContent>
  );
};

export default MnemonicPage;
