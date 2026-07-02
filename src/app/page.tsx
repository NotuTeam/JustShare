"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Share2,
  Code,
  ImageIcon,
  Shield,
  ArrowRight,
  Zap,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/50 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            Share instantly, collaborate freely
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Share code snippets
            <br />
            <span className="text-muted-foreground">& screenshots</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A minimalist platform for developers to share code, notes, and images
            with their team. No friction, just sharing.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Built for developer workflows
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Code className="h-5 w-5" />}
              title="Code Snippets"
              description="Share code with syntax highlighting across 25+ languages. Paste and share in seconds."
            />
            <FeatureCard
              icon={<ImageIcon className="h-5 w-5" />}
              title="Screenshots"
              description="Upload screenshots and images directly via Cloudinary CDN. Fast, reliable delivery."
            />
            <FeatureCard
              icon={<Share2 className="h-5 w-5" />}
              title="Instant Sharing"
              description="Generate a unique link for any note. Share it with anyone, no account needed to view."
            />
            <FeatureCard
              icon={<Lock className="h-5 w-5" />}
              title="Secure Access"
              description="Only authenticated users can create and manage notes. Viewers get read-only shared links."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Team Collaboration"
              description="Designed for seamless collaboration. Share payloads, screenshots, and code with your team."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Dark Theme"
              description="Clean, minimal dark interface designed for developers. Easy on the eyes, focused on content."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border/40">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>JustShare</span>
          <span>Built for developers who value simplicity</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
