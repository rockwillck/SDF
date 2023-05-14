const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function resize() {
    scaleFactor = Math.sqrt(window.innerWidth**2 + window.innerHeight**2)/Math.sqrt(canvas.width**2 + canvas.height**2)
    oldCenter = {x:canvas.width/2, y:canvas.height/2}
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    metagons.forEach((mtgn) => {
        mtgn.vertices.forEach((vertex) => {
            vertex.x = canvas.width/2 + (vertex.x - oldCenter.x)*scaleFactor
            vertex.y = canvas.height/2 + (vertex.y - oldCenter.y)*scaleFactor
        })
        mtgn.calculateCenter()
    })
}

function goopChange(newGoopiness, mtgnID) {
    for (mtgn of metagons) {
        if (mtgn.id == mtgnID) {
            mtgn.gravity = newGoopiness
            document.getElementById(`goopLabel${mtgn.id}`).innerText = `[${mtgn.name}] Goopiness (${newGoopiness})`
            break
        }
    }
}

function makeMtgnActive(container) {
    console.log(container)
    container.style.backgroundColor = "gray"
}

var mouseActive = true
function sliderActive(boolean) {
    mouseActive = !boolean
}

function normalize(force) {
    return {x:force.x/Math.sqrt(force.x**2 + force.y**2), y:force.y/Math.sqrt(force.x**2 + force.y**2)}
}

function guidGenerator() {
    return Math.random()*100
}

var metagons = []
class Polygon {
    constructor(vertices, gravity=100, name=`Metagon ${metagons.length + 1}`) {
        this.vertices = vertices
        this.gravity = gravity
        this.bufferVertices = vertices
        this.calculateCenter()
        this.name = name
        this.id = guidGenerator()
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

    update(metagons) {
        this.bufferVertices = []
        this.vertices.forEach((vertex) => {
            let pull = {x:0, y:0}
            let totalGravity = 1
            metagons.forEach((mtgn) => {
                if (mtgn != this) {
                    totalGravity += 1
                    let pullChange = normalize({x:mtgn.center.x - vertex.x, y:mtgn.center.y - vertex.y})
                    pull.x += pullChange.x*mtgn.gravity
                    pull.y += pullChange.y*mtgn.gravity
                }
            })
            pull.x /= totalGravity
            pull.y /= totalGravity
            this.bufferVertices.push({x:vertex.x + pull.x, y:vertex.y + pull.y})
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
    for (theta=0;theta<Math.PI*2;theta+=Math.PI/200) {
        circleVertices.push({x:x+Math.cos(theta)*radius, y:y+Math.sin(theta)*radius})
    }
    return new Polygon(circleVertices, 100)
}

var mouse = [0, 0]
window.addEventListener(("mousemove"), (e) => {
    mouse = [e.clientX, e.clientY]
})

for (i=0;i<2;i++) {
    metagons.push(generateCircle(canvas.width/2, canvas.height/2, Math.sqrt(canvas.width**2 + canvas.height**2)*0.05))
}
metagons.forEach((mtgn) => {
    document.getElementById("goopSliderDiv").innerHTML += `
    <button class="metagonAdj" id="${mtgn.id} onclick="makeMtgnActive(this)">
    <label id="goopLabel${mtgn.id}" for="goopiness">[${mtgn.name}] Goopiness (${mtgn.gravity})</label>
    <div class="slidecontainer">
        <input type="range" class="goopinessSlider" name="goopiness" min="1" max="500" value="${mtgn.gravity}" oninput="goopChange(this.value, ${mtgn.id})" onmousedown="sliderActive(true)" onmouseup="sliderActive(false)">
    </div>
    </button>
`
})
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (mouseActive) {
        metagons[1].move(mouse[0] - metagons[1].center.x, mouse[1] - metagons[1].center.y)
    }
    ctx.fillStyle = "green"
    metagons.forEach((mtgn) => {
        mtgn.update(metagons)
        mtgn.draw()
    })
}
animate()