"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Share2, LogOut, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileCode className="h-5 w-5 text-primary" />
          <span>UR Snippets</span>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                <Share2 className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <Button variant="ghost" size="icon-sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Sign In
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
