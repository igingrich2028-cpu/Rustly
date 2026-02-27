'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { CodeEditor } from '@/components/CodeEditor';
import { CompilerOutput } from '@/components/CompilerOutput';
import { compileRustCode, type CompilationResult } from '@/app/actions/compile';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { FileExplorer } from '@/components/FileExplorer';
import { PackageExplorer } from '@/components/PackageExplorer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export type FileSystem = {
  [path: string]: string;
};

const INITIAL_FILES: FileSystem = {
  'src/main.rs': `fn main() {\n    let value = 50;\n    println!("Value {} is valid.", value);\n    println!("Welcome to the Rustly Project!");\n}`,
  'Cargo.toml': `[package]\nname = "rustly_app"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\n`,
  'rustly.toml': `# Advanced IDE Settings\n[editor]\ntab_size = 4\n\n[build]\ntarget = "wasm32-unknown-unknown"\n`
};

export default function Home() {
  const [files, setFiles] = useState<FileSystem>(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState('src/main.rs');
  const [theme, setTheme] = useState('deepsea');
  const { toast } = useToast();
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [result, setResult] = useState<CompilationResult | null>(null);

  // Resizing Logic
  const [terminalWidth, setTerminalWidth] = useState(450);
  const isResizing = useRef(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX - 16;
    if (newWidth > 280 && newWidth < window.innerWidth * 0.7) {
      setTerminalWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleUpdateFile = useCallback((content: string) => {
    setFiles(prev => ({ ...prev, [activeFile]: content }));
  }, [activeFile]);

  const handleCreateFile = (name: string) => {
    if (files[name]) {
      toast({ variant: "destructive", title: "Error", description: "File already exists" });
      return;
    }
    setFiles(prev => ({ ...prev, [name]: "" }));
    setActiveFile(name);
    toast({ title: "File Created", description: `Added ${name} to project.` });
  };

  const handleDeleteFile = (name: string) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[name];
      return newFiles;
    });
    
    if (activeFile === name) {
      const remainingFiles = Object.keys(files).filter(f => f !== name);
      setActiveFile(remainingFiles.length > 0 ? remainingFiles[0] : '');
    }
    
    toast({ title: "File Deleted", description: `Removed ${name} from project.` });
  };

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setResult(null);
    try {
      const mainContent = files['src/main.rs'] || '';
      const cargoContent = files['Cargo.toml'] || '';
      const compilationResult = await compileRustCode(mainContent, cargoContent);
      setResult(compilationResult);
      if (!compilationResult.success) {
        toast({
          variant: "destructive",
          title: "Build Failed",
          description: "Check the terminal for errors.",
        });
      }
    } catch (error) {
      console.error('Compilation failed', error);
    } finally {
      setIsCompiling(false);
    }
  }, [files, toast]);

  const handleAddPackage = (pkg: string, version: string) => {
    setFiles(prev => {
      const cargo = prev['Cargo.toml'] || '[package]\nname = "rustly_app"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\n';
      if (cargo.includes(`${pkg} =`)) {
        toast({ title: "Package already exists" });
        return prev;
      }
      const lines = cargo.split('\n');
      const depIndex = lines.findIndex(l => l.trim() === '[dependencies]');
      if (depIndex !== -1) {
        lines.splice(depIndex + 1, 0, `${pkg} = "${version}"`);
      } else {
        lines.push('[dependencies]', `${pkg} = "${version}"`);
      }
      toast({
        title: "Package added",
        description: `Successfully added ${pkg} v${version} to Cargo.toml`,
      });
      return { ...prev, 'Cargo.toml': lines.join('\n') };
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar variant="sidebar" className="bg-card border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-primary" />
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Project Workspace</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <Tabs defaultValue="explorer" className="w-full">
              <TabsList className="w-full rounded-none h-11 bg-transparent border-b border-border p-0">
                <TabsTrigger value="explorer" className="flex-1 rounded-none gap-2 text-xs">
                  <FileCode size={14} /> Explorer
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex-1 rounded-none gap-2 text-xs">
                  <Box size={14} /> Crates
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="explorer" className="m-0 p-3">
                <FileExplorer 
                  files={Object.keys(files)} 
                  activeFile={activeFile} 
                  onFileSelect={setActiveFile}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                />
              </TabsContent>
              
              <TabsContent value="packages" className="m-0 p-3">
                <PackageExplorer onAddPackage={handleAddPackage} />
              </TabsContent>
            </Tabs>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-0">
          <Navbar 
            onCompile={handleCompile} 
            isCompiling={isCompiling} 
            currentTheme={theme} 
            onThemeChange={setTheme} 
          />
          
          <main className="flex-1 flex p-4 gap-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 bg-card/30 rounded-l-lg border border-border border-r-0 overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">{activeFile || 'No file selected'}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                   <span>Tab Size: 4</span>
                   <span>UTF-8</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                {activeFile ? (
                  <CodeEditor value={files[activeFile] || ''} onChange={handleUpdateFile} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
                    Select a file to start coding
                  </div>
                )}
              </div>
            </div>

            <div 
              onMouseDown={startResizing}
              className={cn(
                "group relative w-1.5 flex items-center justify-center cursor-col-resize transition-colors hover:bg-primary/50 z-10",
                isResizing.current && "bg-primary"
              )}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 group-hover:block hidden" />
              <div className="w-[1px] h-8 bg-border group-hover:bg-primary/50 transition-colors" />
            </div>

            <div 
              className="flex flex-col min-h-0 transition-[width] duration-0 ease-linear"
              style={{ width: `${terminalWidth}px` }}
            >
              <CompilerOutput 
                stdout={result?.stdout || ''} 
                stderr={result?.stderr || ''} 
                success={result?.success ?? null}
                isCompiling={isCompiling}
                className="rounded-r-lg border-l-0"
              />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
