"use client";

import { useState } from "react";
import { CollapsibleList } from "@/components/collapsible-list";

import { CERTIFICATIONS } from "../../data/certifications";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";

const CertificationListItem = ({
  item,
}: {
  item: (typeof CERTIFICATIONS)[number];
}) => <CertificationItem certification={item} />;

const CATEGORIES = [
  "All",
  "Anthropic",
  "Vercel",
  "LinkedIn",
  "Udemy",
  "Others",
];

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredCertifications = CERTIFICATIONS.filter((c) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Others") {
      return (
        c.issuer !== "Anthropic" &&
        c.issuer !== "Vercel" &&
        c.issuer !== "LinkedIn" &&
        c.issuer !== "Udemy"
      );
    }
    return c.issuer === activeCategory;
  });

  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <sup className="ml-1 font-mono text-sm font-medium text-muted-foreground select-none">
            ({filteredCertifications.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <div className="h-4" />

      <div className="screen-line-before screen-line-after">
        <nav className="-mx-px no-scrollbar flex scroll-fade-x overflow-x-auto border-edge whitespace-nowrap scroll-fade-24">
          {CATEGORIES.map((cat) => {
            const count = CERTIFICATIONS.filter((c) => {
              if (cat === "All") return true;
              if (cat === "Others") {
                return (
                  c.issuer !== "Anthropic" &&
                  c.issuer !== "Vercel" &&
                  c.issuer !== "LinkedIn" &&
                  c.issuer !== "Udemy"
                );
              }
              return c.issuer === cat;
            }).length;

            // Only render category if there are matching certifications
            if (count === 0) return null;

            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-active={isActive}
                className="cursor-pointer border-r border-edge px-4 py-3 font-mono text-[.8125rem]/4 font-medium tracking-wide text-muted-foreground uppercase transition-[color,background-color] ease-out select-none hover:bg-accent/50 hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground"
              >
                {cat} ({count})
              </button>
            );
          })}
        </nav>
      </div>

      <CollapsibleList
        key={activeCategory}
        items={filteredCertifications}
        max={8}
        renderItem={CertificationListItem}
      />
    </Panel>
  );
}
