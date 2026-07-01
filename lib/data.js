// ISO 22301:2019 (DIN EN ISO 22301:2020-06) — Anforderungskatalog
// Struktur pro Eintrag: { id, domain, title, q, hint }

export const DOMAINS = [
  "4. Kontext der Organisation",
  "5. Führung",
  "6. Planung",
  "7. Unterstützung",
  "8. Betrieb",
  "9. Bewertung der Leistung",
  "10. Verbesserung",
];

// Akzentfarbe je Bereich
export const DC = {
  "4. Kontext der Organisation": "#5B2D8E", // lila
  "5. Führung": "#0B3B5C", // dunkelblau
  "6. Planung": "#00C9A7", // türkis
  "7. Unterstützung": "#8DB33A", // olivgrün
  "8. Betrieb": "#47B8D4", // hellblau
  "9. Bewertung der Leistung": "#E8660A", // orange
  "10. Verbesserung": "#C0392B", // ziegelrot
};

// Helle Hintergrundvariante je Bereich
export const DC_BG = {
  "4. Kontext der Organisation": "#EDE0F5",
  "5. Führung": "#E0EAF2",
  "6. Planung": "#D6F5EE",
  "7. Unterstützung": "#EDF3D6",
  "8. Betrieb": "#D6F0F7",
  "9. Bewertung der Leistung": "#FBE7D6",
  "10. Verbesserung": "#F8DDD9",
};

export const CONTROLS = [
  // 4. Kontext der Organisation
  {
    id: "ISO22301-4.1",
    domain: "4. Kontext der Organisation",
    title: "Externe und interne Themen",
    q: "Hat die Organisation externe und interne Themen bestimmt, die für den Zweck des BCMS relevant sind und sich auf die Erreichung der beabsichtigten Ergebnisse auswirken?",
    hint: "Prüfen Sie: Kontextanalyse, SWOT/PESTEL, Geschäftsstrategie, Protokolle der Leitungsbewertung.",
  },
  {
    id: "ISO22301-4.2.1",
    domain: "4. Kontext der Organisation",
    title: "Interessierte Parteien",
    q: "Wurden die für das BCMS relevanten interessierten Parteien sowie deren relevante Anforderungen identifiziert und dokumentiert?",
    hint: "Prüfen Sie: Stakeholder-Liste, Verträge, Erwartungsmatrix.",
  },
  {
    id: "ISO22301-4.2.2",
    domain: "4. Kontext der Organisation",
    title: "Rechtliche und behördliche Anforderungen",
    q: "Existiert ein Prozess zur Ermittlung, zum Zugriff auf und zur Bewertung geltender rechtlicher, behördlicher und sonstiger Anforderungen, und werden diese dokumentiert, aktuell gehalten und im BCMS berücksichtigt?",
    hint: "Prüfen Sie: Rechtsregister, Compliance-Liste, Nachweis der Aktualisierung.",
  },
  {
    id: "ISO22301-4.3.1",
    domain: "4. Kontext der Organisation",
    title: "Grundlagen für den Anwendungsbereich",
    q: "Wurden bei der Festlegung des Anwendungsbereichs des BCMS die externen/internen Themen (4.1), die Anforderungen interessierter Parteien (4.2) sowie Auftrag, Ziele und Verpflichtungen der Organisation berücksichtigt?",
    hint: "Prüfen Sie: Scope-Dokument mit Begründung der Herleitung.",
  },
  {
    id: "ISO22301-4.3.2",
    domain: "4. Kontext der Organisation",
    title: "Anwendungsbereich des BCMS",
    q: "Sind die einbezogenen Organisationsteile (Standorte, Grösse, Art, Komplexität) und Produkte/Dienstleistungen festgelegt, sind Ausschlüsse dokumentiert und begründet (ohne die Fähigkeit zur Aufrechterhaltung der Betriebsfähigkeit zu beeinträchtigen), und liegt der Anwendungsbereich als dokumentierte Information vor?",
    hint: "Prüfen Sie: Scope-Statement, Ausschlussliste mit Begründung.",
  },
  {
    id: "ISO22301-4.4",
    domain: "4. Kontext der Organisation",
    title: "BCMS als Ganzes",
    q: "Wurde ein BCMS gemäss den Anforderungen der Norm aufgebaut, umgesetzt, aufrechterhalten und wird es fortlaufend verbessert, einschliesslich der benötigten Prozesse und ihrer Wechselwirkungen?",
    hint: "Prüfen Sie: Prozesslandkarte / BCMS-Handbuch.",
  },

  // 5. Führung
  {
    id: "ISO22301-5.1.a",
    domain: "5. Führung",
    title: "Führung und Verpflichtung – Ausrichtung & Integration",
    q: "Stellt die oberste Leitung sicher, dass Politik und Ziele zur Aufrechterhaltung der Betriebsfähigkeit festgelegt sind, mit der strategischen Ausrichtung übereinstimmen und in die Geschäftsprozesse integriert sind?",
    hint: "Prüfen Sie: Strategiepapiere, Sitzungsprotokolle der Geschäftsleitung.",
  },
  {
    id: "ISO22301-5.1.b",
    domain: "5. Führung",
    title: "Führung und Verpflichtung – Ressourcen & Förderung",
    q: "Stellt die oberste Leitung sicher, dass die für das BCMS erforderlichen Ressourcen verfügbar sind, vermittelt sie die Bedeutung des BCM, fördert sie fortlaufende Verbesserung und unterstützt sie andere Führungskräfte in deren Führungsrolle?",
    hint: "Prüfen Sie: Budgetfreigaben, interne Kommunikation, Verantwortlichkeitsmatrix.",
  },
  {
    id: "ISO22301-5.2.1",
    domain: "5. Führung",
    title: "Festlegung der BCM-Politik",
    q: "Ist eine Politik zur Aufrechterhaltung der Betriebsfähigkeit festgelegt, die für den Zweck der Organisation angemessen ist, einen Rahmen für Ziele bietet und Verpflichtungen zur Erfüllung anwendbarer Anforderungen sowie zur fortlaufenden Verbesserung enthält?",
    hint: "Prüfen Sie: BCM-Politikdokument, Freigabevermerk der Geschäftsleitung.",
  },
  {
    id: "ISO22301-5.2.2",
    domain: "5. Führung",
    title: "Bekanntmachung der BCM-Politik",
    q: "Ist die Politik als dokumentierte Information verfügbar, innerhalb der Organisation bekanntgemacht und – soweit angemessen – interessierten Parteien zugänglich?",
    hint: "Prüfen Sie: Intranet, Schulungsunterlagen, Verteilerliste.",
  },
  {
    id: "ISO22301-5.3",
    domain: "5. Führung",
    title: "Rollen, Verantwortlichkeiten, Befugnisse",
    q: "Sind Verantwortlichkeiten und Befugnisse für relevante BCM-Rollen zugewiesen, kommuniziert, und schliesst dies die Sicherstellung der BCMS-Konformität sowie die Berichterstattung an die oberste Leitung ein?",
    hint: "Prüfen Sie: Organigramm, Rollenbeschreibungen, RACI-Matrix.",
  },

  // 6. Planung
  {
    id: "ISO22301-6.1.1",
    domain: "6. Planung",
    title: "Bestimmung von Risiken und Chancen",
    q: "Wurden bei der Planung des BCMS die Themen aus 4.1 und Anforderungen aus 4.2 berücksichtigt, um Risiken und Chancen zu bestimmen, die sicherstellen, dass das BCMS seine Ergebnisse erzielt, unerwünschte Effekte verhindert/verringert und fortlaufende Verbesserung erreicht wird?",
    hint: "Prüfen Sie: Risiko- und Chancenregister auf Managementsystemebene.",
  },
  {
    id: "ISO22301-6.1.2",
    domain: "6. Planung",
    title: "Umgang mit Risiken und Chancen",
    q: "Sind Massnahmen zum Umgang mit den identifizierten Risiken und Chancen geplant, inklusive deren Integration in BCMS-Prozesse und Bewertung ihrer Wirksamkeit?",
    hint: "Prüfen Sie: Massnahmenpläne, Verknüpfung mit 8.1 und 9.1.",
  },
  {
    id: "ISO22301-6.2.1",
    domain: "6. Planung",
    title: "Ziele zur Aufrechterhaltung der Betriebsfähigkeit",
    q: "Sind Ziele zur Aufrechterhaltung der Betriebsfähigkeit für relevante Funktionen/Ebenen festgelegt, stehen sie im Einklang mit der Politik, sind sie messbar, werden sie überwacht, kommuniziert, bei Bedarf aktualisiert und als dokumentierte Information aufbewahrt?",
    hint: "Prüfen Sie: Zielkatalog mit KPIs, Reviewprotokolle.",
  },
  {
    id: "ISO22301-6.2.2",
    domain: "6. Planung",
    title: "Planung zur Zielerreichung",
    q: "Ist für jedes Ziel festgelegt, was getan wird, welche Ressourcen erforderlich sind, wer verantwortlich ist, wann es abgeschlossen wird und wie die Ergebnisse bewertet werden?",
    hint: "Prüfen Sie: Massnahmen-/Projektplan je Ziel.",
  },
  {
    id: "ISO22301-6.3",
    domain: "6. Planung",
    title: "Planung von Änderungen am BCMS",
    q: "Werden Änderungen am BCMS geplant durchgeführt, unter Berücksichtigung von Zweck und Folgen der Änderung, der Integrität des BCMS, der Ressourcenverfügbarkeit sowie der Zuweisung/Neuzuweisung von Verantwortlichkeiten?",
    hint: "Prüfen Sie: Change-Management-Protokolle für das BCMS.",
  },

  // 7. Unterstützung
  {
    id: "ISO22301-7.1",
    domain: "7. Unterstützung",
    title: "Ressourcen",
    q: "Wurden die für Aufbau, Umsetzung, Aufrechterhaltung und fortlaufende Verbesserung des BCMS erforderlichen Ressourcen bestimmt und bereitgestellt?",
    hint: "Prüfen Sie: Budgetplanung, Personalplanung, Investitionsentscheide.",
  },
  {
    id: "ISO22301-7.2",
    domain: "7. Unterstützung",
    title: "Kompetenz",
    q: "Ist die erforderliche Kompetenz für Personen mit BCM-relevanten Tätigkeiten bestimmt, wird deren Kompetenz durch Ausbildung/Schulung/Erfahrung sichergestellt, werden bei Bedarf Massnahmen zum Kompetenzerwerb ergriffen und deren Wirksamkeit bewertet, und wird dies dokumentiert?",
    hint: "Prüfen Sie: Schulungsnachweise, Kompetenzmatrix, Zertifikate.",
  },
  {
    id: "ISO22301-7.3",
    domain: "7. Unterstützung",
    title: "Bewusstsein",
    q: "Sind sich die unter Aufsicht der Organisation tätigen Personen der BCM-Politik, ihres Beitrags zur Wirksamkeit des BCMS, der Folgen einer Nichterfüllung der Anforderungen sowie ihrer eigenen Rolle vor, während und nach Störungen bewusst?",
    hint: "Prüfen Sie: Awareness-Programme, Schulungsteilnahmequoten, Tests.",
  },
  {
    id: "ISO22301-7.4",
    domain: "7. Unterstützung",
    title: "Kommunikation",
    q: "Ist festgelegt, worüber, wann, mit wem, wie und durch wen intern und extern zum BCMS kommuniziert wird?",
    hint: "Prüfen Sie: Kommunikationsplan, Eskalationswege.",
  },
  {
    id: "ISO22301-7.5.1",
    domain: "7. Unterstützung",
    title: "Dokumentierte Information – Allgemeines",
    q: "Enthält das BCMS sowohl die von der Norm geforderte als auch die von der Organisation selbst als notwendig für die Wirksamkeit des BCMS bestimmte dokumentierte Information?",
    hint: "Prüfen Sie: Dokumentenlandkarte / -verzeichnis des BCMS.",
  },
  {
    id: "ISO22301-7.5.2",
    domain: "7. Unterstützung",
    title: "Erstellen und Aktualisieren",
    q: "Werden beim Erstellen und Aktualisieren dokumentierter Information angemessene Kennzeichnung/Beschreibung, Format/Medium sowie Überprüfung und Genehmigung sichergestellt?",
    hint: "Prüfen Sie: Dokumentvorlagen, Versionshistorie, Freigabeworkflows.",
  },
  {
    id: "ISO22301-7.5.3",
    domain: "7. Unterstützung",
    title: "Lenkung dokumentierter Information",
    q: "Wird die für das BCMS erforderliche dokumentierte Information gelenkt, sodass sie verfügbar, geeignet und angemessen geschützt ist (inkl. Verteilung, Zugriff, Ablage, Versionskontrolle, Aufbewahrung), und wird dokumentierte Information externer Herkunft angemessen gekennzeichnet und gelenkt?",
    hint: "Prüfen Sie: Dokumentenmanagementsystem, Zugriffsrechte, Archivierungsregeln.",
  },

  // 8. Betrieb
  {
    id: "ISO22301-8.1",
    domain: "8. Betrieb",
    title: "Betriebliche Planung und Steuerung",
    q: "Werden die Prozesse zur Erfüllung der Anforderungen und zur Durchführung der unter 6.1 bestimmten Massnahmen geplant, umgesetzt und gesteuert (inkl. Kriterien, Steuerung, dokumentierter Information), werden geplante und unbeabsichtigte Änderungen überwacht/bewertet, und werden ausgegliederte Prozesse sowie die Lieferkette gesteuert?",
    hint: "Prüfen Sie: Prozesssteuerungsdokumente, Outsourcing-Verträge mit BC-Klauseln.",
  },
  {
    id: "ISO22301-8.2.1",
    domain: "8. Betrieb",
    title: "BIA und Risikobeurteilung – Allgemeines",
    q: "Sind systematische Prozesse zur Business-Impact-Analyse und Risikobeurteilung umgesetzt, und werden diese in geplanten Abständen sowie bei signifikanten Änderungen überprüft?",
    hint: "Prüfen Sie: BIA-/Risikobeurteilungs-Methodik, Review-Historie.",
  },
  {
    id: "ISO22301-8.2.2.a",
    domain: "8. Betrieb",
    title: "Business-Impact-Analyse – Methodik, MTPD/RTO",
    q: "Werden im Rahmen der BIA die relevanten Einflussarten und -kriterien festgelegt, Tätigkeiten ermittelt, die Produkte/Dienstleistungen unterstützen, sowie die maximal zulässige Störungsdauer (MTPD) und die Wiederherstellungszeitpunkte (RTO) für die Wiederaufnahme mit Mindestkapazität bestimmt?",
    hint: "Prüfen Sie: BIA-Berichte mit MTPD/RTO-Werten je Tätigkeit.",
  },
  {
    id: "ISO22301-8.2.2.b",
    domain: "8. Betrieb",
    title: "Business-Impact-Analyse – Betriebstätigkeiten hoher Priorität & Ressourcen",
    q: "Werden auf Basis der BIA Betriebstätigkeiten hoher Priorität ermittelt, die dafür benötigten Ressourcen bestimmt und die Abhängigkeiten (inkl. Partner und Lieferanten) sowie Wechselbeziehungen dieser Tätigkeiten festgelegt?",
    hint: "Prüfen Sie: Liste der Betriebstätigkeiten hoher Priorität, Ressourcen- und Abhängigkeitsmatrix.",
  },
  {
    id: "ISO22301-8.2.3",
    domain: "8. Betrieb",
    title: "Risikobeurteilung",
    q: "Werden die Risiken einer Störung der Betriebstätigkeiten hoher Priorität und der erforderlichen Ressourcen ermittelt, analysiert, bewertet, und wird bestimmt, welche Risiken eine Behandlung erfordern?",
    hint: "Prüfen Sie: Risikoregister mit Bezug zu Betriebstätigkeiten hoher Priorität, Verweis auf ISO 31000.",
  },
  {
    id: "ISO22301-8.3.1",
    domain: "8. Betrieb",
    title: "Strategien und Lösungen – Allgemeines",
    q: "Wurden Strategien zur Aufrechterhaltung der Betriebsfähigkeit auf Grundlage der BIA- und Risikobeurteilungsergebnisse ermittelt und ausgewählt, die Optionen vor, während und nach einer Störung berücksichtigen und aus einer oder mehreren Lösungen bestehen?",
    hint: "Prüfen Sie: Strategiedokument mit Optionsbewertung.",
  },
  {
    id: "ISO22301-8.3.2",
    domain: "8. Betrieb",
    title: "Identifizierung der Strategien und Lösungen",
    q: "Erfolgt die Identifizierung von Strategien/Lösungen anhand des Umfangs, in dem sie Tätigkeiten hoher Priorität fortführen/wiederherstellen, diese schützen, die Wahrscheinlichkeit und Dauer einer Störung reduzieren, die Auswirkung begrenzen und die Verfügbarkeit von Ressourcen sicherstellen?",
    hint: "Prüfen Sie: Bewertungsmatrix der Lösungsoptionen.",
  },
  {
    id: "ISO22301-8.3.3",
    domain: "8. Betrieb",
    title: "Auswahl der Strategien und Lösungen",
    q: "Erfolgt die Auswahl der Strategien/Lösungen unter Berücksichtigung der Anforderungen, des akzeptablen Risikoumfangs/-art sowie der damit verbundenen Kosten und Nutzen?",
    hint: "Prüfen Sie: Entscheidungsvorlagen, Kosten-Nutzen-Analysen.",
  },
  {
    id: "ISO22301-8.3.4",
    domain: "8. Betrieb",
    title: "Ressourcenbedarf für Lösungen",
    q: "Wurde der Ressourcenbedarf zur Umsetzung der gewählten Lösungen bestimmt (Personen, Informationen/Daten, materielle Infrastruktur, Ausrüstung/Verbrauchsmittel, ICT-Systeme, Transport/Logistik, Finanzen, Partner/Lieferanten)?",
    hint: "Prüfen Sie: Ressourcenplanung je Lösung.",
  },
  {
    id: "ISO22301-8.3.5",
    domain: "8. Betrieb",
    title: "Umsetzung von Lösungen",
    q: "Werden die ausgewählten Lösungen zur Aufrechterhaltung der Betriebsfähigkeit umgesetzt und so aufrechterhalten, dass sie bei Bedarf aktiviert werden können?",
    hint: "Prüfen Sie: Implementierungsnachweise, Aktivierungstests.",
  },
  {
    id: "ISO22301-8.4.1",
    domain: "8. Betrieb",
    title: "Pläne und Verfahren – Allgemeines",
    q: "Ist eine Reaktionsstruktur umgesetzt, die zeitnahe Warnung und Kommunikation ermöglicht, und stehen Pläne/Verfahren zur Steuerung der Organisation während einer Störung bereit, die genau festgelegt, flexibel, auf Auswirkungen fokussiert sowie mit Rollen/Verantwortlichkeiten versehen sind?",
    hint: "Prüfen Sie: Übersicht der BC-Pläne und Reaktionsverfahren.",
  },
  {
    id: "ISO22301-8.4.2.a",
    domain: "8. Betrieb",
    title: "Reaktionsstruktur – Teams",
    q: "Sind eine Struktur und ein oder mehrere Teams für die Reaktion auf Störungen umgesetzt, sind Rollen/Verantwortlichkeiten jedes Teams und die Beziehungen zwischen den Teams klar beschrieben, und ist jedes Team mit kompetentem Personal und Stellvertretern sowie dokumentierten Verfahren ausgestattet?",
    hint: "Prüfen Sie: Teamstruktur, Stellvertreterregelungen, Verfahrensdokumente.",
  },
  {
    id: "ISO22301-8.4.2.b",
    domain: "8. Betrieb",
    title: "Reaktionsstruktur – Fähigkeiten der Teams",
    q: "Sind die Teams zusammen in der Lage, Beschaffenheit/Ausmass einer Störung zu beurteilen, anhand von Schwellenwerten eine formale Reaktion auszulösen, Massnahmen zu planen und zu priorisieren (Menschenleben zuerst), die Auswirkungen zu überwachen, Lösungen zu aktivieren und mit relevanten Parteien, Behörden und Medien zu kommunizieren?",
    hint: "Prüfen Sie: Eskalationsschwellen, Übungsberichte zur Teamreaktion.",
  },
  {
    id: "ISO22301-8.4.3.a",
    domain: "8. Betrieb",
    title: "Warnung und Kommunikation – Verfahren",
    q: "Sind Verfahren dokumentiert und aufrechterhalten für die interne/externe Kommunikation (was, wann, mit wem, wie), für den Empfang und die Beantwortung von Mitteilungen interessierter Parteien, für die Sicherstellung verfügbarer Kommunikationsmittel während einer Störung, für die Kommunikation mit Notfallhelfern, für Medienanfragen sowie für die Aufzeichnung von Störungsdetails, Massnahmen und Entscheidungen?",
    hint: "Prüfen Sie: Kommunikationsverfahren, Medien-/Krisenkommunikationsplan.",
  },
  {
    id: "ISO22301-8.4.3.b",
    domain: "8. Betrieb",
    title: "Warnung und Kommunikation – Ergänzende Massnahmen & Übung",
    q: "Werden, soweit zutreffend, Warnmeldungen an potenziell betroffene interessierte Parteien herausgegeben, wird die Koordination zwischen mehreren reagierenden Organisationen sichergestellt, und werden die Warn- und Kommunikationsverfahren im Rahmen des Übungsprogramms durchgeführt?",
    hint: "Prüfen Sie: Übungsberichte zu Warn-/Kommunikationsverfahren.",
  },
  {
    id: "ISO22301-8.4.4.a",
    domain: "8. Betrieb",
    title: "BC-Pläne – Gesamtinhalt",
    q: "Enthalten die Pläne insgesamt Massnahmen der Teams zur Fortsetzung/Wiederherstellung von Tätigkeiten hoher Priorität und zur Überwachung der Störung, Verweis auf Schwellenwerte/Aktivierungsprozess, Verfahren zur Belieferung mit vereinbarter Kapazität sowie Massnahmen zur Steuerung unmittelbarer Auswirkungen (Wohlergehen von Personen, Vermeidung weiterer Schäden, Umweltschutz)?",
    hint: "Prüfen Sie: BC-Pläne auf Vollständigkeit gemäss 8.4.4.2.",
  },
  {
    id: "ISO22301-8.4.4.b",
    domain: "8. Betrieb",
    title: "BC-Pläne – Einzelplan-Inhalt",
    q: "Enthält jeder einzelne Plan Zweck/Anwendungsbereich/Zielsetzungen, Rollen/Verantwortlichkeiten des umsetzenden Teams, Massnahmen zur Lösungsumsetzung, Aktivierungsinformationen, interne/externe Wechselbeziehungen, Ressourcenanforderungen, Berichterstattungsanforderungen und einen Beendigungsprozess, und ist jeder Plan am benötigten Ort/Zeitpunkt verfügbar?",
    hint: "Prüfen Sie: Stichprobe einzelner BC-Pläne gegen die Checkliste 8.4.4.3.",
  },
  {
    id: "ISO22301-8.4.5",
    domain: "8. Betrieb",
    title: "Wiederherstellung",
    q: "Verfügt die Organisation über dokumentierte Prozesse zur Wiederherstellung und Rückkehr der Geschäftstätigkeiten aus den vorübergehend eingeführten Massnahmen nach und während einer Störung?",
    hint: "Prüfen Sie: Wiederherstellungs-/Rückkehrverfahren.",
  },
  {
    id: "ISO22301-8.5",
    domain: "8. Betrieb",
    title: "Übungsprogramm",
    q: "Wird ein Übungs- und Überprüfungsprogramm umgesetzt, das mit den BCM-Zielen abgestimmte, sorgfältig geplante Szenarien nutzt, Teamwork/Kompetenz/Vertrauen entwickelt, die Gesamtheit der Strategien/Lösungen validiert, formalisierte Berichte erzeugt, im Kontext der fortlaufenden Verbesserung überprüft und in geplanten Abständen/bei signifikanten Änderungen durchgeführt wird, und reagiert die Organisation auf die Ergebnisse mit Änderungen/Verbesserungen?",
    hint: "Prüfen Sie: Übungsplan, Übungsberichte, Massnahmen aus Lessons Learned.",
  },
  {
    id: "ISO22301-8.6",
    domain: "8. Betrieb",
    title: "Bewertung der Dokumentation und Fähigkeiten",
    q: "Werden Eignung, Angemessenheit und Wirksamkeit von BIA, Risikobeurteilung, Strategien, Lösungen, Plänen und Verfahren bewertet (u.a. durch Überprüfungen, Analysen, Übungen, Prüfungen, Berichte nach Zwischenfällen), werden auch die Fähigkeiten relevanter Partner/Lieferanten bewertet, wird Compliance mit rechtlichen/behördlichen Vorgaben und eigener Politik/Zielen geprüft, und werden Dokumentation/Verfahren zeitnah aktualisiert?",
    hint: "Prüfen Sie: Bewertungsberichte, Aktualisierungsnachweise.",
  },

  // 9. Bewertung der Leistung
  {
    id: "ISO22301-9.1",
    domain: "9. Bewertung der Leistung",
    title: "Überwachung, Messung, Analyse und Bewertung",
    q: "Ist bestimmt, was überwacht/gemessen wird, welche Methoden angewendet werden, wann und von wem Überwachung/Messung sowie Analyse/Bewertung erfolgen, wird dies dokumentiert, und wird die Leistung und Wirksamkeit des BCMS bewertet?",
    hint: "Prüfen Sie: KPI-Katalog, Messberichte.",
  },
  {
    id: "ISO22301-9.2.1",
    domain: "9. Bewertung der Leistung",
    title: "Internes Audit – Allgemeines",
    q: "Werden in geplanten Abständen interne Audits durchgeführt, um festzustellen, ob das BCMS die eigenen Anforderungen sowie die Anforderungen dieser Norm erfüllt und wirksam umgesetzt/aufrechterhalten wird?",
    hint: "Prüfen Sie: Auditberichte, Auditzyklus.",
  },
  {
    id: "ISO22301-9.2.2",
    domain: "9. Bewertung der Leistung",
    title: "Auditprogramm(e)",
    q: "Sind ein oder mehrere Auditprogramme geplant/aufgebaut (inkl. Häufigkeit, Methoden, Verantwortlichkeiten, Berichterstattung), sind Auditkriterien/-umfang je Audit festgelegt, wird die Objektivität/Unparteilichkeit der Auditoren sichergestellt, werden Ergebnisse an die zuständige Leitung berichtet, wird dokumentierte Information aufbewahrt, und werden Korrekturmassnahmen samt Verifizierung sichergestellt?",
    hint: "Prüfen Sie: Auditprogramm, Auditorenqualifikation, Nachweis der Massnahmenverfolgung.",
  },
  {
    id: "ISO22301-9.3.1",
    domain: "9. Bewertung der Leistung",
    title: "Managementbewertung – Allgemeines",
    q: "Bewertet die oberste Leitung das BCMS in geplanten Abständen, um dessen fortdauernde Eignung, Angemessenheit und Wirksamkeit sicherzustellen?",
    hint: "Prüfen Sie: Termine/Protokolle der Managementbewertung.",
  },
  {
    id: "ISO22301-9.3.2",
    domain: "9. Bewertung der Leistung",
    title: "Eingaben für die Managementbewertung",
    q: "Behandelt die Managementbewertung u.a. den Status früherer Massnahmen, Veränderungen bei externen/internen Themen, BCMS-Leistungsinformationen (Nichtkonformitäten, Mess-/Auditergebnisse), Rückmeldungen interessierter Parteien, Änderungsbedarf am BCMS, Verbesserungsmöglichkeiten, Informationen aus BIA/Risikobeurteilung, Ergebnisse aus 8.6 sowie Erfahrungen aus Beinaheunfällen/Störungen?",
    hint: "Prüfen Sie: Vollständige Traktandenliste/Unterlagen der Managementbewertung gegen 9.3.2 a)–k).",
  },
  {
    id: "ISO22301-9.3.3",
    domain: "9. Bewertung der Leistung",
    title: "Ergebnisse der Managementbewertung",
    q: "Enthalten die Ergebnisse der Managementbewertung Entscheidungen zu fortlaufender Verbesserung und Änderungsbedarf am BCMS (inkl. BIA/Risikobeurteilung/Strategien/Lösungen/Pläne, Verfahren/Kontrollen, Wirksamkeitsmessung), wird dokumentierte Information aufbewahrt, und werden Ergebnisse den relevanten interessierten Parteien mitgeteilt und entsprechende Massnahmen ergriffen?",
    hint: "Prüfen Sie: Protokoll/Beschlüsse der Managementbewertung, Nachweis der Kommunikation.",
  },

  // 10. Verbesserung
  {
    id: "ISO22301-10.1",
    domain: "10. Verbesserung",
    title: "Nichtkonformität und Korrekturmassnahmen",
    q: "Werden bei Auftreten einer Nichtkonformität angemessene Sofortmassnahmen ergriffen, die Ursache bewertet und beseitigt (inkl. Prüfung vergleichbarer Nichtkonformitäten), die Wirksamkeit der Korrekturmassnahme überprüft, das BCMS bei Bedarf angepasst, und wird dokumentierte Information über Art der Nichtkonformität, getroffene Massnahmen und Ergebnisse aufbewahrt?",
    hint: "Prüfen Sie: Nichtkonformitäten-/CAPA-Register.",
  },
  {
    id: "ISO22301-10.2",
    domain: "10. Verbesserung",
    title: "Fortlaufende Verbesserung",
    q: "Verbessert die Organisation Eignung, Angemessenheit und Wirksamkeit des BCMS fortlaufend auf Grundlage qualitativer und quantitativer Massnahmen, unter Berücksichtigung der Ergebnisse aus Analyse/Bewertung und Managementbewertung?",
    hint: "Prüfen Sie: Verbesserungsregister, Trendanalysen über mehrere Zyklen.",
  },
];
