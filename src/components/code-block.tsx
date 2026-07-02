"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "plaintext", showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/50">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border/30">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.85rem",
          background: "#18181b",
        }}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "#52525b",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
