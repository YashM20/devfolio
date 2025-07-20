"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!inline) {
    const language = className?.replace("language-", "") || "text";
    const code = String(children).replace(/\n$/, "");

    return (
      <div className="not-prose group relative my-4 flex w-full min-w-0 flex-col">
        {/* Language label and copy button */}
        <div className="bg-muted text-muted-foreground border-border flex flex-shrink-0 items-center justify-between rounded-t-md border-b px-3 py-2 text-xs">
          <span className="font-medium">{language}</span>
          <button
            onClick={() => handleCopy(code)}
            className="hover:bg-background/50 flex flex-shrink-0 items-center gap-1 rounded px-2 py-1 opacity-0 transition-colors group-hover:opacity-100"
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Syntax highlighted code */}
        <div className="w-full min-w-0 overflow-x-auto">
          <SyntaxHighlighter
            language={language === "text" ? "javascript" : language}
            style={isDark ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              borderRadius: "0 0 0.375rem 0.375rem",
              border: "none",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              width: "100%",
              minWidth: "100%",
            }}
            showLineNumbers={code.split("\n").length > 5}
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: isDark ? "#6b7280" : "#9ca3af",
              userSelect: "none",
            }}
            codeTagProps={{
              style: {
                fontSize: "0.875rem",
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                whiteSpace: "pre",
                wordBreak: "normal",
                overflowWrap: "normal",
                display: "block",
                width: "max-content",
                minWidth: "100%",
              },
            }}
            wrapLines={false}
            wrapLongLines={false}
            PreTag={({ children, ...props }) => (
              <pre
                {...props}
                style={{
                  ...props.style,
                  margin: 0,
                  padding: "1rem",
                  overflow: "visible",
                }}
              >
                {children}
              </pre>
            )}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} bg-muted rounded-md px-1 py-0.5 font-mono text-sm`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
