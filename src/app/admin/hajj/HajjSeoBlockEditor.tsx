"use client";

import {
  createEmptyHajjSeoBlock,
  type HajjSeoBlock,
  type HajjSeoBlockType,
  type HajjSeoContent,
} from "@/data/hajj-seo-blocks";
import type { HajjFaqItem } from "@/data/hajj-content-defaults";

const BLOCK_TYPE_LABELS: Record<HajjSeoBlockType, string> = {
  intro: "Intro-Absatz",
  paragraph: "Absatz",
  h2: "Zwischenüberschrift (H2)",
  h3: "Zwischenüberschrift (H3)",
  bulletList: "Aufzählung",
  internalLink: "Interner Link",
  faqRef: "FAQ-Verweis",
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const className = "mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm";
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      {multiline ? (
        <textarea
          className={className}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={className} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function updateBlock(blocks: HajjSeoBlock[], index: number, next: HajjSeoBlock): HajjSeoBlock[] {
  const copy = [...blocks];
  copy[index] = next;
  return copy;
}

function moveBlock(blocks: HajjSeoBlock[], index: number, direction: -1 | 1): HajjSeoBlock[] {
  const target = index + direction;
  if (target < 0 || target >= blocks.length) return blocks;
  const copy = [...blocks];
  const [item] = copy.splice(index, 1);
  if (!item) return blocks;
  copy.splice(target, 0, item);
  return copy;
}

function BlockFields({
  block,
  faqs,
  onChange,
}: {
  block: HajjSeoBlock;
  faqs: HajjFaqItem[];
  onChange: (block: HajjSeoBlock) => void;
}) {
  switch (block.type) {
    case "intro":
    case "paragraph":
    case "h2":
    case "h3":
      return (
        <Field
          label="Text"
          value={block.text}
          onChange={(text) => onChange({ ...block, text })}
          multiline={block.type === "intro" || block.type === "paragraph"}
          rows={block.type === "intro" || block.type === "paragraph" ? 5 : 2}
        />
      );
    case "bulletList":
      return (
        <div className="space-y-2">
          <span className="text-sm font-medium">Listenpunkte</span>
          {block.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[itemIndex] = e.target.value;
                  onChange({ ...block, items });
                }}
              />
              <button
                type="button"
                className="shrink-0 rounded-lg border border-line px-2 text-xs text-muted hover:bg-surface"
                onClick={() => {
                  const items = block.items.filter((_, i) => i !== itemIndex);
                  onChange({ ...block, items: items.length ? items : [""] });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-brand-cta"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          >
            + Punkt hinzufügen
          </button>
        </div>
      );
    case "internalLink":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Link-Text"
            value={block.label}
            onChange={(label) => onChange({ ...block, label })}
          />
          <Field
            label="Pfad"
            value={block.href}
            onChange={(href) => onChange({ ...block, href })}
            hint="z. B. /hajj-2027/vormerkung oder /umrah-gruppenreisen"
          />
        </div>
      );
    case "faqRef":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">FAQ</span>
            <select
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
              value={block.faqId}
              onChange={(e) => onChange({ ...block, faqId: e.target.value })}
            >
              <option value="">FAQ wählen…</option>
              {faqs.map((faq) => (
                <option key={faq.id} value={faq.id}>
                  {faq.question}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Link-Text"
            value={block.label}
            onChange={(label) => onChange({ ...block, label })}
            hint="Anzeigetext für den Verweis"
          />
        </div>
      );
    default:
      return null;
  }
}

export function HajjSeoBlockEditor({
  seo,
  faqs,
  onChange,
}: {
  seo: HajjSeoContent;
  faqs: HajjFaqItem[];
  onChange: (seo: HajjSeoContent) => void;
}) {
  const setBlocks = (blocks: HajjSeoBlock[]) => onChange({ ...seo, blocks });

  return (
    <div className="md:col-span-2 space-y-4">
      <Field
        label="SEO-Überschrift"
        value={seo.title}
        onChange={(title) => onChange({ ...seo, title })}
      />

      <div className="flex flex-wrap gap-2">
        {(Object.keys(BLOCK_TYPE_LABELS) as HajjSeoBlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-brand-orange/40"
            onClick={() => setBlocks([...seo.blocks, createEmptyHajjSeoBlock(type)])}
          >
            + {BLOCK_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {seo.blocks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-center text-sm text-muted">
          Noch keine Inhaltsblöcke. Füge Intro, Absätze, Überschriften, Listen oder Links hinzu.
        </p>
      ) : null}

      {seo.blocks.map((block, index) => (
        <div key={block.id} className="rounded-xl border border-line bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-orange-ink">
              {BLOCK_TYPE_LABELS[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                className="rounded border border-line px-2 py-1 text-xs disabled:opacity-40"
                onClick={() => setBlocks(moveBlock(seo.blocks, index, -1))}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index >= seo.blocks.length - 1}
                className="rounded border border-line px-2 py-1 text-xs disabled:opacity-40"
                onClick={() => setBlocks(moveBlock(seo.blocks, index, 1))}
              >
                ↓
              </button>
              <button
                type="button"
                className="rounded border border-line px-2 py-1 text-xs text-brand-red"
                onClick={() => setBlocks(seo.blocks.filter((_, i) => i !== index))}
              >
                Entfernen
              </button>
            </div>
          </div>
          <BlockFields
            block={block}
            faqs={faqs}
            onChange={(next) => setBlocks(updateBlock(seo.blocks, index, next))}
          />
        </div>
      ))}
    </div>
  );
}
