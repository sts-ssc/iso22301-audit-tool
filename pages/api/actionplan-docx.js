const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  AlignmentType,
  HeadingLevel,
} = require("docx");

const PRIO_LABEL = { 1: "Prio 1 - kritisch", 2: "Prio 2 - mittel", 3: "Prio 3 - niedrig" };
const PRIO_COLOR = { 1: "C0392B", 2: "E67E22", 3: "27AE60" };

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.shading ? { type: ShadingType.SOLID, color: opts.shading, fill: opts.shading } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text || "-",
            bold: !!opts.bold,
            color: opts.color,
            size: 18,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function headerCell(text) {
  return cell(text, { bold: true, shading: "0B3B5C", color: "FFFFFF" });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt." });
  }

  try {
    const { orgName, auditor, auditDate, rows } = req.body || {};
    const data = Array.isArray(rows) ? rows : [];

    const headerRow = new TableRow({
      children: [
        headerCell("Prio"),
        headerCell("ID"),
        headerCell("Anforderung"),
        headerCell("Bereich"),
        headerCell("Reifegrad"),
        headerCell("Verantwortlich"),
        headerCell("Termin"),
        headerCell("Massnahme / Empfehlung"),
      ],
    });

    const bodyRows = data
      .sort((a, b) => (a.prio || 9) - (b.prio || 9))
      .map((r) => {
        const noteCombined = [r.note, r.rec].filter(Boolean).join(" | ");
        return new TableRow({
          children: [
            cell(PRIO_LABEL[r.prio] || "-", { color: PRIO_COLOR[r.prio], bold: true }),
            cell(r.id),
            cell(r.title),
            cell(r.domain),
            cell(r.rating),
            cell(r.owner),
            cell(r.due),
            cell(noteCombined),
          ],
        });
      });

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...bodyRows],
    });

    const doc = new Document({
      styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
      sections: [
        {
          properties: {
            page: {
              size: { width: 16838, height: 11906 }, // A4 quer
              margin: { top: 850, right: 850, bottom: 850, left: 850 },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: "ISO 22301 - Action Plan", bold: true, size: 32, font: "Arial" })],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Organisation: ${orgName || "-"}    Auditor/in: ${auditor || "-"}    Audit-Datum: ${
                    auditDate || "-"
                  }`,
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            table,
          ],
        },
      ],
    });

    const buf = await Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", 'attachment; filename="Action_Plan.docx"');
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message || "Fehler beim Word-Export." });
  }
};
