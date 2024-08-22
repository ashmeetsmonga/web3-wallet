"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mnemonicState } from "@/state/state";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import * as bip from "bip39";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProvideMnemonicPage = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicRecoil, setMnemonicRecoil] = useRecoilState(mnemonicState);

  const router = useRouter();

  const handleRecovery = () => {
    let toastId;
    try {
      toastId = toast.loading("Checking phrase");
      const seed = bip.mnemonicToSeedSync(mnemonic);
      toast.dismiss(toastId);
      setMnemonicRecoil(mnemonic);
      router.push("/wallet");
    } catch (e) {
      toast.error("Error in verifying, please enter correct mnemonic phrase", { id: toastId });
    }
  };

  return (
    <CardContent className="flex flex-col py-8 px-6 items-center justify-between h-full">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold">Mnemonic Phrase</h1>
        <Input
          type="text"
          placeholder="Enter Mnemonic Phrase"
          className="mt-10"
          value={mnemonic}
          onChange={(e) => {
            if (e.target.value.split(" ").length > 12) return;
            setMnemonic(e.target.value);
          }}
        />
        <div className="grid grid-cols-3 gap-4 w-full mt-6">
          {mnemonic.split(" ").map(
            (word) =>
              word && (
                <div key={word} className="bg-gray-100 w-full py-2 text-center rounded overflow-clip">
                  {word}
                </div>
              )
          )}
        </div>
      </div>
      <div className="w-full">
        <Button onClick={handleRecovery} disabled={mnemonic === ""} className="w-full">
          Recover Wallet
        </Button>
      </div>
    </CardContent>
  );
};

export default ProvideMnemonicPage;
