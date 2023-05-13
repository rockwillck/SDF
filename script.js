const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 1024

var goopiness = 100
function goopChange(newGoopiness) {
    goopiness = newGoopiness
    document.getElementById("goopLabel").innerText = `Goopiness (${goopiness})`
}

function normalize(force) {
    return {x:force.x/Math.sqrt(force.x**2 + force.y**2), y:force.y/Math.sqrt(force.x**2 + force.y**2)}
}

class Polygon {
    constructor(vertices, gravity=1) {
        this.vertices = vertices
        this.gravity = gravity
        this.bufferVertices = vertices
        this.calculateCenter()
    }

    calculateCenter() {
        this.center = {x:0, y:0}
        this.vertices.forEach((vertex) => {
            this.center.x += vertex.x
            this.center.y += vertex.y
        })
        this.center.x /= this.vertices.length
        this.center.y /= this.vertices.length
    }

    update(objects) {
        this.bufferVertices = []
        this.vertices.forEach((vertex) => {
            let pull = {x:0, y:0}
            let totalGravity = this.gravity
            objects.forEach((obj) => {
                totalGravity += obj.gravity
                let pullChange = normalize({x:obj.center.x - vertex.x, y:obj.center.y - vertex.y})
                pull.x += pullChange.x*obj.gravity
                pull.y += pullChange.y*obj.gravity
            })
            pull.x /= totalGravity
            pull.y /= totalGravity
            this.bufferVertices.push({x:vertex.x + pull.x*goopiness, y:vertex.y + pull.y*goopiness})
        })
        this.calculateCenter()
    }

    draw() {
        ctx.beginPath()
        ctx.moveTo(this.bufferVertices[0].x, this.bufferVertices[0].y)
        this.bufferVertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y)
        })
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, 10, 0, 2*Math.PI)
        ctx.closePath()
        ctx.stroke()
    }

    move(x, y) {
        this.vertices.forEach((vertex) => {
            vertex.x += x
            vertex.y += y
        })
    }
}

function generateCircle(x, y, radius) {
    let circleVertices = []
    for (theta=0;theta<Math.PI*2;theta+=Math.PI/20) {
        circleVertices.push({x:x+Math.cos(theta)*radius, y:y+Math.sin(theta)*radius})
    }
    return new Polygon(circleVertices)
}

var mouse = [0, 0]
window.addEventListener(("mousemove"), (e) => {
    mouse = [e.clientX, e.clientY]
})

var objects = [generateCircle(canvas.width/2, canvas.height/2, 100), generateCircle(canvas.width/2 - 150, canvas.height/2, 100)]
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    objects[1].move(mouse[0] - objects[1].center.x, mouse[1] - objects[1].center.y)
    ctx.fillStyle = "green"
    objects.forEach((obj) => {
        obj.update(objects)
        obj.draw()
    })
}
animate()