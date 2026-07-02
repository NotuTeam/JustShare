"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Share2, MoreVertical, Code, FileText, ImageIcon, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Note, NoteImage } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onShare }: NoteCardProps) {
  const images: NoteImage[] = typeof note.images === "string" ? JSON.parse(note.images) : (note.images || []);
  const preview = note.content.split("\n").slice(0, 3).join("\n");

  const typeIcon = note.type === "code" ? <Code className="h-3 w-3" /> : <FileText className="h-3 w-3" />;

  return (
    <Card className="group hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base truncate flex-1 mr-2">{note.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(note.id)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(note.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs gap-1">
            {typeIcon}
            {note.type}
          </Badge>
          {note.type === "code" && (
            <Badge variant="outline" className="text-xs">
              {note.language}
            </Badge>
          )}
          {note.shareId && (
            <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">
              Shared
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {note.type === "code" && preview ? (
          <pre className="text-xs text-muted-foreground bg-muted/50 rounded p-3 overflow-hidden max-h-20 font-mono">
            {preview}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
        )}
        {images.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <ImageIcon className="h-3 w-3" />
            {images.length} image{images.length > 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}
