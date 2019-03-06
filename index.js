let { Engine, Render, World, Bodies } = Matter

let engine = Engine.create()
let render = Render.create({
    element: document.body,
    engine
})

///
/// create scene
///


let boxA = Bodies.rectangle(400, 200, 80, 80)
let boxB = Bodies.rectangle(450, 50, 80, 80)
let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

///
/// start
///

World.add(engine.world, [boxA, boxB, ground])
Engine.run(engine)
Render.run(render)