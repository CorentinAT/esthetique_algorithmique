const xRes = 640;
const yRes = 400;

function setup() {
  createCanvas(xRes, yRes);
}

function draw() {
  background(200);

  //lignes_epaisses();
  figure_3();
}

function lignes_epaisses() {
  let d = 0;
  let n = 0;

  let x = xRes;
  let y = yRes;

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
    x[i] = (data[i][0] * xRes) / 15;
    y[i] = (data[i][1] * yRes) / 15;
  }

  for (let i = 1; i <= 1100; i += 4) {
    line(
      i / 2,
      (i / 10) * Math.sin(i / 20) + i / 20 + yRes / 5,
      50 * Math.sin(xRes / i / 70) + yRes / 2,
      (i / 4) * Math.sin(i / 120) + xRes / 5
    );
  }
}
