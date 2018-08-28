function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
}

var width = 800, height = 600;

var stage = new PIXI.Stage(0x002b7b);
var renderer = PIXI.autoDetectRenderer(height, width);

document.body.appendChild(renderer.view);


requestAnimFrame(animate);

