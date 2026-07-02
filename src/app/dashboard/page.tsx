"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { ShareDialog } from "@/components/share-dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { Note, NoteImage } from "@/types/note";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sharingNoteId, setSharingNoteId] = useState<string | null>(null);
  const [sharingShareId, setSharingShareId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
        setFilteredNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [status, fetchNotes]);

  useEffect(() => {
    if (search) {
      const q = search.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      );
    } else {
      setFilteredNotes(notes);
    }
  }, [search, notes]);

  const handleSave = async (data: {
    title: string;
    content: string;
    language: string;
    type: string;
    images: NoteImage[];
  }) => {
    const url = editingNote ? `/api/notes/${editingNote.id}` : "/api/notes";
    const method = editingNote ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditorOpen(false);
      setEditingNote(null);
      fetchNotes();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;

    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchNotes();
    }
  };

  const handleShare = (id: string) => {
    const note = notes.find((n) => n.id === id);
    setSharingNoteId(id);
    setSharingShareId(note?.shareId || null);
    setShareOpen(true);
  };

  const handleGenerateLink = async () => {
    if (!sharingNoteId) return;

    const res = await fetch(`/api/notes/${sharingNoteId}/share`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setSharingShareId(data.shareId);
      fetchNotes();
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <Button onClick={() => { setEditingNote(null); setEditorOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            {search ? "No notes found" : "No notes yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search
              ? "Try a different search term"
              : "Create your first note to start sharing with your team."}
          </p>
          {!search && (
            <Button onClick={() => { setEditingNote(null); setEditorOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" />
              Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingNote(null); }}
        onSave={handleSave}
        note={editingNote}
      />

      <ShareDialog
        open={shareOpen}
        onClose={() => { setShareOpen(false); setSharingNoteId(null); setSharingShareId(null); }}
        shareId={sharingShareId}
        onGenerateLink={handleGenerateLink}
      />
    </div>
  );
}
