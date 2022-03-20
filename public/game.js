
function setup() {
    createCanvas(window.innerWidth, window.innerHeight)
}

function draw() {
    colorMode(HSB, 1000)
    background("white")
    updateData()
    noStroke()
        
    camera.position.x = self.x
    camera.position.y = self.y
    for(var i = 0; i != players.length; i++) {
        fill("black")
        circle(players[i].x, players[i].y, players[i].size)
        fill("white")
        textAlign(CENTER, CENTER)
        text(players[i].name, players[i].x, players[i].y)
    }
    for(var i = 0; i != bubbles.length; i++) {
        fill(color(bubbles[i].color, 1000, 1000))
        stroke(color(bubbles[i].color, 1000, 600))
        strokeWeight(2)
        circle(bubbles[i].x, bubbles[i].y, 20)
    }
    socket.emit("checkbubbles")
    movement()
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight)
}

