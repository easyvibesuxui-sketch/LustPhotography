import { Suspense } from "react";
import Browse from "@/components/Browse";

export const metadata = { title: "Browse — Lust Photography" };

export default function BrowsePage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36">
      <Suspense>
        <Browse />
      </Suspense>
    </div>
  );
}
