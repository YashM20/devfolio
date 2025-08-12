"use client";

import {
  CopyIcon,
  FacebookIcon,
  LinkedinIcon,
  XIcon,
  MailIcon,
  Share2Icon,
  TwitterIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSocialShareUrls } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export function ShareButtons({
  url,
  title,
  description,
  className,
  size = "default",
  variant = "ghost",
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrls = getSocialShareUrls(url, title, description);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const shareOptions = [
    {
      label: "Copy link",
      icon: CopyIcon,
      action: handleCopy,
      color: "text-muted-foreground hover:text-foreground",
    },
    {
      label: "Share on Twitter",
      icon: XIcon,
      action: () => handleShare(shareUrls.twitter, "Twitter"),
      color: "text-muted-foreground hover:text-[#1DA1F2]",
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedinIcon,
      action: () => handleShare(shareUrls.linkedin, "LinkedIn"),
      color: "text-muted-foreground hover:text-[#0077B5]",
    },
    {
      label: "Share on Facebook",
      icon: FacebookIcon,
      action: () => handleShare(shareUrls.facebook, "Facebook"),
      color: "text-muted-foreground hover:text-[#1877F2]",
    },
    {
      label: "Share via Email",
      icon: MailIcon,
      action: () => handleShare(shareUrls.email, "Email"),
      color: "text-muted-foreground hover:text-foreground",
    },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
        >
          <Share2Icon className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.action}
            className="gap-2"
          >
            <option.icon className={cn("h-4 w-4", option.color)} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
