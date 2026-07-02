"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Code,
  FileText,
  ImageIcon,
  Loader2,
  Share2,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteImage {
  url: string;
  name?: string;
}

interface SharedNote {
  id: string;
  title: string;
  content: string;
  language: string;
  type: string;
  images: NoteImage[] | string;
  createdAt: string;
  user: { name: string | null };
}

export default function SharedNotePage() {
  const params = useParams();
  const [note, setNote] = useState<SharedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/share/${params.shareId}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.shareId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Note not found</h2>
          <p className="text-sm text-muted-foreground">
            This note may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const images: NoteImage[] =
    typeof note.images === "string"
      ? JSON.parse(note.images)
      : note.images || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{note.user?.name || "Anonymous"}</span>
          <span className="text-border">/</span>
          <span className="font-medium text-foreground">{note.title}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <Share2 className="h-4 w-4 mr-1" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs gap-1">
              {note.type === "code" ? (
                <Code className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {note.type}
            </Badge>
            {note.type === "code" && note.language !== "plaintext" && (
              <Badge variant="outline" className="text-xs">
                {note.language}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl">{note.title}</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Shared {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {note.content && note.type === "code" ? (
            <CodeBlock code={note.content} language={note.language} />
          ) : note.content ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {note.content}
            </div>
          ) : null}

          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4" />
                Images ({images.length})
              </div>
              <div className="grid gap-4">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden border border-border/50"
                  >
                    <img
                      src={img.url}
                      alt={img.name || `Image ${i + 1}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-medium text-foreground">JustShare</span>
        </p>
      </div>
    </div>
  );
}
