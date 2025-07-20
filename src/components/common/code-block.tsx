import React from "react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const language = className?.replace("language-", "") || "";

  return (
    <div className="my-4">
      {language && (
        <div className="bg-muted text-muted-foreground border-border rounded-t-md border-b px-3 py-1 text-xs">
          {language}
        </div>
      )}
      <pre
        className={`bg-muted rounded-md p-4 ${language ? "rounded-t-none" : ""} overflow-x-auto`}
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};
