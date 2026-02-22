/**
 * tip-of-day.js
 * True "tip of the day" — one tip per calendar day, deterministic.
 * No shuffle button. Tip resets at midnight local time automatically.
 * Day index = dayOfYear % tips.length, so each day reliably shows a different tip.
 */

const TIPS = window.TIPS = [
  { text: "If you can't solve a problem without looking at your notes, you've seen it — you haven't learned it yet.", tag: "Study method" },
  { text: "Retype code examples yourself instead of copy-pasting. The act of typing forces your brain to process every line.", tag: "Programming" },
  { text: "Do past papers under timed conditions at least once before every test. They show you the pattern, not just the content.", tag: "Exam prep" },
  { text: "30 minutes of focused practice every day beats a 5-hour panic session the night before a test.", tag: "Consistency" },
  { text: "When you get a programming error, read the error message before searching online. It usually tells you exactly what went wrong.", tag: "Debugging" },
  { text: "Feeling lost in week 1–3 is normal. Everyone struggles at first. Focus on your own progress, not others'.", tag: "Mindset" },
  { text: "After watching a tutorial, pause and do 3–5 practice problems immediately. Otherwise you've just watched someone else learn.", tag: "YouTube" },
  { text: "For MCI: do daily drills, even just 15 minutes. Boolean algebra and logic gates are pattern recognition — volume builds speed.", tag: "MCI" },
  { text: "Start assignments within 48 hours of receiving them. Even just reading the brief and writing the first function.", tag: "Assignments" },
  { text: "Explain a concept out loud or on paper without looking at notes. The gaps you find are exactly what you need to study.", tag: "Active recall" },
  { text: "SQL comes from practice, not reading. Set up MySQL Workbench and run real queries from scratch — don't just modify existing ones.", tag: "DBF" },
  { text: "Don't ignore 'easy' modules. Missing low-effort assignment marks is one of the most avoidable mistakes in first year.", tag: "Strategy" },
  { text: "Debugging is not a sign that you're bad at coding. It's the core skill. Every programmer debugs constantly.", tag: "Programming" },
  { text: "The night before a test: review your summary sheet at 9pm, then sleep on time. Sleep is when your brain consolidates memory.", tag: "Exam prep" },
  { text: "If you fall behind, catch up in layers: understand broadly → practice questions → past exam questions. Not all at once.", tag: "Recovery" },
  { text: "Studying only when you're motivated means you'll study less and less. Build a routine — same time, same place.", tag: "Habits" },
  { text: "For PRG: build mini-projects. A calculator, a guessing game, a menu app. Small builds with real output teach more than exercises alone.", tag: "Programming" },
  { text: "Being busy and being productive are different things. Ask yourself: what did I actually practice or produce in the last hour?", tag: "Focus" },
  { text: "Ask questions in week 2, not week 9. Lecturers help students who show up before they're lost, not after.", tag: "Mindset" },
  { text: "Mixed question sets beat single-topic drills for retention. Your brain needs to practice recognising which method to apply.", tag: "Study method" },
  { text: "For DBF: understand why a query works, not just what it does. If you can explain it in plain English, you actually know it.", tag: "DBF" },
  { text: "Teaching a concept to someone else — even out loud to yourself — reveals exactly what you don't actually understand.", tag: "Active recall" },
  { text: "Use your summary sheet on Day −3 before a test, do only practice questions on Day −2, then timed questions on Day −1.", tag: "Exam prep" },
  { text: "Don't skip hard MCI topics — face them early. Avoidance turns a manageable gap into a test-week crisis.", tag: "MCI" },
  { text: "When limited on time before a test: do practice questions first, read notes second. Questions reveal what you don't know.", tag: "Exam prep" },
  { text: "Write out your working even for questions you think are easy. It helps you catch errors and is often required for marks.", tag: "Exam technique" },
  { text: "Reorganising notes, re-reading slides, and watching videos feel productive but are largely passive. Practice is the subject.", tag: "Study method" },
  { text: "For programming: start with tiny tasks — input/output, then conditions, then loops, then functions. Don't skip levels.", tag: "Programming" },
  { text: "If you recognise 3 or more of your habits as bad ones — that's fine. Pick one to fix this week. Not all ten.", tag: "Mindset" },
  { text: "Minimum daily effort compounds faster than you think. Even 45 minutes a day will outperform weekend-only study over a semester.", tag: "Consistency" },
  { text: "Create a 'mistake log' — every time you get something wrong in practice, write it down. Review it 24 hours before any test.", tag: "Exam prep" },
  { text: "Your campus library has past exam papers. Collecting them early is one of the highest-leverage things you can do in semester 1.", tag: "Strategy" },
  { text: "If you can write a function from memory without referencing anything, you know it. If you need to look it up every time, you don't.", tag: "Programming" },
  { text: "Group study only works if everyone comes prepared. If you're teaching the whole group every session, study alone and teach once.", tag: "Study method" },
  { text: "Email your lecturer when you're stuck — not the night before, but a week before. Most will respond and appreciate the initiative.", tag: "Mindset" },
];

/**
 * Returns how many milliseconds until local midnight.
 * Used to schedule the automatic daily tip refresh.
 */
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

/**
 * Returns today's tip index — same value all day, changes at midnight.
 * Uses full calendar date string (YYYY-MM-DD) as the key so it's
 * guaranteed to rotate at local midnight regardless of tab lifetime.
 */
function getDailyIndex() {
  const today = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  // Simple deterministic hash: sum char codes → mod tips length
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  return hash % TIPS.length;
}

function renderTip(index) {
  const tip = TIPS[index];
  const textEl = document.getElementById("tipText");
  const metaEl = document.getElementById("tipMeta");
  if (!textEl || !metaEl) return;

  textEl.classList.add("tip-fade-out");
  metaEl.classList.add("tip-fade-out");

  setTimeout(() => {
    textEl.textContent = tip.text;
    metaEl.textContent = tip.tag;
    textEl.classList.remove("tip-fade-out");
    metaEl.classList.remove("tip-fade-out");
    textEl.classList.add("tip-fade-in");
    metaEl.classList.add("tip-fade-in");
    setTimeout(() => {
      textEl.classList.remove("tip-fade-in");
      metaEl.classList.remove("tip-fade-in");
    }, 350);
  }, 180);
}

window.addEventListener("DOMContentLoaded", () => {
  const index = getDailyIndex();
  renderTip(index);

  // Schedule auto-refresh at midnight so a long-open tab gets tomorrow's tip
  function scheduleNextDay() {
    const ms = msUntilMidnight();
    setTimeout(() => {
      renderTip(getDailyIndex());
      scheduleNextDay(); // reschedule for the following midnight
    }, ms + 500); // +500ms buffer past midnight
  }
  scheduleNextDay();
});
