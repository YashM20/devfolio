import dayjs from "dayjs";
import { headers } from "next/headers";

export async function DynamicDate() {
  // Using headers() makes this component dynamic
  await headers();

  return dayjs().toISOString();
}
