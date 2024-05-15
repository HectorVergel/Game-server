const { v4: uuidv4 } = require('uuid');


var gameLobbies = [];

function CreateLobby(_players)
{
    const matchData = 
    {
        players: _players,
        id: uuidv4()
    }
    gameLobbies.push(matchData);
    console.log(gameLobbies);
}

function RemoveLobby(_id)
{
    const l_idx = gameLobbies.findIndex(lobby => lobby.id == _id);

    if(l_idx >= 0)
    {
        gameLobbies.splice(l_idx, 1);
    }
}

function TryGetMatch(_playerName)
{
    try
    {
        for(let i = 0; i<gameLobbies.length; i++)
        {
            console.log("Lobby " + gameLobbies[i].players);
            if(gameLobbies[i].players.find(player => player.name == _playerName))
            {
                return JSON.stringify(gameLobbies[i]);
            }
        }    
        return 'Not found';
    }
    catch(e)
    {
        console.log('Error trying to get a match: ', e);
    }
}

module.exports = 
{
    CreateLobby, RemoveLobby, TryGetMatch
}