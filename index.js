const { Engine, Render, World, Bodies, Events, Mouse } = Matter
const width = 800, height = 800;
const speed = 10
const perfectProperty = {
	friction: 0,
	frictionAir: 0,
	restitution: 1,
	frictionStatic: 0
}
const staticPerfectProperty = {
	isStatic: true, ...perfectProperty
}

let engine = Engine.create({
	positionIterations: 10,
	velocityIterations: 10
})
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
	Bodies.rectangle(width / 2, 0, width, 50, staticPerfectProperty),
	Bodies.rectangle(0, height / 2, 50, height, staticPerfectProperty),
	Bodies.rectangle(width, height / 2, 50, height, staticPerfectProperty),
	Bodies.rectangle(width / 2, height, width, 50, staticPerfectProperty)
]



let ball = Bodies.circle(width / 2, height - 100, 10, perfectProperty, 1000)
ball.label = 'ball'
Matter.Body.setVelocity(ball, { x: 10, y: 10 })
// keep ball speed (bug in matter js)
Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setVelocity(ball, Matter.Vector.mult(ball.velocity, speed / ball.speed))
})



let bricks = []
for (let x = 100; x <= width - 100; x += 50) {
	for (let y = 100; y < height - 200; y += 30) {
		let brick = Bodies.rectangle(x, y, 45, 20, staticPerfectProperty)
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



let bar = Bodies.rectangle(width / 2, height - 100, 100, 20, staticPerfectProperty)
Events.on(engine, 'beforeUpdate', ev => {
	Matter.Body.setPosition(bar, { x: mouse.position.x, y: bar.position.y })
})

World.add(engine.world, [bar, ball, ...bricks, ...walls])
Engine.run(engine)
Render.run(render)