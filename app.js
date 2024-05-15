const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const lobbiesManager = require('./lobbiesManager');
const gameManager = require('./gameManager')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

//GET ROUTES ---------------------------------------------------------- 
app.get('/match/:player', (req, res)=>{
    const player = req.params.player;

    //TODO: Try to find match.
    res.json(lobbiesManager.TryGetMatch(player)); 
});

// POST ROUTES --------------------------------------------------------
app.post('/add-match', (req,res) => {
    const matchData = req.body.players;
   
    lobbiesManager.CreateLobby(matchData);
    res.send('Success');
});

app.post('/play-card/:player', (req,res) => {
    const player = req.params.player;
    const card = req.body;
   
    res.status(201).send('Card played');
});

app.post('/end-match/:mode/:id', (req, res) => {
    const mode = req.params.mode;
    const id = req.params.id;

    lobbiesManager.ProcessEndMatch(id);
    res.send('Success');
});

app.post('/client-connected/:matchID/:id', (req, res) => {
    const matchID = req.params.matchID;
    const clientID = req.params.id;

    gameManager.InitializeLastClient(matchID, clientID);
    res.send('Success');
});

//DELETE ROUTES -----------------------------------------------------
app.delete('/lobby/:player', (req,res) => {
    // Handle delete lobby
    res.send('Success');
});

// WebSocket Server
wss.on('connection', function connection(ws) {
    console.log('Cliente conectado al WebSocket.');

    gameManager.AddClient(ws);
    ws.on('message', function incoming(message) {
        const parts = message.toString().split('$');
        let jsonData;


        if (parts.length == 4) 
        {
            switch(parts[0])
            {
                case "JSON":
                    jsonData = JSON.parse(parts[1]);
                    gameManager.PlayCard(jsonData, parts[2],parts[3]);
                    console.log('Mensaje recibido desde el WebSocket:', jsonData);
                    break;
                case "INFO":
                    const data = 
                    {
                        matchID: parts[1],
                        clientID: parts[2]
                    }
                    gameManager.InitializeLastClient(data);
                break;
            }
           
        }
    });

    ws.on('close', function close() {
        console.log('Cliente desconectado del WebSocket.');
    });
});

// SERVER LISTEN ----------------------------------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log('Servidor Express y WebSocket escuchando en el puerto: ' + PORT);
});