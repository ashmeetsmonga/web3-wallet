"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { selectedWalletState } from "@/state/state";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { AddressLike, JsonRpcProvider } from "ethers";
import { JsonRpcApiProvider } from "ethers";
import { HDNodeWallet } from "ethers";
import { hexlify, toBeHex } from "ethers";
import { parseEther, Wallet } from "ethers";
import { AlchemyProvider } from "ethers";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

const SendPage = () => {
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const [selectedWallet, setSelectedWallet] = useRecoilState(selectedWalletState);

  let availableBalance = selectedWallet.amount;
  if (selectedWallet.type === "eth") availableBalance = availableBalance / 10 ** 18;
  if (selectedWallet.type === "sol") availableBalance = availableBalance / LAMPORTS_PER_SOL;

  const handleTransaction = () => {
    if (selectedWallet.type === "sol") handleSolTransaction();
    if (selectedWallet.type === "eth") handleEthTransactions();
  };

  const handleEthTransactions = async () => {
    try {
      const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`, "sepolia");
      console.log(provider);
      console.log(selectedWallet.key, selectedWallet.privateKey);
      const signer = selectedWallet.ethWallet!.connect(provider);
      console.log(signer.publicKey, signer.privateKey);
      const tx = await signer.sendTransaction({
        from: selectedWallet.privateKey as string,
        to: receiver,
        value: parseEther(amount.toString()),
      });
      console.log(tx);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSolTransaction = async () => {
    let toastId;
    try {
      toastId = toast.loading("Performing Transaction");
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      let tx = new Transaction();
      const senderPublicKey = new PublicKey(selectedWallet.key);
      const receiverPublicKey = new PublicKey(receiver);
      tx.add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: receiverPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const payer = Keypair.fromSecretKey(selectedWallet.privateKey as Uint8Array);
      const data = await sendAndConfirmTransaction(connection, tx, [payer]);
      setTransactionHash(data);
      toast.dismiss(toastId);
    } catch (e) {
      toast.error("Something went wrong");
      console.log("Error", e);
    }
  };

  return (
    <CardContent className="flex flex-col py-8 px-6 items-center justify-between h-full">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold">Transaction</h1>
        <div className="mt-10 w-full">
          <p className="font-thin text-sm">Enter Amount (Balance: {availableBalance})</p>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="mt-4 w-full">
          <p className="font-thin text-sm">Enter Receiver's Address</p>
          <Input type="text" placeholder="Receiver's Address" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
        </div>
        {transactionHash && (
          <div className="w-full bg-white rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center mt-6">
            <div className="w-full">
              <p className="text-xs font-semibold">Transaction Successful! Changes would be reflected within 5 mins</p>
              <p className="text-xs font-thin text-primary text-wrap break-words mt-1">{transactionHash}</p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <Button onClick={handleTransaction} className="w-full">
          Perform Transaction
        </Button>
      </div>
    </CardContent>
  );
};

export default SendPage;
