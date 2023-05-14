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
        mtgn.particles.forEach((particle) => {
            particle.x = canvas.width/2 + (particle.x - oldCenter.x)*scaleFactor
            particle.y = canvas.height/2 + (particle.y - oldCenter.y)*scaleFactor
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
    constructor(particles, gravity=100, name=`Metagon ${metagons.length + 1}`) {
        this.particles = particles
        this.gravity = gravity
        this.bufferParticles = particles
        this.calculateCenter()
        this.name = name
        this.id = guidGenerator()
        this.avgDist = 0
        this.particles.forEach((particle) => {
            this.avgDist += Math.sqrt((particle.x - this.center.x)**2 + (particle.y - this.center.y)**2)
        })
        this.avgDist /= this.particles.length
    }

    calculateCenter() {
        this.center = {x:0, y:0}
        this.particles.forEach((particle) => {
            this.center.x += particle.x
            this.center.y += particle.y
        })
        this.center.x /= this.particles.length
        this.center.y /= this.particles.length
    }

    recalcGravity() {
        this.particles.forEach((particle) => {
            particle.gravity = ((particle.x - this.center.x)**2 + (particle.y - this.center.y)**2)/(this.avgDist**2)*this.gravity
        })
    }

    update(metagons) {
        this.bufferParticles = []
        this.particles.forEach((particle) => {
            let pull = {x:0, y:0}
            let totalGravity = 1
            metagons.forEach((mtgn) => {
                if (mtgn != this) {
                    mtgn.particles.forEach((particle2) => {
                        totalGravity += 1
                        let pullChange = normalize({x:particle2.x - particle.x, y:particle2.y - particle.y})
                        pull.x += pullChange.x*particle2.gravity
                        pull.y += pullChange.y*particle2.gravity
                    })
                }
            })
            pull.x /= totalGravity
            pull.y /= totalGravity
            this.bufferParticles.push({x:particle.x + pull.x, y:particle.y + pull.y})
        })
        this.calculateCenter()
    }

    draw() {
        this.bufferParticles.forEach((particle) => {
            ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2)
        })
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, 10, 0, 2*Math.PI)
        ctx.closePath()
        ctx.stroke()
    }

    move(x, y) {
        this.particles.forEach((particle) => {
            particle.x += x
            particle.y += y
        })
    }
}

function generateCircle(x, y, radius) {
    let circleParticles = []
    for (m=x-radius;m<=x+radius;m+=5) {
        for (n=y-radius;n<=y+radius;n+=5) {
            if (((m-x)**2 + (n-y)**2) <= radius**2) {
                circleParticles.push({x:m, y:n})
            }
        }
    }
    return new Polygon(circleParticles, 100)
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
    console.log("hi")
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (mouseActive) {
        metagons[1].move(mouse[0] - metagons[1].center.x, mouse[1] - metagons[1].center.y)
    }
    ctx.fillStyle = "green"
    metagons.forEach((mtgn) => {
        mtgn.recalcGravity()
        mtgn.update(metagons)
        mtgn.draw()
    })
}
animate()