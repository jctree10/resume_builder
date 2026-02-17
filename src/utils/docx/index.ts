import {
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
} from "docx";
import type {
  Block,
  LinkBlock,
  BulletBlock,
  KeyValueBlock,
  EntryBlock,
  DashListBlock,
} from "../../types/resume";
import { stripHtml } from "../helpers";

export const FONT = "Cambria";
export const FONT_SANS = "Calibri";

export const docxDivider = (): Paragraph =>
  new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
    },
    spacing: { before: 240, after: 240 },
  });

export const docxSectionHeading = (text: string): Paragraph =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT,
        size: 22,
        bold: true,
        characterSpacing: 60,
      }),
    ],
  });

export const docxEntryHeader = (title: string, date: string): Paragraph =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 40 },
    children: [
      new TextRun({ text: title, font: FONT, size: 21, bold: true }),
      new TextRun({ text: "\t", font: FONT_SANS }),
      new TextRun({ text: date, font: FONT_SANS, size: 18, color: "666666" }),
    ],
  });

export const docxSubtitle = (text: string): Paragraph =>
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text, font: FONT_SANS, size: 18, color: "555555" }),
    ],
  });

export const docxBullet = (text: string, indent = 0): Paragraph =>
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 240 + indent * 240 },
    children: [
      new TextRun({ text: "▸ ", font: FONT_SANS, size: 18, color: "999999" }),
      new TextRun({ text, font: FONT_SANS, size: 18, color: "333333" }),
    ],
  });

export function blockToDocx(block: Block): Paragraph[] {
  switch (block.type) {
    case "text":
      return [
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: block.value,
              font: FONT_SANS,
              size: 18,
              color: "333333",
            }),
          ],
        }),
      ];

    case "richtext":
      return [
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: stripHtml(block.value),
              font: FONT_SANS,
              size: 18,
              color: "333333",
            }),
          ],
        }),
      ];

    case "link": {
      const lb = block as LinkBlock;
      return [
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: lb.label,
              font: FONT_SANS,
              size: 18,
              color: "333333",
            }),
          ],
        }),
      ];
    }

    case "bullet": {
      const bb = block as BulletBlock;
      return [docxBullet(bb.value, bb.indent)];
    }

    case "keyvalue": {
      const kv = block as KeyValueBlock;
      return [
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${kv.label}: `,
              font: FONT_SANS,
              size: 18,
              bold: true,
            }),
            new TextRun({
              text: kv.value,
              font: FONT_SANS,
              size: 18,
              color: "333333",
            }),
          ],
        }),
      ];
    }

    case "entry": {
      const entry = block as EntryBlock;
      const paras: Paragraph[] = [];
      paras.push(docxEntryHeader(entry.title, entry.date));
      if (entry.subtitle) paras.push(docxSubtitle(entry.subtitle));
      if (entry.description) {
        paras.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: stripHtml(entry.description),
                font: FONT_SANS,
                size: 18,
                color: "444444",
              }),
            ],
          }),
        );
      }
      for (const se of entry.subEntries) {
        paras.push(
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 240 },
            children: [
              new TextRun({
                text: se.title,
                font: FONT_SANS,
                size: 18,
                bold: true,
                color: "222222",
              }),
            ],
          }),
        );
        for (const b of se.bullets) paras.push(docxBullet(b.value, 1));
      }
      for (const b of entry.bullets) paras.push(docxBullet(b.value, b.indent));
      for (const l of entry.links) {
        paras.push(
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 240 },
            children: [
              new TextRun({
                text: `${l.label}: ${l.url}`,
                font: FONT_SANS,
                size: 18,
                color: "0563C1",
              }),
            ],
          }),
        );
      }
      paras.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      return paras;
    }

    case "separator":
      return [docxDivider()];

    case "dashlist": {
      const dl = block as DashListBlock;
      const runs: TextRun[] = [];
      dl.items.forEach((item, idx) => {
        if (idx > 0) {
          runs.push(
            new TextRun({
              text: dl.separator || " — ",
              font: FONT_SANS,
              size: 18,
              color: "999999",
            }),
          );
        }
        runs.push(
          new TextRun({
            text: item.label,
            font: FONT_SANS,
            size: 18,
            color: item.url ? "0563C1" : "333333",
          }),
        );
      });
      return [new Paragraph({ spacing: { after: 120 }, children: runs })];
    }
  }
}
