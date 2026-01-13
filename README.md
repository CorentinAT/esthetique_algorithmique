# Esthetique et algorithmique

Corentin ALBERT IMAC1

On peut voir les projets en ouvrant les fichiers `index.html`.

## Dessin algorithmique

Le travail est dans le dossier `algorithmic_drawing`, dans le fichier `sketch.js`.

Il y a les deux dessins faits à partir du livre, que nous avons fait le matin. Ce sont les fonctions `lignes_epaisses()` et `figure_3()`, qu'on peut dé-commenter dans la fonction `draw()`.

La figure 3 est colorée.

Mon propre algorithme est dans la fonction `grille_dessin()`. C'est une grille de carrés dans laquelle le passage de la souris colore les cases. Un clic sur la souris change la couleur de remplissage (défini dans la fonction `mousePressed()`).

## Automate cellulaire

Le travail est dans le dossier `cellular_automata`.

### Explications du jeu

C'est un jeu dans lequel on est dans un écosystème d'abeilles, on y retrouve plusieurs entités de base :

- Les abeilles
- Les reines
- Les frelons
- Les ruches

On peut placer ces entités comme on le veut sur la zone de jeu, à la manière du jeu de la vie, pour ensuite voir comment elles vont évoluer dans l'environnement, en fonction de ce qu'elles croisent sur leur route.

Pour les placer : clic sur une case ou clic maintenu et on déplace la souris sur plusieurs cases.

À la différence du jeu de la vie, les cases ont donc plusieurs états (ceux au dessus + 2 types de larve). Elles ont également deux autres attributs : une direction et une durée de vie.

Voici les règles du système, appliquées à chaque génération :

- Cases vides :

  - Si une entité mouvante (abeille, frelon ou reine) voisine a une direction qui correspond à la case courante, alors la case vide se transforme en cette entité, prend sa direction et sa durée de vie. Sauf si c'est le cas de plusieurs entités simultanément ou que l'entité est voisine d'une case sensée la tuer, auxquels cas la case reste vide
  - Si elle a pour voisins une abeille et une reine, et qu'aucun d'entre eux ne va dans sa direction, alors elle devient une larve d'abeille et prend la durée de vie correspondant aux larves
  - Si elle a pour voisins deux frelons, et qu'aucun d'entre eux ne va dans sa direction, alors elle devient une larve de frelon et prend la durée de vie correspondant aux larves, sauf si elle a aussi pour voisin une autre larve de frelon

- Abeilles :

  - Se transforme en case vide si la case voisine correspondant à sa direction est vide, et qu'il n'y a pas une autre entité qui va y aller (en se basant sur la position des entités voisines à la case vide en question)
  - S'il y a quelqu'un sur la case voisine correspondant à sa direction, ou qu'il y a un conflit avec une autre entité (ce que j'ai expliqué au point précédent), alors la case reste une abeille et sa direction change aléatoirement. C'est aussi la cas si la case visée par la direction n'existe pas (l'abeille est au bord de la zone)
  - Si elle est voisine d'un frelon, elle meurt (devient une case vide)
  - Si un voisin est une ruche, alors elle se transforme en ruche

- Frelons :

  - Mêmes premiers et deuxièmes points que les abeilles pour le déplacement
  - Si sa durée de vie est à 0, il meurt
  - Si sa durée de vie n'est pas à 0, elle est décrémentée
  - S'il est voisin d'une ruche, il meurt

- Reines :

  - Mêmes premiers et deuxièmes points que les abeilles pour le déplacement

- Larves :

  - Si sa durée de vie est à 0, elle devient l'entité correspondante (abeille ou frelon) avec une direction aléatoire. Si elle devient un frelon, elle prend la durée de vie de base d'un frelon
  - Si sa durée de vie n'est pas à 0, elle est décrémentée

- Ruches :
  - Si un voisin est un frelon, alors elle devient une case vide

Pour résumer :

- Les abeilles, les frelons et les reines se déplacent et changent de direction face aux obstacles
- Les frelons tuent les abeilles qu'il touchent
- Le rapprochement entre deux frelons créé une larve de frelon, qui deviendra un frelon plus tard
- Le rapprochement entre une abeille et une reine créé une larve d'abeille, qui deviendra une abeille plus tard
- Les frelons ont une durée de vie
- Les ruches sont statiques et indestructibles
- Les reines sont immortelles
- Les abeilles se sacrifient pour construire la ruche
- Les frelons détruisent la ruche, mais en meurent

### Blabla technique et supplémentaire

J'ai complété la page HTML pour voir les explications du jeu, avoir la légende des couleurs à l'écran, et pouvoir paramétrer le jeu. Les modifications sont appliquées en direct même si le jeu tourne.

Le jeu se base sur mon projet du jour précédent (Dessin algorithmique).

Certaines logiques sont mises dans des fonctions (en bas du fichier `sketch.js`) pour éviter la duplication de code, mais cela pourrait être amélioré : il y a encore des conditions à rallonge qui se répètent et qui pourraient être mises en commun.

Ça a été plus compliqué et long de prévu de gérer autant d'entité et de règles, mais le résultat correspond bien à mes idées de base.

C'est en testant le jeu à la fin que je me suis rendu compte d'un problème : les frelons sont trop forts. S'ils commencent à se reproduire alors l'invasion est inévitable bien que leur reproduction soit plus régulée par rapport aux abeilles (une larve de frelon ne peut pas apparaître à côté d'une autre), qu'ils soient les seuls avec une durée de vie qui finit par les tuer, et que le contact avec la ruche les tue.

Si je venais à améliorer le jeu, c'est sur cet équilibre que je me concentrerais. Mais je n'ai pas d'idée pour l'instant.

Bonus : Vous pouvez changer `height` et `width` dans le javascript pour changer la taille du plateau.

N'hésitez pas à tester le jeu dans pleins de configuration ! (que des abeilles, peu de frelons, beaucoup de reines...) Et en changeant les paramètres sur l'interface web.

Il y a un peu d'aléatoire dans le jeu (déplacement des entités). Ce n'est qu'une petite partie du programme, mais ça pourrait être bien de trouver un moyen d'enlever cette part d'aléatoire tout en gardant le jeu intéressant pour pouvoir étudier des patternes.

### Crédits

Inspiration : Jeu de la vie

Aide dans la recherche de bugs dans les tas de conditions : Copilot
