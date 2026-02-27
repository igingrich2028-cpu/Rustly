'use client';

import React, { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CodeEditor({ value, onChange, className }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = lines.length;

  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  /**
   * Refined Syntax Highlighter with Unicode Protection
   * Ensures official Rust tokens are colored correctly without glitches.
   */
  const highlightRust = (code: string) => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const parts: string[] = [];
    const PUA_START = 0xE000;

    const rules = [
      // 1. Comments
      { regex: /(\/\/.*)/g, class: 'text-muted-foreground/60 italic' },
      // 2. Strings
      { regex: /(&quot;.*?&quot;)/g, class: 'text-[#ce9178]' },
      // 3. Macros (Golden-Yellow)
      { regex: /(\b\w+!)/g, class: 'text-[#dcdcaa]' },
      // 4. Keywords (VS Code Blue)
      { regex: /\b(fn|let|mut|match|use|pub|struct|enum|impl|trait|type|where|as|break|continue|else|for|if|in|loop|return|while|mod|crate|extern|self|Super|true|false|async|await|dyn|move|static|unsafe)\b/g, class: 'text-[#569cd6]' },
      // 5. Types (Teal)
      { regex: /\b(i32|u32|i64|u64|f32|f64|str|String|bool|Option|Result|Vec|char|u8|i8|u16|i16|u128|i128|usize|isize|Self)\b/g, class: 'text-[#4ec9b0]' },
      // 6. Numbers (Light Cyan)
      { regex: /\b(\d+)\b/g, class: 'text-[#b5cea8]' },
    ];

    rules.forEach((rule) => {
      escaped = escaped.replace(rule.regex, (match) => {
        const index = parts.length;
        parts.push(`<span class="${rule.class}">${match}</span>`);
        return String.fromCharCode(PUA_START + index);
      });
    });

    return escaped.replace(/[\uE000-\uF8FF]/g, (char) => {
      const index = char.charCodeAt(0) - PUA_START;
      return parts[index] || char;
    });
  };

  // Synchronized styles to eliminate "ghosting" glitches
  const sharedStyles: React.CSSProperties = {
    fontFamily: 'var(--font-code)',
    fontSize: '13px',
    lineHeight: '24px',
    padding: '16px',
    fontVariantLigatures: 'none',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    letterSpacing: 'normal',
    wordSpacing: 'normal',
  };

  return (
    <div className={cn("relative flex h-full w-full bg-[#0d0d0d] overflow-hidden border border-border group", className)}>
      <div 
        ref={lineNumbersRef}
        className="flex flex-col bg-[#0d0d0d] py-4 text-right pr-4 select-none border-r border-border/50 min-w-[3.5rem] font-code text-[11px] text-muted-foreground/40 overflow-hidden"
      >
        {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
          <div key={i} className="leading-6 h-6">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative flex-1 h-full overflow-hidden">
        {/* Visual Layer (Syntax Highlighting) */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          style={sharedStyles}
          className="absolute inset-0 whitespace-pre pointer-events-none overflow-hidden select-none z-0"
          dangerouslySetInnerHTML={{ __html: highlightRust(value) + '\n' }}
        />

        {/* Interaction Layer (Native Textarea) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={sharedStyles}
          className="absolute inset-0 w-full h-full text-transparent caret-white bg-transparent border-none outline-none resize-none focus:ring-0 whitespace-pre overflow-auto scrollbar-hide selection:bg-primary/30 z-10"
          placeholder="// Write your Rust code here..."
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </div>
  );
}
