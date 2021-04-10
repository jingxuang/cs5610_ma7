const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

// replace this string with your full name
const name = "Jingxuan Gao!"

console.log(`My name is ${name}`)

// use this list as your temporary database!
// note that it will reset every time you restart your server
const myPokemon = [{
    id: "fc10b559-872c-43cd-bad2-f02e2e0a2d58", name: "Pikachu", health: 10, level: 1
}];

const findPokemonByName = (name) => myPokemon.find((pokemon) => pokemon.name === name);
const findPokemonByID = (id) => myPokemon.find((pokemon) => pokemon.id === id);

router.get('/', function(req, res) {
    // return all pokemon
    res.send(myPokemon);
});

router.post('/', (req, res) => {
    // if the pokemon name already exists in the list, return an error
    // randomly generate an id using UUID ["uuid()"]
    // randomly generate a level between 1 and 10, inclusive, if none is given
    // randomly generate a health between 10 and 100, inclusive, if none is given
    // insert your pokemon into the myPokemon list
    // return a 200

    const pokemon = req.body;
    const pokemonId = uuid();

    // validate the req body
    if(!pokemon.name || pokemon.name === '') {
        res.status(400).send({
            error: 'Pokemon must have a unique name at least!'
        })
    };

    if(findPokemonByName(pokemon.name)) {
        res.status(400).send({
            error: 'Pokemon already exists!'
        })
    };

    myPokemon.push({
        id: pokemonId,
        name: pokemon.name,
        health: pokemon.health ? pokemon.health : Math.floor(Math.random() * 100) + 1,
        level: pokemon.level ? pokemon.level : Math.floor(Math.random() * 10) + 1
    });
    res.status(200).send({
        message: 'Success',
        pokemonId: pokemonId
    });
});

router.get('/:pokemonId', function (req, res) {
    // return pokemon if one is found matching the pokemonId
    // return a 404 if no pokemon matches that pokemonId

    const pokemonId = req.params.pokemonId;

    const targetPokemon = findPokemonByID(pokemonId);

    if(targetPokemon) {
        return res.send(targetPokemon);
    } else {
        res.status(404);
        res.send({error: 'No pokemon found!'});
    }
});

router.put('/:pokemonId', function(req, res) {
    // update the pokemon matching the pokemonId
    // based on the req body
    // return a 404 if no pokemon matches that pokemonId  

    const pokemon = req.body;
    const pokemonId = req.params.pokemonId;
    let targetPokemon = findPokemonByID(pokemonId);

    if(!targetPokemon) {
        res.status(400);
        return res.send({error: 'Pokemon not found!'});
    }

    if(!pokemon.name || !pokemon.health || !pokemon.level) {
        res.status(400);
        return res.send({error: "Pokemon's name, health and level must be set!"});
    }

    if(pokemon.name && pokemon.name !== targetPokemon.name) {
        res.status(400);
        return res.send({error: "Pokemon's name cannot be changed!"});
    }

    targetPokemon.health = pokemon.health;
    targetPokemon.level = pokemon.level;

    res.status(200).send('Success');
})

router.delete('/:pokemonId', function(req, res) {
    // delete pokemon if pokemonId matches the id of one
    // return 200 even if no pokemon matches that Id

    const pokemonId = req.params.pokemonId;
    for(var i = myPokemon.length - 1; i >= 0; i--) {
        if(myPokemon[i].id === pokemonId) {
            myPokemon.splice(i, 1);
        }
    }
    res.status(200).send('Success');
})

module.exports = router;