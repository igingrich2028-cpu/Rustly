'use client';

import React, { useRef, useEffect } from 'react';
import { Terminal, Loader2, PlayCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompilerOutputProps {
  stdout: string;
  stderr: string;
  success: boolean | null;
  isCompiling: boolean;
  className?: string;
}

export function CompilerOutput({ stdout, stderr, success, isCompiling, className }: CompilerOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [stdout, stderr, isCompiling]);

  return (
    <div className={cn("flex flex-col h-full bg-[#0a0a0a] border border-border rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border h-9 shrink-0">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <Terminal size={12} className="text-primary" />
          Terminal
        </div>
        <div className="flex items-center gap-2">
          {isCompiling && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary animate-pulse">
              <Loader2 size={11} className="animate-spin" />
              EXECUTING...
            </div>
          )}
        </div>
      </div>

      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-auto font-code text-[12px] leading-relaxed scroll-smooth scrollbar-hide selection:bg-primary/30"
      >
        {isCompiling ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground/60 animate-pulse">
              <span className="text-primary">$</span> cargo build --verbose
            </div>
            <div className="text-muted-foreground/40 animate-pulse delay-75">Fetching crates.io index...</div>
            <div className="text-muted-foreground/30 animate-pulse delay-150">Compiling workspace...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {stdout && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground/50 mb-1">
                  <span className="text-primary">$</span>
                  <span className="text-[10px] uppercase font-bold tracking-tighter">stdout</span>
                </div>
                <pre className="text-foreground whitespace-pre-wrap font-code tracking-tight bg-white/5 p-3 rounded-md border border-white/5">
                  {stdout}
                </pre>
              </div>
            )}

            {stderr && (
              <div className="space-y-1 animate-in slide-in-from-top-1 duration-300">
                <div className="flex items-center gap-2 text-destructive/50 mb-1">
                  <ShieldAlert size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">stderr</span>
                </div>
                <div className="relative group">
                  <pre className="text-destructive whitespace-pre-wrap p-3 bg-destructive/10 border-l-2 border-destructive rounded-r font-medium">
                    {stderr}
                  </pre>
                </div>
              </div>
            )}

            {success === true && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider py-2 bg-primary/5 px-3 rounded-full w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Build Success: Exit Code 0
              </div>
            )}

            {!stdout && !stderr && !isCompiling && (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-4 opacity-20">
                <PlayCircle size={48} strokeWidth={1} />
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-center">
                  Ready to compile
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
