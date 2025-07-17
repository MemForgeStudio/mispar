// Standard letter values
const baseValues = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70,
  'פ': 80, 'צ': 90, 'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
};

// Final forms and their Gadol values
const finalGadol = {
  'ך': 500, 'ם': 600, 'ן': 700, 'ף': 800, 'ץ': 900
};

// Map final forms to base letters
const finalToBase = {
  'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'
};

// Atbash mapping (inversion)
const atbashMap = {
  'א': 'ת', 'ב': 'ש', 'ג': 'ר', 'ד': 'ק', 'ה': 'צ', 'ו': 'פ', 'ז': 'ע',
  'ח': 'ס', 'ט': 'נ', 'י': 'מ', 'כ': 'ל', 'ך': 'ל', 'ל': 'כ', 'מ': 'י',
  'ם': 'י', 'נ': 'ט', 'ן': 'ט', 'ס': 'ח', 'ע': 'ז', 'פ': 'ו', 'ף': 'ו',
  'צ': 'ה', 'ץ': 'ה', 'ק': 'ד', 'ר': 'ג', 'ש': 'ב', 'ת': 'א'
};

// English ordinal values
const englishValues = {};
for (let i = 0; i < 26; i++) {
  englishValues[String.fromCharCode(65 + i)] = i + 1;
}

function normalizeHebrewLetter(ch, method) {
  if (method !== 'gadol' && finalToBase[ch]) {
    return finalToBase[ch];
  }
  return ch;
}

function getGematria(word, method = "standard") {
  const isHebrew = /[\u0590-\u05FF]/.test(word);
  let breakdown = [];
  let total = 0;

  if (method === 'atbash') {
    let transformed = '';
    for (let ch of word) {
      transformed += atbashMap[ch] || ch;
    }
    return getGematria(transformed, 'standard');
  }

  for (let ch of word) {
    let value = 0;

    if (isHebrew) {
      const normalized = normalizeHebrewLetter(ch, method);
      value = (method === 'gadol' && finalGadol[ch])
        ? finalGadol[ch]
        : baseValues[normalized] || 0;
    } else {
      const upper = ch.toUpperCase();
      value = englishValues[upper] || 0;
    }

    breakdown.push({ letter: ch, value });
    total += value;
  }

  if (method === 'ketana') {
    total = String(total).split('').reduce((a, b) => a + Number(b), 0);
  }

  return { breakdown, total };
}

function calculate() {
  const word = document.getElementById("wordInput").value.trim();
  const method = document.getElementById("methodSelect").value;
  const result = getGematria(word, method);

  let output = '';

  for (let part of result.breakdown) {
    output += `${part.letter}: ${part.value}\n`;
  }

  output += `\nTotal Gematria: ${result.total}`;
  document.getElementById("results").innerText = output;
}
