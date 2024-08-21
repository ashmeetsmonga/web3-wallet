import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <CardContent className="flex flex-col justify-center gap-4 w-full h-full">
      <Link href="/mnemonic">
        <Button className="w-full">Create New Wallet</Button>
      </Link>
      <Link href="/recover">
        <Button className="w-full">Recover Wallet</Button>
      </Link>
    </CardContent>
  );
}
