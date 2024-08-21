"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { mnemonicState } from "@/state/state";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilState } from "recoil";

const RecoverPage = () => {
  const [mnemonic, setMnemonic] = useRecoilState(mnemonicState);

  const router = useRouter();

  const phrase = localStorage.getItem("mnemonic_phrase");

  const handleRecover = () => {
    if (phrase === null) return;
    setMnemonic(phrase);
    router.push("/wallet");
  };

  return (
    <CardContent className="flex flex-col py-8 px-6 items-center h-full">
      <h1 className="text-4xl text-white font-bold">Recover Wallet</h1>
      <div className="flex-grow flex flex-col justify-center gap-4 w-full">
        <Button onClick={() => router.push("/recover/mnemonic")} className="w-full dark">
          Provide Mnemonic Phrase
        </Button>
        <Button onClick={handleRecover} className="w-full dark" disabled={phrase === null}>
          Recover From LocalStorage
        </Button>
      </div>
    </CardContent>
  );
};

export default RecoverPage;
