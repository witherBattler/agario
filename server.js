const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
console.log(Server)
const io = new Server(server);
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.get('/playersonline', (req, res) => {
    res.send(Object.values(players));
});
app.get('/bubbles', (req, res) => {
    res.send(bubbles)
})
server.listen(3000, () => {
    console.log('listening on http://localhost:3000/');
});


function random() {
    switch(arguments.length) {
        case 2:
            return Math.floor(Math.random() * (arguments[1] - arguments[0] + 1) + arguments[0])
        case 0:
            return Math.random()
        default: 
            throw new Error("Bad parameters for random")
    }
}
function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}
function circleTouchesCircle(x1, y1, d1, x2, y2, d2) {
    var distance = getDistance(x1, y1, x2, y2)
    if(distance < d1 / 2 + d2 / 2) {
        return true
    }
    return false
}

//Game code
var players = {}

var bubbles = []
for(var i = 0; i != 1000; i++) {
    bubbles.push({
        color: random(0, 1000),
        x: random(-2000, 2000),
        y: random(-2000, 2000)
    })
}

io.on("connection", socket => {
    players[socket.id] = {
        x: 0,
        y: 0,
        size: 40,
        name: "Unnamed Blob",
        id: socket.id,
    }
    socket.on("movement", data => {
        switch(data) {
            case "left":
                players[socket.id].x -= 5;
                break;
            case "right":
                players[socket.id].x += 5;
                break;
            case "up":
                players[socket.id].y -= 5;
                break;
            case "down":
                players[socket.id].y += 5;
                break;
        }   
    })
    socket.on("disconnect", () => {
        delete players[socket.id]
    })
    socket.on("checkbubbles", () => {
        var bubblesToRemoveIndexes = []
        for(var i = 0; i != bubbles.length; i++) {
            var collision = circleTouchesCircle(players[socket.id].x, players[socket.id].y, players[socket.id].size, bubbles[i].x, bubbles[i].y, 20)
            if(collision) {
                bubbles[i] = {
                    color: random(0, 1000),
                    x: random(-2000, 2000),
                    y: random(-2000, 2000)
                }
                players[socket.id].size += 1
            }
        }
    })
    socket.on("positionchange", (data) => {
        players[socket.id].x = data.x
        players[socket.id].y = data.y
    })
});



setInterval(function() {
    io.sockets.emit("gameUpdate", {
        allBubbles: [{x: Math.random(), y: Math.random(), size: 100}]
    });
}, 1000)
