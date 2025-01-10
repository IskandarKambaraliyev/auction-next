"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "./Logo";
import {
  LogOutIcon,
  PackageIcon,
  PackagePlusIcon,
  ScrollTextIcon,
} from "lucide-react";

import { User } from "@/types";

type Props = {
  user: User;
};
const Header = ({ user }: Props) => {
  return (
    <header className="sticky z-header top-0 left-0 h-20 w-full bg-neutral-800 flex-center">
      <div className="container flex items-center justify-between gap-4">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            user.userRole === "ADMIN" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg">Admin</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="max-w-40 truncate">{user.userName}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/lots/create" className="cursor-pointer">
                      <PackagePlusIcon />
                      Create Auction Lot
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lots" className="cursor-pointer">
                      <PackageIcon />
                      My Lots
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lots/bids" className="cursor-pointer">
                      <ScrollTextIcon />
                      My Bids
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <Button asChild>
              <Link href="/auth">Login/Register</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

const LogoutBtn = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "GET",
    });

    window.location.reload();
  };
  return (
    <Button
      className="cursor-pointer w-full justify-start"
      variant="destructive"
      onClick={handleLogout}
    >
      <LogOutIcon />
      Logout
    </Button>
  );
};
