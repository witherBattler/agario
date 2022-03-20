//GAME RENDERING VARIABLES
var players = []
var bubbles = []
var self = {x: 0, y: 0, size: 40}

const socket = io.connect("http://localhost:3000");
var id
socket.on("connect", function() {
    id = socket.id
    console.log(id)
})

async function ajax(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.addEventListener("load", function () {
            try {
                resolve(this.responseText);
            } catch (error) {
                reject(error);
            }
        });
        request.open("GET", url);
        request.send();
        request.addEventListener("error", reject)
    });
}

/** @returns {void} */
async function updateData() {
    //document.getElementById("random-number").innerText = await ajax("/random");
    players = await ajax("/playersonline")
    players = JSON.parse(players)

    bubbles = await ajax("/bubbles")
    bubbles = JSON.parse(bubbles)

    socket.emit("getself")
}

socket.on("selfdata", data => {
    self.size = data.size
})

updateData();

function movement() {
    let deltaX = camera.mouseX - self.x;
    let deltaY = camera.mouseY - self.y;
    let theta = atan(deltaY / deltaX)
    let compX = cos(theta); // between 1 & -1
    let compY = sin(theta); // between 1 & -1
    self.x += compX * (deltaX < 0 ? -1 : 1) * 5 || 0
    self.y += compY * (deltaX < 0 ? -1 : 1) * 5 || 0
    socket.emit("positionchange", {x: self.x, y: self.y})
}