import { createFileRoute } from "@tanstack/react-router";
import { ApologyExperience } from "@/components/apology-experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Tiny Apology for Mel — Paul" },
      { name: "description", content: "A tiny, ridiculous, heartfelt apology world made by Paul for Mel." },
      { property: "og:title", content: "A Tiny Apology for Mel — Paul" },
      { property: "og:description", content: "A tiny, ridiculous, heartfelt apology world made by Paul for Mel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ApologyExperience />;
}
