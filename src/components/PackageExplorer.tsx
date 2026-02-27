'use client';

import React, { useState } from 'react';
import { Search, Plus, Box, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOCK_CRATES = [
  { name: 'serde', version: '1.0.197', description: 'A generic serialization/deserialization framework' },
  { name: 'tokio', version: '1.36.0', description: 'An event-driven, non-blocking I/O platform' },
  { name: 'anyhow', version: '1.0.80', description: 'Flexible concrete Error type built on std::error::Error' },
  { name: 'regex', version: '1.10.3', description: 'An implementation of regular expressions for Rust' },
  { name: 'reqwest', version: '0.11.24', description: 'Higher level HTTP client library' },
  { name: 'sqlx', version: '0.7.3', description: 'The Rust SQL Toolkit' },
  { name: 'chrono', version: '0.4.34', description: 'Date and time library for Rust' },
  { name: 'lazy_static', version: '1.4.0', description: 'A macro for declaring lazily evaluated statics' },
];

interface PackageExplorerProps {
  onAddPackage: (name: string, version: string) => void;
}

export function PackageExplorer({ onAddPackage }: PackageExplorerProps) {
  const [query, setQuery] = useState('');
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<Set<string>>(new Set());

  const filtered = MOCK_CRATES.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = (name: string, version: string) => {
    setInstalling(name);
    // Simulate installation delay
    setTimeout(() => {
      onAddPackage(name, version);
      setInstalling(null);
      setInstalled(prev => new Set(prev).add(name));
    }, 800);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search crates.io..." 
          className="pl-9 h-9 text-xs bg-background/50 border-border focus:ring-1 focus:ring-primary/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
          Available Crates
        </div>
        {filtered.map(crate => {
          const isInstalling = installing === crate.name;
          const isInstalled = installed.has(crate.name);
          
          return (
            <div 
              key={crate.name} 
              className={cn(
                "group p-3 rounded-md bg-muted/30 border border-transparent transition-all",
                isInstalled ? "bg-primary/5 border-primary/20" : "hover:border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Box size={14} className={cn("text-muted-foreground", isInstalled && "text-primary")} />
                  <span className="text-sm font-semibold">{crate.name}</span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">{crate.version}</span>
                </div>
                <Button 
                  variant={isInstalled ? "ghost" : "outline"}
                  size="icon" 
                  disabled={isInstalling || isInstalled}
                  className={cn(
                    "h-7 w-7 transition-all",
                    !isInstalled && "opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground border-border"
                  )}
                  onClick={() => handleAdd(crate.name, crate.version)}
                >
                  {isInstalling ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isInstalled ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Plus size={14} />
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                {crate.description}
              </p>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Box size={24} className="mx-auto text-muted-foreground/20 mb-2" />
            <div className="text-muted-foreground text-xs italic">
              No crates found matching &quot;{query}&quot;
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-muted/20 border border-border rounded-md mt-auto">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Usage Tip</div>
        <p className="text-[10px] text-muted-foreground leading-normal">
          Adding a crate here updates <span className="text-primary font-mono italic">Cargo.toml</span>. Remember to <span className="text-foreground font-mono">use</span> the crate in your code.
        </p>
      </div>
    </div>
  );
}
