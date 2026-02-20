// modules-data.js – single source of truth for Modules page (Year 1)
// Edit this file to add links, weeks, meta; HTML is generated automatically.
window.MODULES_DATA = {
  y1: [
    {
      id: "mci",
      title: "Mathematics (MCI)",
      tag: "Combinatorics • Boolean",
      meta: "4 weeks • 2 resources • updated Jan 30",
      chips: ["Exam-heavy", "Theory"],
      weeks: [
        { weekId: "mci-week1", label: "Week 1 — Basics (add link)", href: "#" },
        { weekId: "mci-week2", label: "Week 2 — Permutations & Combinations (add link)", href: "#" },
        { weekId: "mci-week3", label: "Week 3 — Binomial Theorem (add link)", href: "#" },
        { weekId: "mci-week4", label: "Week 4 — Boolean Algebra & K-Maps (add link)", href: "#" },
      ],
    },
    {
      id: "prg",
      title: "Programming II (PRG)",
      tag: "Java • OOP",
      meta: "4 weeks • 2 resources • updated Jan 29",
      chips: ["Lab-heavy", "Theory"],
      weeks: [
        { weekId: "prg-week1", label: "Week 1 — OOP recap (add link)", href: "#" },
        { weekId: "prg-week2", label: "Week 2 — Classes & Objects (add link)", href: "#" },
        { weekId: "prg-week3", label: "Week 3 — Arrays / Lists (add link)", href: "#" },
        { weekId: "prg-week4", label: "Week 4 — Methods & Practice (add link)", href: "#" },
      ],
    },
    {
      id: "dbf",
      title: "Database Fundamentals (DBF)",
      tag: "SQL • ERD",
      meta: "3 weeks • 2 resources",
      chips: ["Lab-heavy", "Theory"],
      weeks: [
        { weekId: "dbf-sql", label: "SQL Basics (add link)", href: "#" },
        { weekId: "dbf-norm", label: "Normalization (add link)", href: "#" },
        { weekId: "dbf-erd", label: "ER Diagrams (add link)", href: "#" },
      ],
    },
    {
      id: "dtn",
      title: "Data Networks (DTN)",
      tag: "TCP/IP • Routing",
      meta: "3 weeks • 2 resources • updated Jan 28",
      chips: ["Exam-heavy", "Theory"],
      weeks: [
        { weekId: "dtn-osi", label: "OSI vs TCP/IP (add link)", href: "#" },
        { weekId: "dtn-routing", label: "Routing & IP (add link)", href: "#" },
        { weekId: "dtn-ports", label: "Ports & Sockets (add link)", href: "#" },
      ],
    },
    {
      id: "iss",
      title: "Information Systems Security (ISS)",
      tag: "CIA • Threats",
      meta: "3 weeks • 2 resources",
      chips: ["Theory"],
      weeks: [
        { weekId: "iss-cia", label: "CIA Triad (add link)", href: "#" },
        { weekId: "iss-attacks", label: "Common Attacks (add link)", href: "#" },
        { weekId: "iss-controls", label: "Security Controls (add link)", href: "#" },
      ],
    },
  ],
  y2: [],
  y3: [],
};

// Checklist labels (same for every week)
window.MODULES_CHECKLIST_ITEMS = [
  { cb: "playlist", label: "Watched playlist" },
  { cb: "notes", label: "Read notes" },
  { cb: "exercises", label: "Did exercises" },
  { cb: "pastpaper", label: "Past paper attempted" },
];
