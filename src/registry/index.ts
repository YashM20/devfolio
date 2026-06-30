import type { Registry } from "shadcn/schema";

import { components } from "./registry-components";
import { examples } from "./registry-examples";
import { hook } from "./registry-hook";
import { lib } from "./registry-lib";

export const registry = {
  name: "yash_mhj",
  homepage: "https://yash.reactopia.me/components",
  items: [
    ...lib,
    ...hook,
    ...components,

    // Internal use only
    ...examples,
  ],
} satisfies Registry;
