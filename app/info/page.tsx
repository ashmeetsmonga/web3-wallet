"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { selectedWalletState } from "@/state/state";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const InfoPage = () => {
  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletState);
  const [amount, setAmount] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);

  const router = useRouter();

  const getBalance = async () => {
    const publicKey = selectedWallet.key;
    setLoading(true);
    if (selectedWallet.type === "eth") {
      try {
        const { data } = await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`, {
          id: 1,
          jsonrpc: "2.0",
          params: [publicKey, "latest"],
          method: "eth_getBalance",
        });
        setLoading(false);
        setAmount(Number(data.result) / 10 ** 18);
        setSelectedWallet({ ...selectedWallet, amount: Number(data.result) });
      } catch (e) {
        console.log(e);
      }
    } else if (selectedWallet.type === "sol") {
      const { data } = await axios.post(`https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`, {
        id: 1,
        jsonrpc: "2.0",
        method: "getBalance",
        params: [publicKey],
      });
      setLoading(false);
      if (data.result.value / LAMPORTS_PER_SOL !== amount) setAirdropSuccess(false);
      setAmount(data.result.value / LAMPORTS_PER_SOL);
      setSelectedWallet({ ...selectedWallet, amount: data.result.value });
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleAirdrop = async () => {
    setAirdropSuccess(false);
    const publicKey = selectedWallet.key;
    if (selectedWallet.type === "sol") {
      let toastId;
      try {
        toastId = toast.loading("Requesting Airdrop");
        const { data } = await axios.post(`https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`, {
          id: 1,
          jsonrpc: "2.0",
          method: "requestAirdrop",
          params: [publicKey, 1000000000],
        });
        toast.dismiss(toastId);
        setAirdropSuccess(true);
      } catch (e) {
        console.log(e);
        toast.error("Error in requesting airdrop, please try after some time", { id: toastId });
      }
    }
  };

  return (
    <CardContent className="flex flex-col w-full items-center py-6 px-8 h-full justify-between">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold">Wallet Info</h1>
        <div className="relative">
          {loading && <h2 className="text-9xl text-gray-800 font-black mt-4 tracking-tighter animate-pulse">{amount.toFixed(2)}</h2>}
          {!loading && <h2 className="text-9xl font-black mt-4 tracking-tighter">{amount.toFixed(2)}</h2>}
          <span onClick={getBalance} className="absolute top-16 -right-12 cursor-pointer">
            <RefreshCw />
          </span>
        </div>
        <div className="w-full mb-2 bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center mt-4">
          <div className="w-full">
            <p className="font-thin uppercase">{selectedWallet.type}</p>
            <p className="font-mono text-sm font-semibold text-primary text-wrap text-ellipsis overflow-clip">{selectedWallet.key}</p>
            <p className="font-thin text-xs text-primary">path: {selectedWallet.path}</p>
          </div>
        </div>
        {airdropSuccess && (
          <div className="w-full bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center mt-3">
            <div className="w-full">
              <p className="text-xs font-light">Airdrop Successful! Changes would be reflected within 5 mins.</p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col gap-4">
        {}
        {selectedWallet.type === "sol" && (
          <>
            <Button className="" onClick={handleAirdrop}>
              Airdrop
            </Button>
            <Button onClick={() => router.push("/send")}>Send</Button>
          </>
        )}
        {selectedWallet.type === "eth" && (
          <>
            <Link className="w-full" href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank">
              <Button className="w-full" onClick={handleAirdrop}>
                Airdrop
              </Button>
            </Link>
            <Button disabled>Send (Work In Progress)</Button>
          </>
        )}
      </div>
    </CardContent>
  );
};

export default InfoPage;
