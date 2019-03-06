const { Engine, Render, World, Bodies, Events, Mouse } = Matter
const width = 800, height = 800;
const speed = 10
const perfectProperty = {
	friction: 0,
	frictionAir: 0,
	restitution: 1,
	frictionStatic: 0
}
let engine = Engine.create()
engine.world.gravity.y = 0

let render = Render.create({
	element: document.body,
	engine,
	options: {
		wireframes: false,
		width,
		height,
	}
})

let mouse = Mouse.create(render.canvas)

///
/// create scene
///

function randomColorString() {
	return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
}



let walls = [
	Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, ...perfectProperty }),
	Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, ...perfectProperty }),
	Bodies.rectangle(width, height / 2, 50, height, { isStatic: true, ...perfectProperty }),
	Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, ...perfectProperty })
]



let ball = Bodies.circle(width / 2, height - 100, 10, { label: 'ball', ...perfectProperty })
Matter.Body.setVelocity(ball, { x: 10, y: 10 })
// keep ball speed (bug in matter js)
Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setVelocity(ball, Matter.Vector.mult(ball.velocity, speed / ball.speed))
})



let bricks = []
for (let x = 100; x <= width - 100; x += 50) {
	for (let y = 100; y < height - 200; y += 30) {
		let brick = Bodies.rectangle(x, y, 45, 20, { isStatic: true, ...perfectProperty })
		brick.label = 'brick'
		brick.render.strokeStyle = randomColorString()
		brick.render.lineWidth = 3
		bricks.push(brick)
	}
}

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



let bar = Bodies.rectangle(width / 2, height - 100, 100, 20, { isStatic: true, ...perfectProperty })
Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setPosition(bar, { x: mouse.position.x, y: bar.position.y })
})

World.add(engine.world, [...bricks, ...walls, ball, bar])
Engine.run(engine)
Render.run(render)