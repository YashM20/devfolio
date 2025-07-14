import { NextResponse } from "next/server";
import VCard from "vcard-creator";

import { USER } from "@/data/user";
import { decodeEmail, decodePhoneNumber } from "@/utils/string";

export const dynamic = "force-static";

/**
 * Handles a GET request to generate and return a vCard file containing user information.
 *
 * The vCard includes the user's name, address, email, website, avatar photo (if available), and the first job's company and title (if present). The response prompts the client to download the vCard as a `.vcf` file named after the user's username.
 *
 * @returns An HTTP response with the generated vCard as a downloadable file.
 */
export async function GET() {
  const card = new VCard();

  card
    .addName(USER.lastName, USER.firstName)
    .addAddress(USER.address)
    .addEmail(decodeEmail(USER.email))
    .addURL(USER.website);

  const photo = await getVCardPhoto(USER.avatar);
  if (photo) {
    card.addPhoto(photo.image, photo.mine);
  }

  if (USER.jobs.length > 0) {
    const company = USER.jobs[0];
    card.addCompany(company.company).addJobtitle(company.title);
  }

  return new NextResponse(card.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/x-vcard",
      "Content-Disposition": `attachment; filename=${USER.username}-vcard.vcf`,
    },
  });
}

async function getVCardPhoto(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) {
      return null;
    }

    const image = buffer.toString("base64");

    const contentType = res.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    return {
      image,
      mine: contentType.split("/")[1],
    };
  } catch {
    return null;
  }
}
