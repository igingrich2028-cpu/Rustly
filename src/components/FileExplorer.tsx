'use client';

import React, { useState } from 'react';
import { File, ChevronRight, FileJson, Plus, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileExplorerProps {
  files: string[];
  activeFile: string;
  onFileSelect: (path: string) => void;
  onCreateFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
}

export function FileExplorer({ files, activeFile, onFileSelect, onCreateFile, onDeleteFile }: FileExplorerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleAdd = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setNewFileName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider">
          Filesystem
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 hover:bg-primary/20 hover:text-primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={12} />
        </Button>
      </div>

      {isAdding && (
        <div className="px-2 pb-2">
          <Input
            autoFocus
            className="h-7 text-xs bg-muted/30 border-primary/30"
            placeholder="filename.rs"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            onBlur={() => !newFileName && setIsAdding(false)}
          />
        </div>
      )}

      <div className="space-y-0.5">
        {files.sort().map(path => {
          const isSelected = activeFile === path;
          const isToml = path.endsWith('.toml');
          const isRs = path.endsWith('.rs');
          
          return (
            <div
              key={path}
              className={cn(
                "group flex items-center justify-between px-3 py-1.5 text-xs rounded transition-all cursor-pointer",
                isSelected 
                  ? "bg-primary/10 text-primary font-medium shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              )}
              onClick={() => onFileSelect(path)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {isToml ? (
                  <FileJson size={14} className="text-accent shrink-0" />
                ) : isRs ? (
                  <File size={14} className="shrink-0" />
                ) : (
                  <FileText size={14} className="shrink-0 text-muted-foreground/50" />
                )}
                <span className="truncate">{path}</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(path);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-0.5 rounded hover:bg-destructive/10"
                title="Delete File"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
