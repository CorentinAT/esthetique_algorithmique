function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function maybe(array) {
  return Math.random() < 0.5 ? " " + choice(array) : "";
}

const first = ["Cher", "Très cher", "Estimé", "Respecté"];
const second = [
  "sysadmin",
  "développeur",
  "architecte logiciel",
  "data engineer",
];

const adjectives = [
  "asynchrone",
  "distribué",
  "scalable",
  "performant",
  "déterministe",
  "stateless",
  "optimisé",
  "sécurisé",
  "concurrent",
  "robuste",
  "modulable",
  "typé",
  "faiblement typé",
  "hautement disponible",
  "virtualisé",
  "conteneurisé",
];

const nouns = [
  "algorithme",
  "pipeline CI/CD",
  "architecture microservices",
  "base de données",
  "système distribué",
  "API REST",
  "machine virtuelle",
  "conteneur Docker",
  "graphe orienté",
  "thread",
  "processus",
  "index B-tree",
  "réseau neuronal",
  "compilateur",
  "kernel",
  "event loop",
  "garbage collector",
];

const adverbs = [
  "efficacement",
  "asynchroniquement",
  "parallèlement",
  "déterministiquement",
  "atomiquement",
  "concurremment",
  "élégamment",
  "implicitement",
  "explicitement",
  "récursivement",
  "itérativement",
];

const verbs = [
  "optimise",
  "synchronise",
  "orchestre",
  "compile",
  "virtualise",
  "indexe",
  "sécurise",
  "parallélise",
  "cache",
  "profile",
  "monitore",
  "déploie",
  "versionne",
  "scale",
  "load-balance",
  "serialize",
  "désérialise",
];

function longer() {
  return (
    " Mon" +
    maybe(adjectives) +
    " " +
    choice(nouns) +
    maybe(adverbs) +
    " " +
    choice(verbs) +
    " ton" +
    maybe(adjectives) +
    " " +
    choice(nouns) +
    "."
  );
}

function shorter() {
  return " " + choice(adjectives) + " " + choice(nouns) + ".";
}

function body() {
  let text = "";
  let youAre = false;

  for (let i = 0; i < 5; i++) {
    if (Math.random() < 0.5) {
      text += longer();
      youAre = false;
    } else {
      if (youAre) {
        text = text.slice(0, -1) + " : mon" + shorter();
        youAre = false;
      } else {
        text += " Tu es mon" + shorter();
        youAre = true;
      }
    }
  }
  return text;
}

function wrapText(text, maxWidth) {
  const words = text.split(" ");
  let result = "";
  let lineLength = 0;

  for (const word of words) {
    if (lineLength + word.length > maxWidth) {
      result += "\n";
      lineLength = 0;
    }
    result += word + " ";
    lineLength += word.length + 1;
  }
  return result.trim();
}

// Lettre complète
function letter() {
  return (
    choice(first) +
    " " +
    choice(second) +
    "<br/><br/>" +
    wrapText(body(), 80) +
    "<br/><br/>" +
    "Respectueusement " +
    choice(adverbs) +
    "<br/><br/>" +
    "M.U.C.\n"
  );
}

document.getElementById("poeme").innerHTML = letter();
setInterval(() => {
  document.getElementById("poeme").innerHTML = letter();
}, 12000);
