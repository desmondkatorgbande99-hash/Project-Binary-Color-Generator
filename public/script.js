// ─────────────────────────────────────────────────────────────
//  BINARY COLOR GENERATOR — Client Script (Node/Express + EJS)
//  All color computation is delegated to the Express API.
// ─────────────────────────────────────────────────────────────

// ── DOM CACHE ────────────────────────────────────────────────
let el;
let colorGenerated = false;

window.addEventListener("DOMContentLoaded", () => {
  el = {
    // Inputs
    redInput: document.getElementById("redInput"),
    greenInput: document.getElementById("greenInput"),
    blueInput: document.getElementById("blueInput"),
    colorNameInput: document.getElementById("colorNameInput"),
    // Outputs
    redDecimal: document.getElementById("redDecimal"),
    greenDecimal: document.getElementById("greenDecimal"),
    blueDecimal: document.getElementById("blueDecimal"),
    colorDisplay: document.getElementById("colorDisplay"),
    colorName: document.getElementById("colorName"),
    hexValue: document.getElementById("hexValue"),
    binary24: document.getElementById("binary24"),
    copyHexBtn: document.getElementById("copyHexBtn"),
    generateBtn: document.getElementById("generateBtn"),
    resetBtn: document.getElementById("resetBtn"),
    apiStatus: document.getElementById("apiStatus"),
  };

  // Exit if we're not on the generator page (elements not found)
  if (!el.redInput) return;

  // ── Live binary input listeners ──────────────────────────
  [el.redInput, el.greenInput, el.blueInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", (e) => {
      e.target.value = sanitizeBinary(e.target.value);
      updateValidationBorders();
      const allFilled = [el.redInput, el.greenInput, el.blueInput].every(
        (f) => f.value.length === 8
      );
      if (allFilled) generateColor(false);
    });
  });

  // Color name input listener
  if (el.colorNameInput) {
    el.colorNameInput.addEventListener("input", () => {
      updateValidationBorders();
      if (el.colorNameInput.value.trim()) {
        generateColorDebounced();
      }
    });
  }

  // ── Generate button ──────────────────────────────────────
  if (el.generateBtn) {
    el.generateBtn.addEventListener("click", () => generateColor(true));
  }

  // ── Copy HEX button ──────────────────────────────────────
  if (el.copyHexBtn) {
    el.copyHexBtn.addEventListener("click", () => {
      if (!colorGenerated) {
        el.copyHexBtn.innerText = "HEX Not Generated!";
        setTimeout(() => (el.copyHexBtn.innerText = "COPY"), 3000);
        return;
      }
      const hexText = el.hexValue.innerText.replace("HEX: ", "");
      navigator.clipboard.writeText(hexText);
      el.copyHexBtn.innerText = "Copied!";
      setTimeout(() => (el.copyHexBtn.innerText = "COPY"), 3000);
    });
  }

  // ── Reset button ─────────────────────────────────────────
  if (el.resetBtn) {
    el.resetBtn.addEventListener("click", resetAll);
  }

  // ── Preset buttons (binary) ───────────────────────────────
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (el.redInput) el.redInput.value = btn.dataset.r;
      if (el.greenInput) el.greenInput.value = btn.dataset.g;
      if (el.blueInput) el.blueInput.value = btn.dataset.b;
      if (el.colorNameInput) el.colorNameInput.value = "";
      updateValidationBorders();
      generateColor(false);
    });
  });

  // ── Preset buttons (color name) ───────────────────────────
  document.querySelectorAll(".preset-name-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (el.colorNameInput) el.colorNameInput.value = btn.dataset.name;
      generateColor(false);
    });
  });
});

// Debounce timer
let generateDebounceTimer = null;
const DEBOUNCE_DELAY = 300;

function generateColorDebounced() {
  if (generateDebounceTimer) clearTimeout(generateDebounceTimer);
  generateDebounceTimer = setTimeout(() => generateColor(false), DEBOUNCE_DELAY);
}

// ── HELPERS (client-side only, for UX) ──────────────────────

function sanitizeBinary(input) {
  return input.replace(/[^01]/g, "").slice(0, 8);
}

function validateBinaryInput(s) {
  return typeof s === "string" && /^[01]{8}$/.test(s);
}

function updateValidationBorders() {
  if (!el.redInput) return;
  [el.redInput, el.greenInput, el.blueInput].forEach((field) => {
    if (!field) return;
    field.style.border = validateBinaryInput(field.value)
      ? "1px solid #00ffcc"
      : "1px solid red";
  });
}

function setApiStatus(msg, type = "") {
  if (!el.apiStatus) return;
  el.apiStatus.textContent = msg;
  el.apiStatus.className = `api-status ${type}`;
  if (!msg) el.apiStatus.className = "api-status";
}

// ── APPLY COLOR DATA (received from API) to the DOM ─────────

function applyColorData(data) {
  const { red, green, blue, hex, colorName, binary24, textColor } = data;

  if (el.redDecimal) el.redDecimal.innerText = red;
  if (el.greenDecimal) el.greenDecimal.innerText = green;
  if (el.blueDecimal) el.blueDecimal.innerText = blue;

  if (el.colorDisplay) {
    el.colorDisplay.style.transition = "background-color 0.4s ease";
    el.colorDisplay.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    el.colorDisplay.style.color = textColor;
    el.colorDisplay.innerText = `RGB(${red}, ${green}, ${blue})`;
  }

  if (colorName && el.colorName) el.colorName.innerText = `Color: ${colorName}`;
  if (el.hexValue) el.hexValue.innerText = `HEX: ${hex}`;
  if (el.binary24) el.binary24.innerText = binary24;

  colorGenerated = true;
}

// ── MAIN GENERATE FUNCTION ───────────────────────────────────

async function generateColor(fromButton = false) {
  if (!el.redInput) return;
  
  const colorNameRaw = el.colorNameInput ? el.colorNameInput.value.trim() : "";

  // ── Branch A: Color name provided → call /api/color-from-name
  if (colorNameRaw) {
    setApiStatus("Resolving color name…", "loading");
    try {
      const res = await fetch("/api/color-from-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: colorNameRaw }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiStatus(`⚠ ${data.error}`, "error");
        if (fromButton) alert(data.error);
        return;
      }

      if (el.redInput) el.redInput.value = data.redBinary;
      if (el.greenInput) el.greenInput.value = data.greenBinary;
      if (el.blueInput) el.blueInput.value = data.blueBinary;
      updateValidationBorders();

      data.colorName = data.name;
      applyColorData(data);
      setApiStatus("");
    } catch (err) {
      setApiStatus("⚠ API unreachable — check that the server is running.", "error");
      console.error(err);
    }
    return;
  }

  // ── Branch B: Binary input → call /api/generate-color
  const rawRed = sanitizeBinary(el.redInput.value);
  const rawGreen = sanitizeBinary(el.greenInput.value);
  const rawBlue = sanitizeBinary(el.blueInput.value);
  const red = rawRed.padStart(8, "0");
  const green = rawGreen.padStart(8, "0");
  const blue = rawBlue.padStart(8, "0");

  if (fromButton && (!rawRed || !rawGreen || !rawBlue)) {
    const message = "Invalid input! Use exactly 8 bits (0s and 1s) per channel, or enter a color name.";
    setApiStatus(`⚠ ${message}`, "error");
    alert(message);
    return;
  }

  if (
    !validateBinaryInput(red) ||
    !validateBinaryInput(green) ||
    !validateBinaryInput(blue)
  ) {
    const message = "Invalid input! Use exactly 8 bits (0s and 1s) per channel.";
    if (fromButton) alert(message);
    setApiStatus(`⚠ ${message}`, "error");
    return;
  }

  setApiStatus("Generating…", "loading");
  try {
    const res = await fetch("/api/generate-color", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ red, green, blue }),
    });
    const data = await res.json();

    if (!res.ok) {
      setApiStatus(`⚠ ${data.error}`, "error");
      if (fromButton) alert(data.error);
      return;
    }

    applyColorData(data);
    setApiStatus("");
  } catch (err) {
    setApiStatus("⚠ API unreachable — check that the server is running.", "error");
    console.error(err);
  }
}

// ── RESET ────────────────────────────────────────────────────

function resetAll() {
  if (!el.redInput) return;
  
  el.redInput.value = "";
  el.greenInput.value = "";
  el.blueInput.value = "";
  if (el.colorNameInput) el.colorNameInput.value = "";

  if (el.redDecimal) el.redDecimal.innerText = "0";
  if (el.greenDecimal) el.greenDecimal.innerText = "0";
  if (el.blueDecimal) el.blueDecimal.innerText = "0";

  if (el.colorDisplay) {
    el.colorDisplay.style.backgroundColor = "#ffffff";
    el.colorDisplay.style.color = "#000000";
    el.colorDisplay.innerText = "NO COLOR YET";
  }
  if (el.colorName) el.colorName.innerText = "COLOR: NONE";
  if (el.hexValue) el.hexValue.innerText = "HEX: #000000";
  if (el.binary24) el.binary24.innerText = "00000000 00000000 00000000";

  [el.redInput, el.greenInput, el.blueInput].forEach((f) => {
    if (f) f.style.border = "";
  });

  setApiStatus("");
  colorGenerated = false;
}