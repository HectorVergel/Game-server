
const lobbiesManager = require('./lobbiesManager');

const clients = [];
let currentOrder = 0;
const maxMatchSize = 2;

function PlayCard(cardData, matchID, clientID)
{
    const matchClients = clients.filter(client => client.matchID == matchID);

    for (let index = 0; index < matchClients.length; index++) 
    {
       matchClients[index].ws.send(JSON.stringify(cardData));
        
    }
    const currentPlayer = clients.find(client => client.clientID == clientID);
    currentPlayer.cards--;
    if(cardData.type == 1 || cardData.type == 2)
    {
        let order = currentPlayer.order + 1;
        let nextClient = clients.find(client => client.order == order);
        if(nextClient == null)
        {
            nextClient = clients.find(client => client.order == 1);
        }
        nextClient.ws.send("block_"+currentPlayer.clientID);
    }
    else
    {

        NextTurn(currentPlayer);
    }
}

function StealCard(matchID, clientID)
{
    const matchClients = clients.filter(client => client.matchID == matchID);
    const myClient = clients.find(client => client.clientID == clientID);

    for (let index = 0; index < matchClients.length; index++) 
    {
        matchClients[index].ws.send(myClient.clientID + "_steal");
            
    }

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
        cards: 7,
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


async function StartTurn()
{
    if(clients.length >= maxMatchSize)
    {
        const firstClient = clients.find(client => client.order == 1);
        firstClient.ws.send("send");
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
    
    nextClient.ws.send(currentClient.clientID);
    
}


module.exports = 
{
    PlayCard, AddClient, InitializeLastClient, StealCard, NextTurn
}