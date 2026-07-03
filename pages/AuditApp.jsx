import React, { useState, useRef, useEffect } from "react";
import { DOMAINS, DC, DC_BG, CONTROLS } from "../lib/data";

const FONT = "Arial,sans-serif";

const RATING_LABELS = {
  0: "Not existing",
  1: "Initial",
  2: "Repeatable",
  3: "Defined",
  4: "Managed",
  5: "Optimized",
  na: "Not Applicable",
};

const ratingColorFn = (v) => {
  const n = Number(v);
  if (v === "na" || v == null || v === "") return "#B0B0B0";
  if (n === 0) return "#5C0011";
  if (n === 1) return "#D0021B";
  if (n === 2) return "#E8660A";
  if (n === 3) return "#F5C518";
  if (n === 4) return "#3A9E3A";
  if (n >= 5) return "#1A5C1A";
  return "#B0B0B0";
};

const ratingLabelFn = (v) => {
  if (v == null || v === "") return "Nicht bewertet";
  if (v === "na") return "Nicht anwendbar";
  return `${v} – ${RATING_LABELS[v] || ""}`;
};

const cleanText = (s) =>
  (s || "")
    .replace(/#+/g, "")
    .replace(/\*\*/g, "")
    .replace(/ß/g, "ss")
    .trim();

const suggestPrio = (rating) => {
  if (rating == null || rating === "" || rating === "na") return null;
  const n = Number(rating);
  if (n <= 1) return 1; // kritisch
  if (n === 3) return 2; // mittel
  return 3; // niedrig (2, 4, 5)
};

const PRIO_STYLE = {
  1: { bg: "#FDF0F0", border: "#F0B0B0", text: "#C0392B", label: "Prio 1 – kritisch" },
  2: { bg: "#FEF6EC", border: "#FACB94", text: "#E67E22", label: "Prio 2 – mittel" },
  3: { bg: "#F0FAF5", border: "#9FD9BE", text: "#27AE60", label: "Prio 3 – niedrig" },
};

const pad2 = (n) => String(n).padStart(2, "0");

function buildPrompt(ctrl, answer) {
  return `ISO 22301 Anforderung ${ctrl.id}: "${ctrl.title}"
Frage: "${ctrl.q}"
Reifegrad (manuell bewertet): ${ratingLabelFn(answer.rating)}
Antwort: "${answer.note || ""}"
Nachweis/Referenz: "${answer.ref || ""}"

Bitte antworte auf Deutsch mit genau diesem Format:
KI_REIFEGRAD: [Zahl 0-5]
BEGRUENDUNG: [1-2 Sätze warum dieser KI-Reifegrad]
RISIKO: [2-3 Sätze]
EMPFEHLUNG: [2-3 Sätze]`;
}

function parseKIResponse(text) {
  const clean = cleanText(text);
  const get = (label) => {
    const re = new RegExp(
      label + ":\\s*([^\\n]*(?:\\n(?!\\s*(?:KI_REIFEGRAD|BEGRUENDUNG|RISIKO|EMPFEHLUNG)\\s*:).*)*)",
      "i"
    );
    const m = clean.match(re);
    return m ? m[1].trim() : "";
  };
  const kiRgRaw = get("KI_REIFEGRAD");
  const digitMatch = kiRgRaw.match(/\d/);
  const kiRg = digitMatch ? Math.min(5, Number(digitMatch[0])) : null;
  return {
    kiRg,
    beg: get("BEGRUENDUNG"),
    risk: get("RISIKO"),
    rec: get("EMPFEHLUNG"),
  };
}

// ---------- Wiederverwendbare UI-Bausteine ----------

function FieldPair({ labelA, labelB, children, colors }) {
  const c = colors || { bg: "#E8F0FA", border: "#B0C8E0", text: "#0B3B5C" };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: c.text, minWidth: 90 }}>
          {labelA}
        </div>
        <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: c.text, flex: 1 }}>
          {labelB}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 6,
          padding: "8px 10px",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FullWidthBox({ label, value, colors }) {
  const c = colors || { bg: "#FDF0F0", border: "#F0B0B0", text: "#A32D2D" };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: c.text, marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 6,
          padding: "8px 10px",
          fontSize: 12,
          fontFamily: FONT,
          color: "#222",
          minHeight: 18,
          whiteSpace: "pre-wrap",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        {value || "–"}
      </div>
    </div>
  );
}

function Badge({ value }) {
  const color = ratingColorFn(value);
  return (
    <span
      style={{
        display: "inline-block",
        minWidth: 70,
        textAlign: "center",
        background: color,
        color: "#fff",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 12,
        borderRadius: 5,
        padding: "3px 8px",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {value == null || value === "" ? "–" : value === "na" ? "N/A" : value}
    </span>
  );
}

function Bar({ label, value, color, widthLabel }) {
  const pct = value === "na" || value == null || value === "" ? 0 : (Number(value) / 5) * 100;
  const c = color || ratingColorFn(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div
        style={{
          width: widthLabel || 320,
          fontSize: 11,
          fontFamily: FONT,
          textAlign: "left",
          color: "#333",
          overflow: "visible",
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, position: "relative", height: 16, background: "#f0f0f0", borderRadius: 3 }}>
        {[1, 2, 3, 4, 5].map((v) => (
          <div
            key={v}
            style={{
              position: "absolute",
              left: `${(v / 5) * 100}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: "#ccc",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct}%`,
            background: c,
            borderRadius: 3,
            opacity: 0.85,
            printColorAdjust: "exact",
            WebkitPrintColorAdjust: "exact",
          }}
        />
      </div>
      <div style={{ width: 30, fontWeight: 700, color: c, fontFamily: FONT, fontSize: 12 }}>
        {value === "na" || value == null || value === "" ? "–" : value}
      </div>
    </div>
  );
}

function Donut({ segments, size }) {
  // segments: [{value, color}], value = Anteil 0..1
  const s = size || 120;
  let acc = 0;
  const stops = [];
  segments.forEach((seg) => {
    const start = acc * 360;
    acc += seg.value;
    const end = acc * 360;
    stops.push(`${seg.color} ${start}deg ${end}deg`);
  });
  const gradient = stops.length ? `conic-gradient(${stops.join(",")})` : "#eee";
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: gradient,
        position: "relative",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: s * 0.22,
          left: s * 0.22,
          width: s * 0.56,
          height: s * 0.56,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    </div>
  );
}

function RatingButtonLarge({ value, selected, onClick }) {
  const c = ratingColorFn(value);
  const label = value === "na" ? "N/A" : value;
  return (
    <button
      onClick={onClick}
      title={value === "na" ? "Nicht anwendbar" : RATING_LABELS[value]}
      style={{
        border: `2px solid ${c}`,
        background: selected ? c : "#fff",
        color: selected ? "#fff" : c,
        fontWeight: 700,
        fontSize: 13,
        borderRadius: 7,
        padding: "7px 14px",
        fontFamily: FONT,
        cursor: "pointer",
        minWidth: 42,
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
}

function BoxField({ icon, label, placeholder, value, onChange }) {
  return (
    <div
      style={{
        border: "1px solid #B9D4EF",
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 12,
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#0B3B5C",
          marginBottom: 6,
          fontFamily: FONT,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <textarea
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          resize: "vertical",
          minHeight: 56,
          fontSize: 13,
          fontFamily: FONT,
          color: "#222",
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FilterPill({ active, onClick, children, color, outline }) {
  const c = color || "#5B2D8E";
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${c}` : "1px solid #ddd",
        background: active && !outline ? c : "#fff",
        color: active && !outline ? "#fff" : c,
        fontWeight: 700,
        fontSize: 12,
        borderRadius: 16,
        padding: "5px 12px",
        fontFamily: FONT,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function RatingChip({ value, active, onClick }) {
  const c = ratingColorFn(value);
  const label = value === "na" ? "N/A" : value;
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${c}` : `1px solid ${c}`,
        background: active ? c : "#fff",
        color: active ? "#fff" : c,
        fontWeight: 700,
        fontSize: 11,
        borderRadius: 6,
        padding: "4px 8px",
        fontFamily: FONT,
        cursor: "pointer",
        minWidth: 26,
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
}

// ---------- Hauptkomponente ----------

export default function AuditApp() {
  const [view, setView] = useState("setup");
  const [orgName, setOrgName] = useState("");
  const [auditor, setAuditor] = useState("");
  const [auditDate, setAuditDate] = useState("");

  const [answers, setAnswers] = useState({});
  const [riskRec, setRiskRec] = useState({});
  const [actionPlan, setActionPlan] = useState({});

  const [expandedDomain, setExpandedDomain] = useState(DOMAINS[0]);
  const [loadingIds, setLoadingIds] = useState({});
  const [warnIds, setWarnIds] = useState({});
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  const [dashGlobalFilter, setDashGlobalFilter] = useState("all");
  const [dashDomainFilter, setDashDomainFilter] = useState({ domain: null, value: "all" });
  const [hintOpen, setHintOpen] = useState({});
  const [erlOpen, setErlOpen] = useState({});
  const [wasOpen, setWasOpen] = useState({});
  const [auditFilter, setAuditFilter] = useState("all"); // "all" | "open" | 0..5 | "na"

  const fileInputRef = useRef(null);
  const restoredRef = useRef(false);

  // Auto-Save / Restore über LocalStorage (Komfortfunktion, ersetzt nicht den JSON-Export)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = window.localStorage.getItem("iso22301-audit-autosave");
      if (raw) {
        const data = JSON.parse(raw);
        setOrgName(data.orgName || "");
        setAuditor(data.auditor || "");
        setAuditDate(data.auditDate || "");
        setAnswers(data.answers || {});
        setRiskRec(data.riskRec || {});
        setActionPlan(data.actionPlan || {});
      }
    } catch (e) {
      // ignorieren
    }
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      window.localStorage.setItem(
        "iso22301-audit-autosave",
        JSON.stringify({ orgName, auditor, auditDate, answers, riskRec, actionPlan })
      );
    } catch (e) {
      // ignorieren (z.B. Speicher voll)
    }
  }, [orgName, auditor, auditDate, answers, riskRec, actionPlan]);

  // ---------- Helper ----------

  const controlsByDomain = (domain) => CONTROLS.filter((c) => c.domain === domain);

  const isAnswered = (id) => {
    const a = answers[id];
    return !!a && a.rating !== undefined && a.rating !== null && a.rating !== "";
  };

  const domainProgress = (domain) => {
    const ctrls = controlsByDomain(domain);
    if (ctrls.length === 0) return 0;
    const answered = ctrls.filter((c) => isAnswered(c.id)).length;
    return Math.round((answered / ctrls.length) * 100);
  };

  const overallProgress = () => {
    const answered = CONTROLS.filter((c) => isAnswered(c.id)).length;
    return Math.round((answered / CONTROLS.length) * 100);
  };

  const numericRatings = (ctrls) =>
    ctrls
      .map((c) => answers[c.id]?.rating)
      .filter((r) => r !== undefined && r !== null && r !== "" && r !== "na")
      .map(Number);

  const avgRating = (ctrls) => {
    const nums = numericRatings(ctrls);
    if (nums.length === 0) return null;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  };

  const updateAnswer = (id, field, value) => {
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const updateActionPlan = (id, field, value) => {
    setActionPlan((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  async function generateKI(id, silent) {
    const ctrl = CONTROLS.find((c) => c.id === id);
    const a = answers[id] || {};
    const hasInput = (a.note && a.note.trim()) || (a.ref && a.ref.trim());
    if (!hasInput) {
      if (!silent) {
        setWarnIds((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => setWarnIds((prev) => ({ ...prev, [id]: false })), 4000);
      }
      return;
    }
    setLoadingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const prompt = buildPrompt(ctrl, a);
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler bei der KI-Analyse.");
      const parsed = parseKIResponse(data.text || "");
      setRiskRec((prev) => ({ ...prev, [id]: parsed }));
    } catch (e) {
      setRiskRec((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), beg: "Fehler bei der KI-Analyse: " + e.message },
      }));
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function generateAllKI() {
    const eligible = CONTROLS.filter((c) => {
      const a = answers[c.id] || {};
      return (a.note && a.note.trim()) || (a.ref && a.ref.trim());
    });
    setBulkRunning(true);
    setBulkProgress({ done: 0, total: eligible.length });
    for (const c of eligible) {
      await generateKI(c.id, true);
      setBulkProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setBulkRunning(false);
  }

  function exportJSON() {
    const data = { version: 2, orgName, auditor, auditDate, answers, riskRec, actionPlan };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const fname = `${(orgName || "Audit").replace(/[^a-zA-Z0-9_-]+/g, "_")}_${now.getFullYear()}-${pad2(
      now.getMonth() + 1
    )}-${pad2(now.getDate())}_${pad2(now.getHours())}h${pad2(now.getMinutes())}m.json`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setOrgName(data.orgName || "");
        setAuditor(data.auditor || "");
        setAuditDate(data.auditDate || "");
        setAnswers(data.answers || {});
        setRiskRec(data.riskRec || {});
        setActionPlan(data.actionPlan || {});
        setView("audit");
      } catch (err) {
        alert("Datei konnte nicht gelesen werden: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  async function exportActionPlanDocx() {
    const rows = CONTROLS.filter((c) => {
      const ap = actionPlan[c.id];
      const rating = answers[c.id]?.rating;
      return (ap && ap.prio) || suggestPrio(rating);
    }).map((c) => {
      const ap = actionPlan[c.id] || {};
      const rating = answers[c.id]?.rating;
      const prio = ap.prio || suggestPrio(rating) || 3;
      return {
        prio,
        id: c.id,
        title: c.title,
        domain: c.domain,
        rating: ratingLabelFn(rating),
        owner: ap.owner || "",
        due: ap.due || "",
        note: ap.note || "",
        rec: riskRec[c.id]?.rec || "",
      };
    });
    try {
      const res = await fetch("/api/actionplan-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName, auditor, auditDate, rows }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Export fehlgeschlagen.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(orgName || "Massnahmenplan").replace(/[^a-zA-Z0-9_-]+/g, "_")}_Action_Plan.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Word-Export fehlgeschlagen: " + e.message);
    }
  }

  function exportPDF() {
    const now = new Date();
    const dateStr = `${pad2(now.getDate())}.${pad2(now.getMonth() + 1)}.${now.getFullYear()}`;

    const summaryRows = DOMAINS.map((d) => {
      const ctrls = controlsByDomain(d);
      const avg = avgRating(ctrls);
      return { d, avg, color: DC[d] };
    });

    const barsHtml = summaryRows
      .map((r) => {
        const pct = r.avg ? (r.avg / 5) * 100 : 0;
        return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <div style="width:260px;font-size:11px;">${r.d}</div>
          <div style="flex:1;position:relative;height:16px;background:#f0f0f0;border-radius:3px;">
            <div style="position:absolute;top:0;left:0;height:100%;width:${pct}%;background:${r.color};border-radius:3px;opacity:.85;"></div>
          </div>
          <div style="width:30px;font-weight:700;color:${r.color};">${r.avg ? r.avg.toFixed(1) : "–"}</div>
        </div>`;
      })
      .join("");

    const cardsHtml = CONTROLS.map((c) => {
      const a = answers[c.id] || {};
      const rr = riskRec[c.id] || {};
      const color = ratingColorFn(a.rating);
      const kiColor = ratingColorFn(rr.kiRg);
      return `<div style="border:1px solid #ddd;border-radius:8px;padding:10px 12px;margin-bottom:10px;break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <div style="font-weight:700;font-size:13px;color:#0B3B5C;">${c.id} – ${c.title}</div>
          <div style="font-size:11px;color:#666;">${c.domain}</div>
        </div>
        <div style="font-size:11px;color:#444;margin-bottom:6px;">${c.q}</div>
        <div style="display:flex;gap:16px;margin-bottom:6px;">
          <div style="min-width:90px;"><span style="background:${color};color:#fff;font-weight:700;font-size:11px;border-radius:5px;padding:3px 8px;">${
            a.rating == null || a.rating === "" ? "–" : a.rating === "na" ? "N/A" : a.rating
          }</span></div>
          <div style="flex:1;font-size:11px;background:#E8F0FA;border:1px solid #B0C8E0;border-radius:6px;padding:6px 8px;">${
            a.note || "–"
          }</div>
        </div>
        <div style="display:flex;gap:16px;margin-bottom:6px;">
          <div style="min-width:90px;"><span style="background:${kiColor};color:#fff;font-weight:700;font-size:11px;border-radius:5px;padding:3px 8px;">${
            rr.kiRg == null ? "–" : rr.kiRg
          }</span></div>
          <div style="flex:1;font-size:11px;background:#F5F0FF;border:1px solid #C4A8F0;border-radius:6px;padding:6px 8px;">${
            rr.beg || "–"
          }</div>
        </div>
        <div style="font-size:11px;background:#FDF0F0;border:1px solid #F0B0B0;border-radius:6px;padding:6px 8px;margin-bottom:6px;"><b>Risiko:</b> ${
          rr.risk || "–"
        }</div>
        <div style="font-size:11px;background:#F0FAF5;border:1px solid #9FD9BE;border-radius:6px;padding:6px 8px;"><b>Empfehlung:</b> ${
          rr.rec || "–"
        }</div>
      </div>`;
    }).join("");

    const html = `<html><head><title>ISO 22301 Audit-Bericht</title><style>
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;print-color-adjust:exact;-webkit-print-color-adjust:exact;color:#222;margin:0;padding:24px;}
      @page{size:A4;margin:18mm 15mm}
      @media print{.pb{page-break-before:always}}
      h1{font-size:24px;color:#0B3B5C;margin-bottom:4px;}
      h2{font-size:16px;color:#0B3B5C;margin-top:24px;}
    </style></head><body>
      <h1>ISO 22301 – Business Continuity Management System</h1>
      <div style="font-size:12px;color:#555;margin-bottom:16px;">Auditbericht</div>
      <div style="font-size:12px;margin-bottom:4px;"><b>Organisation:</b> ${orgName || "–"}</div>
      <div style="font-size:12px;margin-bottom:4px;"><b>Auditor/in:</b> ${auditor || "–"}</div>
      <div style="font-size:12px;margin-bottom:4px;"><b>Audit-Datum:</b> ${auditDate || "–"}</div>
      <div style="font-size:11px;color:#888;margin-bottom:16px;">Erstellt am ${dateStr}</div>
      <h2>Reifegrad pro Bereich (Durchschnitt)</h2>
      ${barsHtml}
      <h2 class="pb">Detailauswertung je Anforderung</h2>
      ${cardsHtml}
    </body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Pop-up wurde blockiert. Bitte Pop-ups für diese Seite erlauben.");
      return;
    }
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  // ---------- Geteilte Berechnungen für Sidebar/Dashboard ----------

  const overallPct = overallProgress();

  // ---------- Render-Funktionen je View ----------

  function renderSidebar() {
    return (
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#fff",
          borderRight: "1px solid #e2e2e2",
          height: "100vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          fontFamily: FONT,
          padding: 14,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={sideBtn("#E8660A")}>
            📁 Session laden
          </button>
          <button onClick={exportJSON} style={sideBtn("#3A9E3A")}>
            💾 Session speichern
          </button>
        </div>

        <button
          onClick={() => setView("setup")}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            background: view === "setup" ? "#0B3B5C" : "transparent",
            color: view === "setup" ? "#fff" : "#0B3B5C",
            border: "none",
            borderRadius: 7,
            padding: "8px 10px",
            marginBottom: 12,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          Deckblatt
        </button>

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#999",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          Bereiche
        </div>

        {DOMAINS.map((d) => {
          const pct = domainProgress(d);
          const total = controlsByDomain(d).length;
          const done = controlsByDomain(d).filter((c) => isAnswered(c.id)).length;
          const active = view === "audit" && expandedDomain === d;
          return (
            <button
              key={d}
              onClick={() => {
                setExpandedDomain(d);
                setAuditFilter("all");
                setView("audit");
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: active ? DC_BG[d] : "transparent",
                border: "none",
                borderRadius: 7,
                padding: "8px 10px",
                marginBottom: 4,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: DC[d] }}>{d}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                {pct}% · {done}/{total}
              </div>
            </button>
          );
        })}

        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 700 }}>Gesamt</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0B3B5C" }}>{overallPct}%</div>
          <div style={{ fontSize: 11, color: "#999" }}>
            {CONTROLS.filter((c) => isAnswered(c.id)).length}/{CONTROLS.length}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={generateAllKI} disabled={bulkRunning} style={sideBtn("#E8660A")}>
            {bulkRunning ? `✨ Generiere… ${bulkProgress.done}/${bulkProgress.total}` : "✨ Alle generieren"}
          </button>
          <button onClick={() => setView("dashboard")} style={sideBtn("#0B3B5C")}>
            📊 Dashboard
          </button>
          <button onClick={() => setView("report")} style={sideBtn("#0B3B5C")}>
            📈 Bericht
          </button>
          <button onClick={() => setView("actionplan")} style={sideBtn("#E8660A")}>
            🎯 Action Plan
          </button>
        </div>
      </div>
    );
  }

  function renderSetup() {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: FONT, padding: "48px 40px" }}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0B3B5C", marginBottom: 28 }}>
            ISO 22301 Audit Tool
          </h1>

          <div style={{ border: "1px solid #cfe0f0", borderRadius: 10, padding: 24, marginBottom: 20 }}>
            <div style={{ display: "grid", gap: 16 }}>
              <label style={lbl}>
                Organisation
                <input
                  style={inp}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Firmenname"
                />
              </label>
              <label style={lbl}>
                Auditor/in
                <input style={inp} value={auditor} onChange={(e) => setAuditor(e.target.value)} placeholder="Name" />
              </label>
              <label style={lbl}>
                Auditdatum
                <input style={inp} type="date" value={auditDate} onChange={(e) => setAuditDate(e.target.value)} />
              </label>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "#333", marginBottom: 24, lineHeight: 1.6 }}>
            <b>{CONTROLS.length} BCM-Anforderungen</b> (Kap. 4–10) · Prüfhinweise · Reifegrad 0–5 + N/A · Filter ·
            Dashboard · PDF-Export
          </div>

          <button
            onClick={() => setView("audit")}
            style={{
              display: "block",
              width: "100%",
              background: "#0B3B5C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "13px 0",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            Audit starten
          </button>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              display: "block",
              width: "100%",
              background: "#fff",
              color: "#3A9E3A",
              border: "1px solid #3A9E3A",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            Bestehende Session laden (.json)
          </button>
        </div>
      </div>
    );
  }

  function renderControlCard(c) {
    const a = answers[c.id] || {};
    const rr = riskRec[c.id] || {};
    const loading = !!loadingIds[c.id];
    const warn = !!warnIds[c.id];
    const hOpen = !!hintOpen[c.id];
    const eOpen = !!erlOpen[c.id];
    const color = DC[c.domain];

    return (
      <div key={c.id} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span
            style={{
              background: color,
              color: "#fff",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 14,
              padding: "3px 10px",
              whiteSpace: "nowrap",
            }}
          >
            {c.id}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", fontFamily: FONT }}>{c.title}</span>
        </div>

        <div
          style={{
            borderLeft: `3px solid ${color}`,
            paddingLeft: 12,
            marginBottom: 10,
            fontSize: 13,
            color: "#333",
            fontFamily: FONT,
          }}
        >
          {c.q}
        </div>

        {/* Erläuterung */}
        <div style={{ marginBottom: 4 }}>
          <button
            onClick={() => setErlOpen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
            style={{ background: "none", border: "none", color: "#555", fontSize: 12, fontFamily: FONT, cursor: "pointer", padding: 0, display: "block" }}
          >
            {eOpen ? "▾" : "▸"} Erläuterungen {eOpen ? "ausblenden" : "anzeigen"}
          </button>
          {eOpen && (
            <div
              style={{
                fontSize: 12,
                fontFamily: FONT,
                color: "#444",
                background: "#F7F5FF",
                border: "1px solid #D8D0F0",
                borderRadius: 6,
                padding: "8px 12px",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              {c.erl || "–"}
            </div>
          )}
        </div>

        {/* Was wird gefordert? */}
        <div style={{ marginBottom: 4 }}>
          <button
            onClick={() => setWasOpen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
            style={{ background: "none", border: "none", color: "#0B6E8A", fontSize: 12, fontFamily: FONT, cursor: "pointer", padding: 0, display: "block" }}
          >
            {wasOpen[c.id] ? "▾" : "▸"} Was wird gefordert? {wasOpen[c.id] ? "ausblenden" : "anzeigen"}
          </button>
          {wasOpen[c.id] && (
            <div
              style={{
                fontSize: 12,
                fontFamily: FONT,
                color: "#0B3B5C",
                background: "#EDF5FF",
                border: "1px solid #A8C8E8",
                borderRadius: 6,
                padding: "8px 12px",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              {c.req || "–"}
            </div>
          )}
        </div>

        {/* Prüfhinweise */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setHintOpen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
            style={{ background: "none", border: "none", color: "#888", fontSize: 12, fontFamily: FONT, cursor: "pointer", padding: 0, display: "block" }}
          >
            {hOpen ? "▾" : "▸"} Prüfhinweise {hOpen ? "ausblenden" : "anzeigen"}
          </button>
          {hOpen && (
            <div
              style={{
                fontSize: 12,
                fontFamily: FONT,
                color: "#555",
                fontStyle: "italic",
                background: "#F5F7FA",
                border: "1px solid #D0D8E4",
                borderRadius: 6,
                padding: "8px 12px",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              {c.hint}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#333",
            letterSpacing: 0.5,
            marginBottom: 6,
            fontFamily: FONT,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          Reifegrad
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {[0, 1, 2, 3, 4, 5, "na"].map((v) => (
            <RatingButtonLarge
              key={v}
              value={v}
              selected={a.rating === v}
              onClick={() => updateAnswer(c.id, "rating", v)}
            />
          ))}
        </div>

        <BoxField
          icon="✏️"
          label="ANTWORT"
          placeholder="Beurteilung, Feststellung, Erläuterungen…"
          value={a.note || ""}
          onChange={(v) => updateAnswer(c.id, "note", v)}
        />

        <BoxField
          icon="📎"
          label="NACHWEIS / REFERENZ"
          placeholder="Dokumentenreferenzen, Links zu Nachweisen, Ticketnummern…"
          value={a.ref || ""}
          onChange={(v) => updateAnswer(c.id, "ref", v)}
        />

        {warn && (
          <div
            style={{
              background: "#FDF0F0",
              border: "1px solid #F0B0B0",
              color: "#A32D2D",
              borderRadius: 6,
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: FONT,
              marginBottom: 10,
            }}
          >
            Bitte zuerst eine Antwort oder einen Nachweis erfassen…
          </div>
        )}

        <button onClick={() => generateKI(c.id, false)} disabled={loading} style={btnPrimary("#5B2D8E", true)}>
          {loading ? "Generiere…" : "✨ KI-Analyse generieren"}
        </button>

        {(rr.kiRg != null || rr.beg || rr.risk || rr.rec) && (
          <div style={{ marginTop: 14 }}>
            <FieldPair
              labelA="KI-Reifegrad"
              labelB="KI-Begründung"
              colors={{ bg: "#F5F0FF", border: "#C4A8F0", text: "#5B2D8E" }}
            >
              <div style={{ flexShrink: 0, minWidth: 90 }}>
                <Badge value={rr.kiRg} />
              </div>
              <div style={{ flex: 1, fontSize: 12, fontFamily: FONT, color: "#1a3a5c" }}>{rr.beg || "–"}</div>
            </FieldPair>
            <FullWidthBox
              label="RISIKO"
              value={rr.risk}
              colors={{ bg: "#FDF0F0", border: "#F0B0B0", text: "#A32D2D" }}
            />
            <FullWidthBox
              label="EMPFEHLUNG"
              value={rr.rec}
              colors={{ bg: "#F0FAF5", border: "#9FD9BE", text: "#0F6E56" }}
            />
          </div>
        )}

        <div style={{ borderBottom: "1px solid #eee", marginTop: 24 }} />
      </div>
    );
  }

  function renderAudit() {
    const color = DC[expandedDomain];
    const allCtrls = controlsByDomain(expandedDomain);
    const ctrls = allCtrls.filter((c) => {
      if (auditFilter === "all") return true;
      if (auditFilter === "open") return !isAnswered(c.id);
      return String(answers[c.id]?.rating ?? "") === String(auditFilter);
    });

    return (
      <div style={{ flex: 1, padding: 28, maxWidth: 880, fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: "inline-block" }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{expandedDomain}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Filter:</span>
            <FilterPill active={auditFilter === "all"} onClick={() => setAuditFilter("all")} color={color}>
              Alle
            </FilterPill>
            <FilterPill active={auditFilter === "open"} onClick={() => setAuditFilter("open")} outline>
              Offen
            </FilterPill>
            {[0, 1, 2, 3, 4, 5, "na"].map((v) => (
              <RatingChip key={v} value={v} active={auditFilter === v} onClick={() => setAuditFilter(v)} />
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>{ctrls.length} Controls angezeigt</div>

        {ctrls.map((c) => renderControlCard(c))}
      </div>
    );
  }

  function renderDashboard() {
    const allCtrls = CONTROLS;
    const overallAvg = avgRating(allCtrls);
    const naCount = allCtrls.filter((c) => answers[c.id]?.rating === "na").length;
    const unratedCount = allCtrls.filter((c) => !isAnswered(c.id)).length;
    const unratedColor = "#C8D0DC"; // neutrales Blaugrau – kein Reifegradton

    const distSegments = [
      // Unbeantwortete zuerst (neutral grau)
      { value: allCtrls.length ? unratedCount / allCtrls.length : 0, color: unratedColor },
      // Dann N/A
      { value: allCtrls.length ? allCtrls.filter((c) => answers[c.id]?.rating === "na").length / allCtrls.length : 0, color: ratingColorFn("na") },
      // Dann Reifegrade 0–5
      ...[0, 1, 2, 3, 4, 5].map((v) => {
        const count = allCtrls.filter((c) => answers[c.id]?.rating !== "na" && Number(answers[c.id]?.rating) === v && isAnswered(c.id)).length;
        return { value: allCtrls.length ? count / allCtrls.length : 0, color: ratingColorFn(v) };
      }),
    ];

    let filteredList = allCtrls;
    if (dashGlobalFilter !== "all") {
      filteredList = allCtrls.filter((c) => String(answers[c.id]?.rating ?? "") === String(dashGlobalFilter));
    }
    if (dashDomainFilter.domain && dashDomainFilter.value !== "all") {
      filteredList = controlsByDomain(dashDomainFilter.domain).filter(
        (c) => String(answers[c.id]?.rating ?? "") === String(dashDomainFilter.value)
      );
    } else if (dashDomainFilter.domain) {
      filteredList = controlsByDomain(dashDomainFilter.domain);
    }

    const filterOptions = ["all", 0, 1, 2, 3, 4, 5, "na"];

    return (
      <div style={{ flex: 1, padding: 28, fontFamily: FONT }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B3B5C", marginBottom: 18 }}>Dashboard</h1>

        <div style={{ display: "flex", gap: 28, alignItems: "center", marginBottom: 28, flexWrap: "wrap" }}>
          <Donut segments={distSegments} />
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0B3B5C" }}>
              {overallAvg != null ? overallAvg.toFixed(1) : "–"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Durchschnittlicher Reifegrad (0–5)</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
              {CONTROLS.filter((c) => isAnswered(c.id)).length} / {CONTROLS.length} Anforderungen bewertet ·{" "}
              {unratedCount} offen · {naCount} N/A
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0B3B5C", marginBottom: 10 }}>
          Reifegrad pro Bereich (Durchschnitt)
        </h2>
        <div style={{ marginBottom: 24 }}>
          {DOMAINS.map((d) => (
            <Bar key={d} label={d} value={avgRating(controlsByDomain(d))} color={DC[d]} widthLabel={260} />
          ))}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0B3B5C", marginBottom: 10 }}>Filter</h2>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {filterOptions.map((f) => (
            <button
              key={String(f)}
              onClick={() => {
                setDashGlobalFilter(f);
                setDashDomainFilter({ domain: null, value: "all" });
              }}
              style={{
                border: dashGlobalFilter === f && !dashDomainFilter.domain ? "2px solid #0B3B5C" : "1px solid #ddd",
                background: dashGlobalFilter === f && !dashDomainFilter.domain ? "#E0EAF2" : "#fff",
                borderRadius: 6,
                padding: "5px 10px",
                fontSize: 12,
                fontFamily: FONT,
                fontWeight: 700,
                color: f === "all" ? "#0B3B5C" : ratingColorFn(f),
                cursor: "pointer",
              }}
            >
              {f === "all" ? "Alle" : f === "na" ? "N/A" : f}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() =>
                setDashDomainFilter((prev) =>
                  prev.domain === d ? { domain: null, value: "all" } : { domain: d, value: "all" }
                )
              }
              style={{
                border: dashDomainFilter.domain === d ? `2px solid ${DC[d]}` : "1px solid #ddd",
                background: dashDomainFilter.domain === d ? DC_BG[d] : "#fff",
                color: DC[d],
                borderRadius: 7,
                padding: "5px 10px",
                fontSize: 12,
                fontFamily: FONT,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {dashDomainFilter.domain && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {filterOptions.map((f) => (
              <button
                key={String(f)}
                onClick={() => setDashDomainFilter((prev) => ({ ...prev, value: f }))}
                style={{
                  border: dashDomainFilter.value === f ? "2px solid #0B3B5C" : "1px solid #ddd",
                  background: dashDomainFilter.value === f ? "#E0EAF2" : "#fff",
                  borderRadius: 6,
                  padding: "4px 9px",
                  fontSize: 11,
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: f === "all" ? "#0B3B5C" : ratingColorFn(f),
                  cursor: "pointer",
                }}
              >
                {f === "all" ? "Alle" : f === "na" ? "N/A" : f}
              </button>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0B3B5C", marginBottom: 10 }}>
          Detailliste ({filteredList.length})
        </h2>
        <div>
          {filteredList.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid #eee",
                padding: "8px 0",
              }}
            >
              <Badge value={answers[c.id]?.rating} />
              <div style={{ fontSize: 11, color: "#999", fontFamily: FONT, minWidth: 110 }}>{c.id}</div>
              <div style={{ fontSize: 12, fontFamily: FONT, color: "#333", flex: 1 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: DC[c.domain], fontFamily: FONT, fontWeight: 700 }}>{c.domain}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderReport() {
    return (
      <div style={{ flex: 1, padding: 28, maxWidth: 900, fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B3B5C" }}>Bericht</h1>
          <button onClick={exportPDF} style={btnPrimary("#0B3B5C")}>
            Als PDF exportieren
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
          <b>Organisation:</b> {orgName || "–"}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
          <b>Auditor/in:</b> {auditor || "–"}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
          <b>Audit-Datum:</b> {auditDate || "–"}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0B3B5C", marginBottom: 10 }}>
          Reifegrad pro Bereich (Durchschnitt)
        </h2>
        <div style={{ marginBottom: 24 }}>
          {DOMAINS.map((d) => (
            <Bar key={d} label={d} value={avgRating(controlsByDomain(d))} color={DC[d]} widthLabel={260} />
          ))}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0B3B5C", marginBottom: 10 }}>
          Detailauswertung je Anforderung
        </h2>
        {CONTROLS.map((c) => renderControlCard(c))}
      </div>
    );
  }

  function renderActionPlan() {
    const rows = CONTROLS.map((c) => {
      const a = answers[c.id] || {};
      const ap = actionPlan[c.id] || {};
      const auto = suggestPrio(a.rating);
      const prio = ap.prio || auto;
      return { c, a, ap, prio };
    }).filter((r) => r.prio);

    const grouped = { 1: [], 2: [], 3: [] };
    rows.forEach((r) => grouped[r.prio].push(r));

    return (
      <div style={{ flex: 1, padding: 28, maxWidth: 900, fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B3B5C" }}>Action Plan</h1>
          <button onClick={exportActionPlanDocx} style={btnPrimary("#0B3B5C")}>
            Als Word exportieren
          </button>
        </div>

        {[1, 2, 3].map((prioLevel) => {
          const st = PRIO_STYLE[prioLevel];
          const items = grouped[prioLevel];
          if (items.length === 0) return null;
          return (
            <div key={prioLevel} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: st.text, marginBottom: 8 }}>
                {st.label} ({items.length})
              </div>
              {items.map(({ c, a, ap }) => {
                const rr = riskRec[c.id] || {};
                return (
                <div
                  key={c.id}
                  style={{
                    background: st.bg,
                    border: `1px solid ${st.border}`,
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0B3B5C", fontFamily: FONT }}>
                      {c.id} – {c.title}
                    </div>
                    <Badge value={a.rating} />
                  </div>

                  {/* KI-Empfehlung als primäre Aktion */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56", fontFamily: FONT, marginBottom: 4 }}>
                      ✅ KI-EMPFEHLUNG (Massnahme)
                    </div>
                    <div
                      style={{
                        background: "#F0FAF5",
                        border: "1px solid #9FD9BE",
                        borderRadius: 6,
                        padding: "8px 10px",
                        fontSize: 12,
                        fontFamily: FONT,
                        color: "#1a3a5c",
                        minHeight: 36,
                      }}
                    >
                      {rr.rec || <span style={{ color: "#bbb" }}>Noch keine KI-Analyse vorhanden – im Fragebogen generieren.</span>}
                    </div>
                  </div>

                  {/* Prio / Verantwortlich / Termin */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <select
                      value={ap.prio || ""}
                      onChange={(e) => updateActionPlan(c.id, "prio", e.target.value ? Number(e.target.value) : undefined)}
                      style={{ ...inp, width: 180, marginBottom: 0 }}
                    >
                      <option value="">Prio automatisch ({suggestPrio(a.rating) || "–"})</option>
                      <option value="1">Prio 1 – kritisch</option>
                      <option value="2">Prio 2 – mittel</option>
                      <option value="3">Prio 3 – niedrig</option>
                    </select>
                    <input
                      style={{ ...inp, width: 160, marginBottom: 0 }}
                      placeholder="Verantwortlich"
                      value={ap.owner || ""}
                      onChange={(e) => updateActionPlan(c.id, "owner", e.target.value)}
                    />
                    <input
                      style={{ ...inp, width: 150, marginBottom: 0 }}
                      type="date"
                      value={ap.due || ""}
                      onChange={(e) => updateActionPlan(c.id, "due", e.target.value)}
                    />
                  </div>

                  {/* Manuelle Notiz */}
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#444", fontFamily: FONT, marginBottom: 4 }}>
                      📝 Interne Notiz / Ergänzung
                    </div>
                    <textarea
                      style={{ ...textareaInline, background: "#fff", width: "100%" }}
                      placeholder="Eigene Notiz, Ergänzung zur Massnahme…"
                      value={ap.note || ""}
                      onChange={(e) => updateActionPlan(c.id, "note", e.target.value)}
                    />
                  </div>
                </div>
                );
              })}
            </div>
          );
        })}

        {rows.length === 0 && (
          <div style={{ fontSize: 13, color: "#888" }}>
            Noch keine Anforderungen bewertet. Sobald im Audit Reifegrade vergeben wurden, erscheinen hier
            priorisierte Massnahmenvorschläge.
          </div>
        )}
      </div>
    );
  }

  // ---------- Hauptlayout ----------

  let body = null;
  if (view === "audit") body = renderAudit();
  else if (view === "dashboard") body = renderDashboard();
  else if (view === "report") body = renderReport();
  else if (view === "actionplan") body = renderActionPlan();

  return (
    <div style={{ fontFamily: FONT }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && importJSON(e.target.files[0])}
      />
      {view === "setup" ? (
        renderSetup()
      ) : (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
          {renderSidebar()}
          {body}
        </div>
      )}
    </div>
  );
}

// ---------- Style-Helfer ----------

const lbl = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 700, color: "#0B3B5C", fontFamily: FONT };
const inp = {
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
  fontFamily: FONT,
  width: "100%",
  marginBottom: 0,
};
const textareaInline = {
  flex: 1,
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: "6px 8px",
  fontSize: 12,
  fontFamily: FONT,
  minHeight: 50,
  resize: "vertical",
};

function btnPrimary(color, small) {
  return {
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: small ? "6px 10px" : "9px 16px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
  };
}

function btnSecondary(small) {
  return {
    background: "#fff",
    color: "#0B3B5C",
    border: "1px solid #0B3B5C",
    borderRadius: 7,
    padding: small ? "6px 10px" : "9px 16px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
    width: small ? "auto" : "100%",
    marginBottom: small ? 0 : 8,
  };
}

function navBtn(active) {
  return {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: active ? "#E0EAF2" : "transparent",
    color: "#0B3B5C",
    border: "none",
    borderRadius: 6,
    padding: "8px 10px",
    marginBottom: 2,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
  };
}

function sideBtn(color) {
  return {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "#fff",
    color: color,
    border: `1px solid ${color}`,
    borderRadius: 7,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
  };
}
