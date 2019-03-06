const { Engine, Render, World, Bodies, Events } = Matter
const width = 800, height = 800;
const speed = 10

let engine = Engine.create()
let render = Render.create({
	element: document.body,
	engine,
	options: {
		wireframes: false,
		width,
		height,
	}
})

///
/// create scene
///

function randomColorString() {
	return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
}

let walls = [
	Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 50, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 50, { isStatic: true })
]


let bricks = []
for (let x = 100; x <= width - 100; x += 50) {
	for (let y = 100; y < height - 200; y += 30) {
		let brick = Bodies.rectangle(x, y, 45, 20, { isStatic: true })
		brick.label = 'brick'
		brick.strokeStyle = randomColorString()
		brick.lineWidth = 3
		bricks.push(brick)
	}
}


let ball = Bodies.circle(width / 2, height - 100, 10, { label: 'ball' })
Matter.Body.setVelocity(ball, { x: 10, y: 10 })
// keep ball speed (bug in matter js)
Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setVelocity(ball, Matter.Vector.mult(ball.velocity, speed / ball.speed))
})


///
/// start
///

for (let o of [...bricks, ...walls, ball]) {
	o.friction = 0
	o.frictionAir = 0
	o.restitution = 1
	o.frictionStatic = 0
}


engine.world.gravity.y = 0
World.add(engine.world, [...bricks, ...walls, ball])
Engine.run(engine)
Render.run(render)


// distroy brick
Events.on(engine, 'collisionEnd', function (event) {
	let pairs = event.pairs;

	// change object colours to show those ending a collision
	for (let pair of pairs) {
		let another
		if (pair.bodyA.label == 'ball') another = pair.bodyB
		else if (pair.bodyB.label == 'ball') another = pair.bodyA
		if (another.label == 'brick') {
			World.remove(engine.world, another)
		}
	}
});