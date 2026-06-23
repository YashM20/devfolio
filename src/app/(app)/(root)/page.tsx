import dayjs from "dayjs";
import { Suspense } from "react";
import type { ProfilePage as PageSchema, WithContext } from "schema-dts";

import { USER } from "@/data/user";
import { About } from "@/features/profile/components/about";
import { Awards } from "@/features/profile/components/awards";
import { Blog } from "@/features/profile/components/blog";
import { Certifications } from "@/features/profile/components/certifications";
import { Experiences } from "@/features/profile/components/experiences";
import { Overview } from "@/features/profile/components/overview";
import { ProfileCover } from "@/features/profile/components/profile-cover";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { Projects } from "@/features/profile/components/projects";
import { SocialLinks } from "@/features/profile/components/social-links";
import { TechStack } from "@/features/profile/components/tech-stack";
import { GitHubContributions } from "@/features/profile/components/github-contributions";
import { Insights } from "@/features/profile/components/insights";
import { cn } from "@/lib/utils";
import { DynamicDate } from "@/components/dynamic-date";

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <DynamicJsonLd />
      </Suspense>

      <div className="mx-auto md:max-w-3xl">
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <Overview />
        <Separator />

        <SocialLinks />
        <Separator />

        <About />
        <Separator />

        <GitHubContributions />
        <Separator />

        <TechStack />
        <Separator />

        <Experiences />
        <Separator />

        <Projects />
        <Separator />

        <Blog />
        <Separator />

        {/* <Awards />
        <Separator /> */}

        <Certifications />
        <Separator />

        <Insights />
        <Separator />
      </div>
    </>
  );
}

async function DynamicJsonLd() {
  const currentDate = await DynamicDate();

  const jsonLd: WithContext<PageSchema> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: dayjs(USER.dateCreated).toISOString(),
    dateModified: currentDate,
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-edge relative flex h-8 w-full border-x",
        "before:-z-1 before:absolute before:-left-[100vw] before:h-8 before:w-[200vw]",
        "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56 before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
        className
      )}
    />
  );
}
