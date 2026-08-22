"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";

export interface HeaderProps {
  user?: {
    image?: string | null;
    name?: string | null;
  };
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const handleLogin = () => {
    void signIn("discord", { callbackUrl: "/" });
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-background border-border border-b">
      <div className="contianer mx-auto flex max-w-xl items-center justify-between px-4 py-2">
        <h1 className="text-foreground text-2xl">Link Stock</h1>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOutIcon />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin}>ログイン</Button>
        )}
      </div>
    </header>
  );
};
