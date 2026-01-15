// Liste des mots : [[noms], [adverbes], [verbes], [noms]], les noms sont dupliqués car ce ne sont pas tout à fait les mêmes
const words = [
  [
    "l’adoration",
    "l’affection",
    "l’ambition",
    "l’appétit",
    "l’ardeur",
    "le charme",
    "le désir",
    "la dévotion",
    "la ferveur",
    "l’attirance",
    "la passion",
    "la tendresse",
    "le cœur",
    "la faim",
    "le manque",
    "l’amour",
    "la luxure",
    "la passion",
    "la sympathie",
    "la soif",
    "le souhait",
  ],
  [
    "anxieusement",
    "ardemment",
    "magnifiquement",
    "ardemment",
    "curieusement",
    "dévouement",
    "avec ferveur",
    "tendrement",
    "impatiemment",
    "intensément",
    "amoureusement",
    "passionnément",
    "séduisamment",
    "tendrement",
    "avec charme",
  ],
  [
    "adore",
    "attire",
    "chérît",
    "s’accroche à",
    "désire",
    "tient à cœur",
    "espère",
    "a faim de",
    "est lié à",
    "aime bien",
    "languit pour",
    "aime",
    "convoite",
    "chérît",
    "tente",
    "a soif de",
    "veut",
    "souhaite",
    "courtise",
    "aspire à",
  ],
  [
    "l’adoration",
    "l’affection",
    "l’ambition",
    "l’appétit",
    "l’ardeur",
    "le charme",
    "le désir",
    "l’attirance",
    "la passion",
    "la tendresse",
    "le cœur",
    "la faim",
    "le manque",
    "l’amour",
    "la luxure",
    "la passion",
    "la sympathie",
    "la soif",
  ],
];

const TITLE = "La roue de l'amour";
const DEFAULT_SPEED = 0.3;

// à chaque fois : pour chaque liste de mots (donc pour chaque roue)
let angle = [0, 0, 0, 0];
let speed = [DEFAULT_SPEED, DEFAULT_SPEED, DEFAULT_SPEED, DEFAULT_SPEED];
let spinning = [true, true, true, true];
const radius = [360, 330, 300, 270]; // Roues de plus en plus petites

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(16);
}

// Une liste de mots est enroulés
function drawWheel(x, y, radius, wordsList, rotationAngle, wheelIndex) {
  // On utilise des push() et des pop() pour ne pas avoir à redéfinir l'état du crayon p5 à chaque itération
  push();
  translate(x, y);
  rotate(rotationAngle);

  // à l'arrêt, on calcule quel mot est le plus proche d'en haut au centre (calcule à partir de la gauche du mot)
  const anglePerWord = TWO_PI / wordsList.length;
  let highlightedIndex = null;
  let minDiff = Infinity;
  if (!spinning[wheelIndex]) {
    for (let i = 0; i < wordsList.length; i++) {
      const wordAngle = i * anglePerWord;
      const globalAngle = (rotationAngle + wordAngle) % TWO_PI;
      const diff = abs(globalAngle + PI / 2);

      if (diff < minDiff) {
        minDiff = diff;
        highlightedIndex = i;
      }
    }
  }

  for (let i = 0; i < wordsList.length; i++) {
    push();
    // on place les mots comme s'ils étaient autour d'un cercle en fonction de leur index, de la taille de la liste et du rayon du cercle
    rotate(i * anglePerWord);
    translate(0, -radius);

    // Les mots sélectionnés des roues stoppées sont affichés différemment
    if (!spinning[wheelIndex] && i === highlightedIndex) {
      fill(0, 40);
      textSize(22);
      text(wordsList[i], 1.5, 1.5);

      fill(120, 60, 60);
      text(wordsList[i], 0, 0);
    } else {
      fill(60);
      textSize(16);
      text(wordsList[i], 0, 0);
    }

    pop();
  }

  pop();
}

function draw() {
  background(245, 242, 238);

  // Affichage du titre au milieu
  textSize(32);
  fill(120, 60, 60);
  text(TITLE, window.innerWidth / 2, window.innerHeight / 2);

  // Affichage des cercles gris sous les roues de mots
  noFill();
  stroke(220);
  strokeWeight(1);
  for (let r of radius) {
    ellipse(width / 2, height / 2, r * 2);
  }

  // Affichage du trait en haut à droite qui indique là où la roue choisit les mots vainqueurs
  stroke(120, 60, 60);
  strokeWeight(2);
  line(
    width / 2 + 50,
    height / 2 - max(radius) - 20,
    width / 2 + 55,
    height / 2 - max(radius) - 50
  );

  noStroke();

  // On fait affiche et fait tourner une roue par liste de mots
  for (let i = 0; i < words.length; i++) {
    if (spinning[i]) {
      angle[i] += speed[i];
    }
    drawWheel(width / 2, height / 2, radius[i], words[i], angle[i], i);
  }
}

// Action de l'utilisateur (soit arrêter une roue, soit relancer les roues)
function action() {
  let ended = true;
  for (let i = 0; i < spinning.length; i++) {
    if (spinning[i]) {
      // On ralentit petit à petit jusqu'à l'arrêt
      const interval = setInterval(() => {
        speed[i] -= 0.02;
        if (speed[i] <= 0) {
          speed[i] = 0;
          spinning[i] = false;
          clearInterval(interval);
        }
      }, 100);
      ended = false;
      break;
    }
  }
  if (ended) {
    speed = [DEFAULT_SPEED, DEFAULT_SPEED, DEFAULT_SPEED, DEFAULT_SPEED];
    spinning = [true, true, true, true];
  }
}

// Déclencher les actions quand on clique ou appuie sur espace
function mousePressed() {
  action();
}

function keyPressed(event) {
  if (event.key === " ") {
    action();
  }
}
