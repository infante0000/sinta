const screens = document.querySelectorAll(".screen");

let answers = {
  name: "",
  birthday: "",
  relationship: "",
  partner: "",
  feb15: false,
  feb16: false,
  lunchChoices: []
};

/* SCREEN CONTROL */
function nextScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "access") {
    setTimeout(() => nextScreen("feb15"), 3000);
  }
}

/* BOOT FAKE LOAD */
const bootText = document.getElementById("bootText");
const bootBtn = document.getElementById("bootBtn");

setTimeout(() => {
  bootText.textContent = "Secured session established.";
}, 5000);

setTimeout(() => {
  bootText.textContent = "Tap to continue.";
  bootBtn.classList.remove("hidden");
  bootLoad.classList.add("hidden");
}, 5500);


/* UTILITIES */
function showError(id, msg = "Required") {
  document.getElementById(`err-${id}`).textContent = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

function showBubble(id, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.classList.remove("hidden");
}

function hideBubble(id) {
  document.getElementById(id).classList.add("hidden");
}

function clearBubble() {
  document.getElementById('statusBubble').textContent = '';
  document.getElementById('statusBubble').classList.add("hidden");
}

/* IDENTITY CHECK */
function validateIdentity() {
  clearErrors();

  const name = document.getElementById("name").value.trim();
  const birthday = document.getElementById("birthday").value;
  const relationship = document.getElementById("relationship").value;

  let valid = true;

  if (!name) {
    showError("name");
    valid = false;
  }
  if (!birthday) {
    showError("bday");
    valid = false;
  }
  if (!relationship) {
    showBubble("statusBubble", "Don’t skip this part 😌");
    return;
  }

  if (relationship !== "In a relationship") {
    showBubble(
      "statusBubble",
      "That answer feels… incorrect. Try again 💗"
    );
    return;
  }

  if (!valid) return;

  answers.name = name;
  answers.birthday = birthday;
  answers.relationship = relationship;

  nextScreen("partner");
}

/* PARTNER VERIFICATION */

function verifyPartner() {
  const partner = document.getElementById("partnerName").value.trim().toLowerCase();
  const allowedNames = ['niña', 'nina', 'ninya', 'nins','nin', 'niña infante', 'niña angeline infante', 'niña angeline n. infante'];

  if (!allowedNames.includes(partner)) {
    showBubble("partnerBubble", "Name does not match our records. Please try again 😌");
    return;
  }

  if (!partner) {
    showBubble("partnerBubble", "I swear I know this name 👀");
    return;
  }

  answers.partner = partner;
  nextScreen("access");
}

/* FEB 15 */
function confirmFeb15() {
  answers.feb15 = true;
  document.getElementById("feb15date").classList.add("hidden");
  document.getElementById("feb15Details").classList.remove("hidden");
}

function addFeb15() {
  const url =
    "https://www.google.com/calendar/render?action=TEMPLATE" +
    "&text=Date+Night" +
    "&dates=20260215T090000Z/20260215T130000Z" +
    "&details=Dinner+and+movie+night+at+Condo";

  window.open(url, "_blank");
}

/* FEB 16 */
function confirmFeb16() {
  answers.feb16 = true;
  document.getElementById("feb16date").classList.add("hidden");
  document.getElementById("feb16Details").classList.remove("hidden");
}

/* LUNCH CHOICES */
const lunchOptions = [
  "Comfort Chicken",
  "Italian",
  "European Cafe Bar",
  "Samgyup / Hotpot",
  "Chinese",
  "Steak",
  "Classic Filipino"
];

const lunchContainer = document.getElementById("lunchChoices");

lunchOptions.forEach(opt => {
  const btn = document.createElement("button");
  btn.dataset.value = opt;
  btn.textContent = opt;
  btn.onclick = () => toggleLunch(opt);
  lunchContainer.appendChild(btn);
});

function toggleLunch(option) {
  const index = answers.lunchChoices.indexOf(option);

  if (index === -1) {
    if (answers.lunchChoices.length === 3) {
      answers.lunchChoices.shift();
    }
    answers.lunchChoices.push(option);
  }

  updateLunchUI();
}

function updateLunchUI() {
  [...lunchContainer.children].forEach(btn => {
    const base = btn.dataset.value;
    const idx = answers.lunchChoices.indexOf(base);

    btn.innerHTML = base;

    if (idx !== -1) {
      const badge = document.createElement("div");
      badge.className = "choice-badge";
      badge.textContent = idx + 1;
      btn.appendChild(badge);
    }
  });

  if (answers.lunchChoices.length === 3) {
    document.getElementById("feb16Actions").classList.remove("hidden");
    document.getElementById("feb16Next").classList.remove("hidden");
  }
}


function addFeb16() {
  const url =
    "https://www.google.com/calendar/render?action=TEMPLATE" +
    "&text=Lunch+Baking+Date" +
    "&dates=20260216T060000Z/20260216T100000Z" +
    "&details=Bake+,+Snap+,+&+Sunsets";

  window.open(url, "_blank");
}

/* EMAIL SUMMARY */
function sendSummary() {
  const body = `
My Name: ${answers.name}
My Birthday: ${answers.birthday}
My Partner: ${answers.partner}

Feb 15: Confirmed 
WHEN: Feb. 15 (Sunday), 5PM
WHERE: Shore 2 Tower 2 - Unit 0630
AGENDA: Just Movie and Chill with a lil bit of nomnoms.

Feb 16: Confirmed
WHEN: Feb. 16 (Monday), 11AM
WHERE: SM Megamall
AGENDA: Something sweet.
Something memorable.
And a little sunset moment.

Lunch Preferences:
${answers.lunchChoices.join(", ")}

Message:

`;

  window.location.href =
    "mailto:ninaangeline320@gmail.com" +
    "?subject=Valentine Date My Reply" +
    "&body=" +
    encodeURIComponent(body);
}
