"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  shareId: string | null;
  onGenerateLink: () => void;
}

export function ShareDialog({ open, onClose, shareId, onGenerateLink }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = shareId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${shareId}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Anyone with this link can view this note without signing in.
          </DialogDescription>
        </DialogHeader>

        {shareId ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="flex-1 font-mono text-xs" />
              <Button variant="outline" size="icon-sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open shared link
            </a>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Generate a shareable link for this note.
            </p>
            <Button onClick={onGenerateLink}>Generate Link</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
