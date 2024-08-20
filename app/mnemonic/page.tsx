"use client";

import { CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import * as bip from "bip39";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";
import { mnemonicState } from "@/state/state";
import Link from "next/link";

const MnemonicPage = () => {
  const [mnemonic, setMnemonic] = useRecoilState(mnemonicState);

  const generateMnemonic = () => {
    const newMnemonic = bip.generateMnemonic();
    setMnemonic(newMnemonic);
  };

  useEffect(() => {
    generateMnemonic();
  }, []);

  return (
    <CardContent className="flex flex-col items-center px-8 py-6 gap-8 h-full">
      <h1 className="text-4xl text-white font-bold">Mnemonic Phrase</h1>
      <div className="flex flex-col w-full justify-between h-full">
        <div className="w-full">
          <div className="grid grid-cols-3 gap-4 w-full">
            {mnemonic.split(" ").map((word) => (
              <div key={word} className="bg-white w-full py-2 text-center rounded text-lg">
                {word}
              </div>
            ))}
          </div>
          <Button onClick={generateMnemonic} className="dark w-full mt-10">
            Refresh Mnemonic Phrase
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between">
            <Button className="dark">Copy Phrase</Button>
            <Button className="dark">Save in LocalStorage</Button>
          </div>
          <Link href="/wallet" className="w-full">
            <Button className="w-full dark">Generate Wallet</Button>
          </Link>
        </div>
      </div>
    </CardContent>
  );
};

export default MnemonicPage;
