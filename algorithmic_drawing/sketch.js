function setup() {
  createCanvas(640, 400);
}

function draw() {
  background("#FF00FF");
  if (mouseIsPressed === true) {
    fill(0);
  } else {
    fill(255);
  }

  //white circles drawn at mouse position
  circle(mouseX, mouseY, 100);
}
