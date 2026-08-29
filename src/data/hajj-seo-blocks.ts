export type HajjSeoBlockType =
  | "intro"
  | "paragraph"
  | "h2"
  | "h3"
  | "bulletList"
  | "internalLink"
  | "faqRef";

export type HajjSeoBlock =
  | { id: string; type: "intro"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "h2"; text: string }
  | { id: string; type: "h3"; text: string }
  | { id: string; type: "bulletList"; items: string[] }
  | { id: string; type: "internalLink"; label: string; href: string }
  | { id: string; type: "faqRef"; faqId: string; label: string };

export type HajjSeoContent = {
  title: string;
  blocks: HajjSeoBlock[];
};

/** @deprecated Legacy plain-text body — migrated to blocks on read */
export type HajjSeoContentLegacy = HajjSeoContent & { body?: string };

export function createHajjSeoBlockId(): string {
  return `seo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyHajjSeoBlock(type: HajjSeoBlockType): HajjSeoBlock {
  const id = createHajjSeoBlockId();
  switch (type) {
    case "intro":
    case "paragraph":
    case "h2":
    case "h3":
      return { id, type, text: "" };
    case "bulletList":
      return { id, type, items: [""] };
    case "internalLink":
      return { id, type, label: "", href: "" };
    case "faqRef":
      return { id, type, faqId: "", label: "" };
  }
}

export function normalizeHajjSeoContent(
  patch: HajjSeoContentLegacy | undefined,
  defaults: HajjSeoContent,
): HajjSeoContent {
  const title = patch?.title?.trim() ? patch.title : defaults.title;

  if (patch?.blocks?.length) {
    return { title, blocks: patch.blocks };
  }

  const legacyBody = patch?.body?.trim();
  if (legacyBody) {
    return {
      title,
      blocks: legacyBody
        .split(/\n\n+/)
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text, index) => ({
          id: `legacy-p-${index}`,
          type: "paragraph" as const,
          text,
        })),
    };
  }

  return { title, blocks: defaults.blocks };
}
