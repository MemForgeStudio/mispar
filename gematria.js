const hebrewValues = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ך': 500, 'ל': 30, 'מ': 40, 'ם': 600, 'נ': 50, 'ן': 700,
  'ס': 60, 'ע': 70, 'פ': 80, 'ף': 800, 'צ': 90, 'ץ': 900,
  'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
};

const atbashMap = {
  'א': 'ת', 'ב': 'ש', 'ג': 'ר', 'ד': 'ק', 'ה': 'צ', 'ו': 'פ', 'ז': 'ע', 'ח': 'ס', 'ט': 'נ',
  'י': 'מ', 'כ': 'ל', 'ך': 'ל', 'ל': 'כ', 'מ': 'י', 'ם': 'י', 'נ': 'ט', 'ן': 'ט',
  'ס': 'ח', 'ע': 'ז', 'פ': 'ו', 'ף': 'ו', 'צ': 'ה', 'ץ': 'ה', 'ק': 'ד', 'ר': 'ג',
  'ש': 'ב', 'ת': 'א'
};

const englishValues = {};
for (let i = 0; i < 26; i++) {
  englishValues[String.fromCharCode(65 + i)] = i + 1;
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
    const { breakdown: b, total: t } = getGematria(transformed, 'standard');
    return { transformed, breakdown: b, total: t };
  }

  for (let ch of word) {
    if (isHebrew) {
      const val = (method === 'gadol')
        ? hebrewValues[ch] || 0
        : hebrewValues[ch] <= 400 ? hebrewValues[ch] : 0;
      breakdown.push({ letter: ch, value: val });
      total += val;
    } else {
      const upperCh = ch.toUpperCase();
      const val = englishValues[upperCh] || 0;
      breakdown.push({ letter: ch, value: val });
      total += val;
    }
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

  if (method === 'atbash') {
    output += `Atbash Transform: ${result.transformed}\n\n`;
  }

  for (let part of result.breakdown) {
    output += `${part.letter}: ${part.value}\n`;
  }

  output += `\nTotal Gematria: ${result.total}`;
  document.getElementById("results").innerText = output;
}
