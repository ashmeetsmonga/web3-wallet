"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { selectedWalletState } from "@/state/state";
import React from "react";
import { useRecoilState } from "recoil";

const InfoPage = () => {
  const [selectedWallet, _] = useRecoilState(selectedWalletState);

  return (
    <CardContent className="flex flex-col w-full items-center py-6 px-8 h-full justify-between">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl text-white font-bold">Wallet Info</h1>
        <h2 className="text-9xl text-white font-black mt-4 tracking-tighter">0.00</h2>
        <div className="w-full mb-2 bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center mt-4">
          <div className="w-full">
            <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{selectedWallet.key}</p>
            <p className="font-thin text-xs text-primary">path: {selectedWallet.path}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <Button className="dark">Send</Button>
        <Button className="dark">Transactions</Button>
        <Button className="dark">Airdrip</Button>
      </div>
    </CardContent>
  );
};

export default InfoPage;
