let cells = [];
const colors = [
  "transparent",
  "#F7E93E",
  "red",
  "orange",
  "blue",
  "brown",
  "purple",
];
const height = 800;
const width = 1000;
const squareSize = 20;
let generation = 0;
let speed = 1;
let lastTime = 0;
let isPlaying = false;
let isDraggingOnCanvas = false;
let hasDragged = false;
let larvaHealth = 3;
let hornetHealth = 20;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent("canvas-container");
  reset();
}

function draw() {
  background("white");

  drawGrid();

  // Passage à la génération suivante si le jeu est en mode lecture, à la vitesse sélectionnée sur l'interface
  if (isPlaying && millis() - lastTime >= 1000 / speed) {
    lastTime = millis();
    nextGeneration();
  }
}

// Réinitialiser le jeu soit (au chargement de la page ou au clic sur "Reset")
function reset() {
  isPlaying = false;
  document.getElementById("pause").disabled = true;
  document.getElementById("play").disabled = false;
  speed = document.getElementById("speed").value;
  hornetHealth = document.getElementById("hornet-health").value;
  larvaHealth = document.getElementById("larva-health").value;
  cells = []; // On vide les cases
  generation = 0;
  document.getElementById("generation").innerText = generation;
  for (let x = 0; x < width; x += squareSize) {
    const row = [];
    for (let y = 0; y < height; y += squareSize) {
      row.push({ specie: 0, direction: 0, health: 0 }); // On remplit toutes les cases par des cellules vides
    }
    cells.push(row);
  }
}

// Affichage de la grille en continu
function drawGrid() {
  let x = 0;
  let y = 0;
  for (let row of cells) {
    for (let cell of row) {
      fill(colors[cell.specie]);
      rect(x, y, squareSize, squareSize);
      y += squareSize;
    }
    y = 0;
    x += squareSize;
  }
}

// On passe en mode "dragging" sauf si on est en dehors de la zone (fonction obligatoire pour éviter les bugs avec les clics hors-zone)
function mousePressed() {
  const col = Math.floor(mouseX / squareSize);
  const row = Math.floor(mouseY / squareSize);

  if (col < 0 || row < 0 || col >= cells.length || row >= cells[0].length) {
    isDraggingOnCanvas = false;
    return;
  }

  isDraggingOnCanvas = true;
  hasDragged = false;
}

function mouseReleased() {
  // Si on a fait un simple clic (on a enfoncé la souris, pas bougé, et relâché)
  if (isDraggingOnCanvas && !hasDragged) {
    const col = Math.floor(mouseX / squareSize);
    const row = Math.floor(mouseY / squareSize);

    if (col >= 0 && row >= 0 && col < cells.length && row < cells[0].length) {
      const selectedSpecie = +document.getElementById("specie-selector").value;

      // Si la case cliquée pas vide, on la vide
      if (cells[col][row].specie !== 0) {
        cells[col][row].specie = 0;
      } else {
        // Sinon on met l'entité sélectionnée
        cells[col][row].specie = selectedSpecie;
        if (isMovable(selectedSpecie)) {
          cells[col][row].direction = Math.floor(Math.random() * 4);
        }
        if (selectedSpecie === 2) {
          cells[col][row].health = hornetHealth;
        }
      }
    }
  }

  isDraggingOnCanvas = false;
  hasDragged = false;
}

// Pour placer plusieurs éléments en déplaçant la souris avec le clic enfoncé
function mouseDragged() {
  if (!isDraggingOnCanvas) {
    return;
  }

  hasDragged = true;

  const selectedSpecie = +document.getElementById("specie-selector").value;
  const col = Math.floor(mouseX / squareSize);
  const row = Math.floor(mouseY / squareSize);

  if (col < 0 || row < 0 || col >= cells.length || row >= cells[0].length) {
    return;
  }

  cells[col][row].specie = selectedSpecie;
  if (isMovable(selectedSpecie)) {
    cells[col][row].direction = Math.floor(Math.random() * 4);
  }
  if (selectedSpecie === 2) {
    cells[col][row].health = hornetHealth;
  }
}

// Calcul de la prochaine génération
function nextGeneration() {
  // On copie toutes les cellules pour éviter que les changements en cours soient pris en compte dans cette génération, et que tout se fasse d'un seul coup
  const cellsCopy = cells.map((col) => col.map((cell) => ({ ...cell })));

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      const cell = cells[i][j];
      const { top, right, bottom, left } = getNeighbors(i, j);

      if (cell.specie === 0) {
        // Traitement des cases vides
        let incomingEntity = null; // Réprésente une entité mouvante (abeille, frelon ou reine) voisine qui a une direction qui correspond à la case courante

        // Si une entité mouvante arrive et n'est en conflit avec aucune autre, alors on devient cette entité
        if (
          cellMovesInDirection(top, 2) &&
          !cellMovesInDirection(right, 3) &&
          !cellMovesInDirection(bottom, 0) &&
          !cellMovesInDirection(left, 1) &&
          !hasHornetNeighbor(i - 1, j)
        ) {
          incomingEntity = top;
        }
        if (
          cellMovesInDirection(right, 3) &&
          !cellMovesInDirection(top, 2) &&
          !cellMovesInDirection(bottom, 0) &&
          !cellMovesInDirection(left, 1) &&
          !hasHornetNeighbor(i, j + 1)
        ) {
          incomingEntity = right;
        }
        if (
          cellMovesInDirection(bottom, 0) &&
          !cellMovesInDirection(top, 2) &&
          !cellMovesInDirection(right, 3) &&
          !cellMovesInDirection(left, 1) &&
          !hasHornetNeighbor(i + 1, j)
        ) {
          incomingEntity = bottom;
        }
        if (
          cellMovesInDirection(left, 1) &&
          !cellMovesInDirection(top, 2) &&
          !cellMovesInDirection(right, 3) &&
          !cellMovesInDirection(bottom, 0) &&
          !hasHornetNeighbor(i, j - 1)
        ) {
          incomingEntity = left;
        }

        if (incomingEntity) {
          if (incomingEntity.specie === 2 && incomingEntity.health === 0) {
            // Si l'entité est un frelon qui n'a plus de vie, alors on laisse la case vide pour qu'il disparaisse
            cellsCopy[i][j].specie = 0;
          } else {
            cellsCopy[i][j].specie = incomingEntity.specie;
            cellsCopy[i][j].direction = incomingEntity.direction;
            if (incomingEntity.specie === 2) {
              // Si on est un frelon, notre vie doit descendre à chaque génération
              cellsCopy[i][j].health = incomingEntity.health - 1;
            }
          }
        } else {
          // Si un voisin est une reine, qu'un autre est une abeille, et qu'aucun ne vient dans cette direction
          if (
            ((top?.specie === 4 || right?.specie === 4) &&
              (top?.specie === 1 || right?.specie === 1) &&
              top?.direction !== 2 &&
              right?.direction !== 3) ||
            ((top?.specie === 4 || bottom?.specie === 4) &&
              (top?.specie === 1 || bottom?.specie === 1) &&
              top?.direction !== 2 &&
              bottom?.direction !== 0) ||
            ((top?.specie === 4 || left?.specie === 4) &&
              (top?.specie === 1 || left?.specie === 1) &&
              top?.direction !== 2 &&
              left?.direction !== 1) ||
            ((right?.specie === 4 || bottom?.specie === 4) &&
              (right?.specie === 1 || bottom?.specie === 1) &&
              right?.direction !== 3 &&
              bottom?.direction !== 0) ||
            ((right?.specie === 4 || left?.specie === 4) &&
              (right?.specie === 1 || left?.specie === 1) &&
              right?.direction !== 3 &&
              left?.direction !== 1) ||
            ((bottom?.specie === 4 || left?.specie === 4) &&
              (bottom?.specie === 1 || left?.specie === 1) &&
              bottom?.direction !== 0 &&
              left?.direction !== 1)
          ) {
            cellsCopy[i][j].specie = 5; // Création de la larve d'abeille
            cellsCopy[i][j].direction = Math.floor(Math.random() * 4);
            cellsCopy[i][j].health = larvaHealth;
          }

          // Si deux voisins sont des frelons et qu'aucun ne vient dans cette direction
          if (
            ((top?.specie === 2 &&
              right?.specie === 2 &&
              top?.direction !== 2 &&
              right?.direction !== 3) ||
              (top?.specie === 2 &&
                bottom?.specie === 2 &&
                top?.direction !== 2 &&
                bottom?.direction !== 0) ||
              (top?.specie === 2 &&
                left?.specie === 2 &&
                top?.direction !== 2 &&
                left?.direction !== 1) ||
              (right?.specie === 2 &&
                bottom?.specie === 2 &&
                right?.direction !== 3 &&
                bottom?.direction !== 0) ||
              (right?.specie === 2 &&
                left?.specie === 2 &&
                right?.direction !== 3 &&
                left?.direction !== 1) ||
              (bottom?.specie === 2 &&
                left?.specie === 2 &&
                bottom?.direction !== 0 &&
                left?.direction !== 1)) &&
            top?.specie !== 6 && // Et si on n'est pas voisin d'une larve de frelon
            right?.specie !== 6 &&
            bottom?.specie !== 6 &&
            left?.specie !== 6
          ) {
            cellsCopy[i][j].specie = 6; // Création d'une larve de frelon
            cellsCopy[i][j].direction = Math.floor(Math.random() * 4);
            cellsCopy[i][j].health = larvaHealth;
          }
        }
      }

      // Règles pour les entités mouvantes (abeilles, frelons et reines)
      if (isMovable(cell.specie)) {
        // On veut savoir si sa case de destination est la même qu'une autre entité sur le plateau
        const conflitDirection0 =
          cell.direction === 0 &&
          (!top ||
            top.specie !== 0 ||
            (i < cells.length - 2 && // On regarde les voisins de la case de destination
              isMovable(cells[i + 2][j].specie) &&
              cells[i + 2][j].direction === 2) ||
            (i < cells.length - 1 &&
              j < cells[i].length - 1 &&
              isMovable(cells[i + 1][j + 1].specie) &&
              cells[i + 1][j + 1].direction === 1) ||
            (i < cells.length - 1 &&
              j > 0 &&
              isMovable(cells[i + 1][j - 1].specie) &&
              cells[i + 1][j - 1].direction === 3));

        const conflitDirection1 =
          cell.direction === 1 &&
          (!right ||
            right.specie !== 0 ||
            (j >= 2 &&
              isMovable(cells[i][j - 2].specie) &&
              cells[i][j - 2].direction === 3) ||
            (i < cells.length - 1 &&
              j > 0 &&
              isMovable(cells[i + 1][j - 1].specie) &&
              cells[i + 1][j - 1].direction === 2) ||
            (i > 0 &&
              j > 0 &&
              isMovable(cells[i - 1][j - 1].specie) &&
              cells[i - 1][j - 1].direction === 0));

        const conflitDirection2 =
          cell.direction === 2 &&
          (!bottom ||
            bottom.specie !== 0 ||
            (i >= 2 &&
              isMovable(cells[i - 2][j].specie) &&
              cells[i - 2][j].direction === 0) ||
            (i > 0 &&
              j < cells[i].length - 1 &&
              isMovable(cells[i - 1][j + 1].specie) &&
              cells[i - 1][j + 1].direction === 1) ||
            (i > 0 &&
              j > 0 &&
              isMovable(cells[i - 1][j - 1].specie) &&
              cells[i - 1][j - 1].direction === 3));

        const conflitDirection3 =
          cell.direction === 3 &&
          (!left ||
            left.specie !== 0 ||
            (j < cells[i].length - 2 &&
              isMovable(cells[i][j + 2].specie) &&
              cells[i][j + 2].direction === 1) ||
            (i < cells.length - 1 &&
              j < cells[i].length - 1 &&
              isMovable(cells[i + 1][j + 1].specie) &&
              cells[i + 1][j + 1].direction === 2) ||
            (i > 0 &&
              j < cells[i].length - 1 &&
              isMovable(cells[i - 1][j + 1].specie) &&
              cells[i - 1][j + 1].direction === 0));

        if (
          (conflitDirection0 ||
            conflitDirection1 ||
            conflitDirection2 ||
            conflitDirection3) &&
          !hasHornetNeighbor(i, j)
        ) {
          cellsCopy[i][j].direction = Math.floor(Math.random() * 4);
          if (cell.specie === 2) {
            // Si on est un frelon et qu'un a plus de vie, on disparaît (on décrémente la vie sinon)
            if (cell.health === 0) {
              cellsCopy[i][j].specie = 0;
            } else {
              cellsCopy[i][j].health -= 1;
            }
          }
        } else if (
          // Si pas de conflit, est un frelon sans vie, ou est à côté d'un frelon
          (!conflitDirection0 &&
            !conflitDirection1 &&
            !conflitDirection2 &&
            !conflitDirection3) ||
          (cell.specie === 1 && hasHornetNeighbor(i, j)) ||
          (cell.specie === 2 && cell.health === 0)
        ) {
          cellsCopy[i][j].specie = 0;
        }
      }

      // Règles pour les larves d'abeille
      if (cell.specie === 5) {
        if (cell.health === 0) {
          cellsCopy[i][j].specie = 1;
        } else {
          cellsCopy[i][j].health -= 1;
        }
      }

      // Règles pour les larves de frelon
      if (cell.specie === 6) {
        if (cell.health === 0) {
          cellsCopy[i][j].specie = 2;
          cellsCopy[i][j].health = hornetHealth;
        } else {
          cellsCopy[i][j].health -= 1;
        }
      }
    }
  }

  cells = cellsCopy; // On remplace les cases du jeu par celles traitées
  generation++;
  document.getElementById("generation").innerText = generation;
}

function hasHornetNeighbor(i, j) {
  // Vérification de la validité des coordonnées données
  if (i < 0 || i >= cells.length || j < 0 || j >= cells[0].length) {
    return false;
  }
  return (
    cells[i][j].specie === 1 && // S'applique seulement aux abeilles, pas utile sinon
    ((i >= 1 && cells[i - 1][j].specie === 2) ||
      (i < cells.length - 1 && cells[i + 1][j].specie === 2) ||
      (j >= 1 && cells[i][j - 1].specie === 2) ||
      (j < cells[i].length - 1 && cells[i][j + 1].specie === 2))
  );
}

// Renvoie tous les voisins de la case précisée
function getNeighbors(i, j) {
  return {
    top: i < cells.length - 1 ? cells[i + 1][j] : null,
    right: j > 0 ? cells[i][j - 1] : null,
    bottom: i > 0 ? cells[i - 1][j] : null,
    left: j < cells[i].length - 1 ? cells[i][j + 1] : null,
  };
}

function isMovable(specie) {
  return specie !== 0 && specie !== 3 && specie !== 5 && specie !== 6;
}

// Savoir une une cellule est mouvante et va dans une direction précise
function cellMovesInDirection(cell, expectedDirection) {
  return cell && isMovable(cell.specie) && cell.direction === expectedDirection;
}

function changeLarvaHealth() {
  larvaHealth = document.getElementById("larva-health").value;
}

function changeHornetHealth() {
  hornetHealth = document.getElementById("hornet-health").value;
}

function play() {
  document.getElementById("play").disabled = true;
  document.getElementById("pause").disabled = false;
  isPlaying = true;
}

function pause() {
  document.getElementById("pause").disabled = true;
  document.getElementById("play").disabled = false;
  isPlaying = false;
}

function changeSpeed() {
  speed = document.getElementById("speed").value;
}
