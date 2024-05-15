
const lobbiesManager = require('./lobbiesManager');

const clients = [];
let currentOrder = 0;
const maxMatchSize = 2;

function PlayCard(cardData, matchID, clientID)
{
    const matchClients = clients.filter(client => client.matchID == matchID);
    console.log(clients.length);
    console.log("Client1: " + clients[0].matchID);
    console.log("Client2: " + clients[1].matchID);
    console.log(cardData);
    for (let index = 0; index < matchClients.length; index++) 
    {
       matchClients[index].ws.send(JSON.stringify(cardData));
        
    }
    const currentPlayer = clients.find(client => client.clientID == clientID);
    console.log("ID del cliente que ha juegado " + clientID);
    NextTurn(currentPlayer);
}

function AddClient(wsClient)
{
    if(currentOrder < 2)
    {
        currentOrder++;
    }
    else
    {
        currentOrder = 1;
    }
    const client = 
    {
        ws: wsClient,
        matchID: "",
        clientID: "",
        order: currentOrder
    }
    clients.push(client);
    if(clients.length >= maxMatchSize)
    {
        const waitForStart = setTimeout(StartTurn, 10000);
    }
}

function InitializeLastClient(data)
{
    clients[clients.length-1].matchID = data.matchID;
    clients[clients.length-1].clientID = data.clientID;

}


const timeInterval = setInterval(Update, 1000);

function Update() 
{
    if(clients.length > 0)
    {

        //console.log(clients[0]);
    }
}

async function StartTurn()
{
    if(clients.length >= maxMatchSize)
    {
        const firstClient = clients.find(client => client.order == 1);
        firstClient.ws.send("send");
        console.log("First player turn")
    }
        
}
    

function NextTurn(currentClient)
{
    let order = currentClient.order + 1;
    let nextClient = clients.find(client => client.order == order);
    if(nextClient == null)
    {
        nextClient = clients.find(client => client.order == 1);
    }
    
    nextClient.ws.send("send");
    
}


module.exports = 
{
    PlayCard, AddClient, InitializeLastClient
}