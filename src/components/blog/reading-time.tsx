import { ClockIcon } from "lucide-react";

import { calculateReadingTime } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

interface ReadingTimeProps {
  content: string;
  className?: string;
  showIcon?: boolean;
  showWords?: boolean;
}

export function ReadingTime({
  content,
  className,
  showIcon = true,
  showWords = false,
}: ReadingTimeProps) {
  const { minutes, words, text } = calculateReadingTime(content);

  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-1.5 text-sm",
        className
      )}
    >
      {showIcon && <ClockIcon className="h-3.5 w-3.5" />}
      <span>{text}</span>
      {showWords && (
        <span className="text-muted-foreground/70">
          · {words.toLocaleString()} words
        </span>
      )}
    </div>
  );
}
