const { Engine, Render, World, Bodies } = Matter
const width = 800, height = 800;


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

for (let wall of walls) {
	//wall.render.strokeStyle = 'red'//randomColorString()
	//wall.render.lineWidth = 3
}

let bricks = []

for (let x = 100; x <= width - 100; x += 50) {
	for (let y = 100; y < height - 200; y += 30) {
		bricks.push(Bodies.rectangle(x, y, 40, 20, { isStatic: true }))
	}
}


for (let body of bricks) {
	body.render.strokeStyle = randomColorString()
	body.render.lineWidth = 3
}


let boxA = Bodies.rectangle(400, 200, 80, 80)
let boxB = Bodies.rectangle(450, 50, 80, 80)

let box50 = Bodies.rectangle(500, 130, 50, 50)

///
/// start
///

World.add(engine.world, [...bricks, ...walls])
Engine.run(engine)
Render.run(render)

