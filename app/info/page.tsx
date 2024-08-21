"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { selectedWalletState } from "@/state/state";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";

const InfoPage = () => {
  const [selectedWallet, _] = useRecoilState(selectedWalletState);
  const [amount, setAmount] = useState(0.0);

  const getBalance = async () => {
    if (selectedWallet.type === "eth") {
      const publicKey = selectedWallet.key;
      const { data } = await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`, {
        id: 1,
        jsonrpc: "2.0",
        params: [publicKey, "latest"],
        method: "eth_getBalance",
      });
      setAmount(Number(data.result) / 10 ** 18);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <CardContent className="flex flex-col w-full items-center py-6 px-8 h-full justify-between">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl text-white font-bold">Wallet Info</h1>
        <div className="">
          <h2 className="text-9xl text-white font-black mt-4 tracking-tighter">{amount.toFixed(2)}</h2>
        </div>
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
