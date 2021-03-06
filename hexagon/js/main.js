// ---------------- //
// Global variables //
// ---------------- //
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create, update: update});
game.cx = game.width / 2;
game.cy = game.height / 2;
var scene;
var colorChangeTime;

// ----- //
// Utils //
// ----- //
Phaser.Graphics.prototype.drawRegularPolygon = function (x, y, n, r, a) {
    this.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    for (i = 1; i <= n; i++) {
        var a2 = i * 2 * Math.PI / n;
        var x2 = x + r * Math.cos(a + a2);
        var y2 = y + r * Math.sin(a + a2);
        this.lineTo(x2, y2);
    }
}

Phaser.Color.updateValue = function(color, valueChange) {
    var rgb = Phaser.Color.getRGB(color);
    var hsv = Phaser.Color.RGBtoHSV(rgb.r, rgb.g, rgb.b);
    hsv.v += valueChange;
    rgb = Phaser.Color.HSVtoRGB(hsv.h, hsv.s, hsv.v);
    console.log(Phaser.Color.toRGBA(rgb.r, rgb.g, rgb.b));
    return rgb.r << 16 | rgb.g << 8 | rgb.b;
}

// ------------ //
// Scene object //
// ------------ //
function Scene (graphics, angle, radius, color) {
    this.graphics = graphics;
    this.angle = angle;
    this.radius = radius;
    this.color = color;
}

Scene.prototype.drawZone = function (angle, color) {
    this.graphics.lineStyle(0, color, 1);
    this.graphics.moveTo(this.radius * Math.cos(angle),
                         this.radius * Math.sin(angle));
    this.graphics.beginFill(color);
    this.graphics.lineTo(12 * this.radius * Math.cos(angle),
                         12 * this.radius * Math.sin(angle));
    this.graphics.lineTo(12 * this.radius * Math.cos(angle + Math.PI / 3),
                         12 * this.radius * Math.sin(angle + Math.PI / 3));
    this.graphics.lineTo(this.radius * Math.cos(angle + Math.PI / 3),
                         this.radius * Math.sin(angle + Math.PI / 3));
    this.graphics.endFill();
}

Scene.prototype.update = function () {
    this.graphics.clear();
    this.graphics.x = game.cx;
    this.graphics.y = game.cy;
    // Zones
    var darkColor = Phaser.Color.updateValue(this.color, -0.7);
    var lightColor = Phaser.Color.updateValue(this.color, -0.6);
    this.drawZone(this.angle, darkColor);
    this.drawZone(this.angle + Math.PI / 3, lightColor);
    this.drawZone(this.angle + 2 * Math.PI / 3, darkColor);
    this.drawZone(this.angle + 3 * Math.PI / 3, lightColor);
    this.drawZone(this.angle + 4 * Math.PI / 3, darkColor);
    this.drawZone(this.angle + 5 * Math.PI / 3, lightColor);
    // Polygon
    this.graphics.lineStyle(5, this.color, 1);
    this.graphics.drawRegularPolygon(0, 0, 6, this.radius, this.angle);
};

// -------------- //
// Main functions //
// -------------- //
function preload() {
}

function create() {
    scene = new Scene(game.add.graphics(), 0, 50, 0xFF00FF);
    colorChangeTime = game.time.time;
}

function update() {
    var colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    var elapsed = game.time.elapsed / 1000; // Temps écoulé en secondes
    var angularSpeed = Math.PI;             // Vitesse angulaire en radian/seconde
    var direction = (game.time.time / 1000) % 10 < 5 ? 1 : -1;
    if ((game.time.time - colorChangeTime) / 1000 > 3) {
        scene.color = colors[Math.floor(Math.random() * colors.length)]
        colorChangeTime = game.time.time;
    }
    scene.angle += direction * elapsed * angularSpeed;
    scene.radius = 5 * Math.random() + 50;
    scene.update();
}
