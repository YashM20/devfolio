import dayjs from "dayjs";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { getIcon, Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { Certification } from "../../types/certifications";

export function CertificationItem({
  className,
  certification,
}: {
  className?: string;
  certification: Certification;
}) {
  return (
    <a
      className={cn("group/cert flex items-center pr-2", className)}
      href={certification.credentialURL}
      target="_blank"
      rel="noopener"
    >
      {certification.issuerLogoURL ? (
        <Image
          src={certification.issuerLogoURL}
          alt={certification.issuer}
          width={32}
          height={32}
          quality={100}
          className="mx-4 flex size-6 shrink-0"
          unoptimized
          aria-hidden
        />
      ) : (
        <div
          className="[&_svg]:text-muted-foreground mx-4 flex size-6 shrink-0 items-center justify-center [&_svg]:size-5"
          aria-hidden
        >
          {getIcon(certification.issuerIconName) ?? <Icons.certificate />}
        </div>
      )}

      <div className="border-edge flex-1 space-y-1 border-l border-dashed p-4 pr-2">
        <h3 className="text-balance font-medium leading-snug underline-offset-4 group-hover/cert:underline">
          {certification.title}
        </h3>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <div>
            <dt className="sr-only">Issued by</dt>
            <dd>
              <span aria-hidden>@</span>
              <span className="ml-0.5">{certification.issuer}</span>
            </dd>
          </div>

          <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          />

          <div>
            <dt className="sr-only">Issued on</dt>
            <dd>
              <time dateTime={dayjs(certification.issueDate).toISOString()}>
                {dayjs(certification.issueDate).format("DD.MM.YYYY")}
              </time>
            </dd>
          </div>
        </div>
      </div>

      {certification.credentialURL && (
        <ArrowUpRightIcon
          className="text-muted-foreground size-4"
          aria-hidden
        />
      )}
    </a>
  );
}
