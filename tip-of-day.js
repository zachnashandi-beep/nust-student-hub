/**
 * tip-of-day.js
 * Shows a rotating study tip in the hero card.
 * - Daily tip: deterministic based on day of year (same tip all day)
 * - Shuffle button: cycles through tips without repeating until all seen
 * - Tip index stored in sessionStorage so shuffle persists within a tab session
 */

const TIPS = window.TIPS = [
  { text: "If you can't solve a problem without looking at your notes, you've seen it — you haven't learned it yet.", tag: "Study method" },
  { text: "Retype code examples yourself instead of copy-pasting. The act of typing forces your brain to process every line.", tag: "Programming" },
  { text: "Do past papers under timed conditions at least once before every test. They show you the pattern, not just the content.", tag: "Exam prep" },
  { text: "30 minutes of focused practice every day beats a 5-hour panic session the night before a test.", tag: "Consistency" },
  { text: "When you get a programming error, read the error message before searching online. It usually tells you exactly what went wrong.", tag: "Debugging" },
  { text: "Feeling lost in week 1–3 is normal. Everyone struggles in math and programming moments. Focus on your own progress.", tag: "Mindset" },
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
  { text: "If you recognize 3 or more of your habits as bad ones — that's fine. Pick one to fix this week. Not all ten.", tag: "Mindset" },
  { text: "Minimum daily effort compounds faster than you think. Even 45 minutes a day will outperform weekend-only study over a semester.", tag: "Consistency" },
];

const SESSION_KEY = "tip_shuffle_index";
const DAY_TIP_KEY = "tip_day_index";

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function getDailyIndex() {
  return getDayOfYear() % TIPS.length;
}

function getShuffleIndex() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored !== null ? parseInt(stored, 10) : getDailyIndex();
}

function setShuffleIndex(i) {
  sessionStorage.setItem(SESSION_KEY, String(i));
}

function renderTip(index) {
  const tip = TIPS[index];
  const textEl = document.getElementById("tipText");
  const metaEl = document.getElementById("tipMeta");
  if (!textEl || !metaEl) return;

  // Fade out
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
  const shuffleBtn = document.getElementById("tipShuffle");
  if (!shuffleBtn) return;

  let currentIndex = getShuffleIndex();
  renderTip(currentIndex);

  shuffleBtn.addEventListener("click", () => {
    // Advance to next tip, wrap around
    currentIndex = (currentIndex + 1) % TIPS.length;
    setShuffleIndex(currentIndex);
    renderTip(currentIndex);

    // Spin animation on button
    shuffleBtn.classList.add("tip-spin");
    setTimeout(() => shuffleBtn.classList.remove("tip-spin"), 400);
  });
});
