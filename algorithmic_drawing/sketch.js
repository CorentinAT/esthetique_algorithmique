let carres_colores = [];
const couleurs = ["red", "green", "blue", "purple", "yellow", "pink", "white"];
let idx_couleur_actuelle = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background("black");

  //lignes_epaisses();
  //figure_3();

  grille_dessin();
}

function lignes_epaisses() {
  let d = 0;
  let n = 0;

  let x = window.innerWidth;
  let y = window.innerHeight;

  while (n < y) {
    d = d + 1;
    strokeWeight(d);
    n = n + d + 1;
    x = x - d - 10;
    y = y - d - 10;
    line(n, n, n, y);
    line(n, y, x, y);
    line(x, y, x, n);
    line(x, n, n, n);
  }
}

function figure_3() {
  let data = [
    [0, 0],
    [0, 2],
    [2, -1],
  ];

  let x = [];
  let y = [];

  for (let i = 0; i <= 2; i++) {
    x[i] = (data[i][0] * window.innerWidth) / 15;
    y[i] = (data[i][1] * window.innerHeight) / 15;
  }

  for (let i = 1; i <= 1100; i += 4) {
    stroke(`rgb(255, ${(i / 1100) * 255}, ${(i / 1100) * 255})`);
    line(
      i / 2,
      (i / 10) * Math.sin(i / 20) + i / 20 + window.innerHeight / 5,
      50 * Math.sin(window.innerWidth / i / 70) + window.innerHeight / 2,
      (i / 4) * Math.sin(i / 120) + window.innerWidth / 5
    );
  }
}

function grille_dessin() {
  // On définit les caractéristiques de la grille de carrés
  const nb_carres_hauteur = 20;
  const longueur_cote_carre = 400 / nb_carres_hauteur;

  // On explore chaque emplacement auquel il y aura un carré
  for (
    let x = 0;
    x + (longueur_cote_carre - 1) < window.innerWidth;
    x += longueur_cote_carre
  ) {
    for (
      let y = 0;
      y + (longueur_cote_carre - 1) < window.innerHeight;
      y += longueur_cote_carre
    ) {
      // Quand la souris passe sur un emplacement de carré, on l'ajoute à la liste des carrés qui doivent être colorés
      if (
        mouseX >= x &&
        mouseX <= x + longueur_cote_carre &&
        mouseY >= y &&
        mouseY <= y + longueur_cote_carre
      ) {
        let carre_deja_colore = null;
        for (let carre_colore of carres_colores) {
          if (carre_colore[0] == x && carre_colore[1] == y) {
            carre_deja_colore = carre_colore;
            break;
          }
        }
        // S'il est déjà coloré, on lui met la couleur actuelle du pointeur (au cas où elle a changé depuis le dernier passage sur cette case)
        if (carre_deja_colore) {
          carre_deja_colore[2] = idx_couleur_actuelle;
        } else {
          carres_colores.push([x, y, idx_couleur_actuelle]);
        }
      }
      noFill(); // Le carré reste transparent s'il n'est pas dans la liste des carrés colorés
      for (let carre_colore of carres_colores) {
        // Sinon on lui applique sa couleur
        if (carre_colore[0] == x && carre_colore[1] == y) {
          fill(couleurs[carre_colore[2]]);
          break;
        }
      }
      rect(x, y, longueur_cote_carre, longueur_cote_carre);
    }
  }
}

function mousePressed() {
  // On fait tourner les couleurs du curseur au clic
  idx_couleur_actuelle = (idx_couleur_actuelle + 1) % couleurs.length;
}
