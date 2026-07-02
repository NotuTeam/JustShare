"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/image-upload";
import { Code, FileText } from "lucide-react";
import { Note, NoteImage } from "@/types/note";

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    language: string;
    type: string;
    images: NoteImage[];
  }) => void;
  note?: Note | null;
}

const LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "html",
  "css",
  "scss",
  "sql",
  "bash",
  "json",
  "yaml",
  "xml",
  "markdown",
  "dockerfile",
];

export function NoteEditor({ open, onClose, onSave, note }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [type, setType] = useState("code");
  const [images, setImages] = useState<NoteImage[]>([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setLanguage(note.language);
      setType(note.type);
      const parsed = typeof note.images === "string" ? JSON.parse(note.images) : (note.images || []);
      setImages(parsed);
    } else {
      setTitle("");
      setContent("");
      setLanguage("plaintext");
      setType("code");
      setImages([]);
    }
  }, [note, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, content, language, type, images });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "New Note"}</DialogTitle>
          <DialogDescription>
            Create a code snippet or text note with optional images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Tabs value={type} onValueChange={setType}>
              <TabsList>
                <TabsTrigger value="code" className="gap-1">
                  <Code className="h-3.5 w-3.5" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Text
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {type === "code" && (
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v ?? "plaintext")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">{type === "code" ? "Code" : "Content"}</Label>
            <Textarea
              id="content"
              placeholder={type === "code" ? "Paste your code here..." : "Write your note..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Images (optional)</Label>
            <ImageUpload images={images} onChange={setImages} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {note ? "Update" : "Create"} Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
