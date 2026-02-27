'use client';

import React from 'react';
import { 
  Play, 
  Cpu, 
  Palette, 
  Monitor, 
  Zap, 
  Flame, 
  Moon, 
  Sun, 
  Ghost, 
  Snowflake, 
  Mountain,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onCompile: () => void;
  isCompiling: boolean;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const THEMES = [
  { id: 'deepsea', name: 'Deep Sea', icon: Monitor },
  { id: 'carbon', name: 'Carbon', icon: Zap },
  { id: 'emerald', name: 'Emerald', icon: Palette },
  { id: 'midnight-neon', name: 'Midnight Neon', icon: Flame },
  { id: 'solarized', name: 'Solarized Dark', icon: Sun },
  { id: 'dracula', name: 'Dracula', icon: Ghost },
  { id: 'nordic', name: 'Nordic Frost', icon: Snowflake },
  { id: 'desert', name: 'Desert Sand', icon: Mountain },
  { id: 'hyper-drive', name: 'Hyper Drive', icon: Rocket },
];

export function Navbar({ onCompile, isCompiling, currentTheme, onThemeChange }: NavbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Cpu className="text-primary-foreground" size={18} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-tight leading-none mb-1">RUSTLY</h1>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em] leading-none">V0.1.0 STABLE</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground">
              <Palette size={14} />
              <span className="hidden sm:inline">Theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground p-3">Workspace Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {THEMES.map((t) => (
                <DropdownMenuItem 
                  key={t.id} 
                  onClick={() => onThemeChange(t.id)}
                  className={currentTheme === t.id ? "bg-accent/20 text-accent font-semibold" : "text-muted-foreground"}
                >
                  <t.icon size={14} className="mr-3" />
                  <span className="text-xs">{t.name}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          onClick={onCompile} 
          disabled={isCompiling}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-wider gap-2 px-6 h-8 transition-all active:scale-95 border-none"
        >
          {isCompiling ? (
             <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Play size={12} fill="currentColor" />
          )}
          {isCompiling ? 'BUILDING...' : 'RUN'}
        </Button>
      </div>
    </header>
  );
}
