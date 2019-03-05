let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update
    }
}

let game = new Phaser.Game(config);

function preload() {
    this.load.image('img/brick.png')
}

function create() {
}

function update() {
}
