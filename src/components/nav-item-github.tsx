import React from "react";

import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/config/site";

import { Icons } from "./icons";

export function NavItemGitHub() {
  return (
    <Button variant="outline" size="icon" asChild>
      <a href={GITHUB_URL} target="_blank" rel="noopener">
        <Icons.github />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}
