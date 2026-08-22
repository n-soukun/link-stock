"use client";

import { signIn } from "next-auth/react";

import { Button } from "./ui/button";

export const Welcome: React.FC = () => {
  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <div className="text-center">
        <div className="text-2xl font-bold">Link Stockへようこそ</div>
        <div className="mt-4 text-gray-500">
          Link
          Stockは、ブックマークを簡単に管理できるシンプルなアプリケーションです。
        </div>
        <div className="mt-8">
          <Button
            size="lg"
            className="bg-[#5865F2] hover:bg-[#E0E3FF] hover:text-[#5865F2]"
            onClick={() => signIn("discord", { callbackUrl: "/" })}
          >
            Discordでログイン
          </Button>
        </div>
      </div>
    </div>
  );
};
