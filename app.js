//1. Instalar o Nodemon => npm install -g nodemon 
// O Nodemon => recarrega o servidor automaticamente toda vez que o código é alterado. 

//2. importar o express. Sintaxe diferente do React. No lugar de import usamos "require" e de export.default, module.exports
const express = require("express");

//8. importar identificador único universal no escopo global
const { v4: uuidv4 } = require("uuid");

const PORT = 4000;

//3. Importing all the pokemon for our data file
const allPokemon = require("./data");

// 4. Instanciando o Express para criar um aplicativo
const app = express();

// 7. Configurar o servidor Express para aceitar requisições com corpo (body) no formato JSON (post)
app.use(express.json());

// 6. Configurar o script "start" no arquivo json (já configurado neste lab)

// INTERACTION 1 - A GET /pokemon route, that serves an array of objects containing data about all the Pokemons
// Os métodos HTTP no Express sempre recebem 2 argumentos: o primeiro é uma string dizenDo qual rota receberá as requisições, e o segundo é uma função que é executada quando essa requisição é recebida
app.get("/pokemon", (request, response) => {
    // A callback dos métodos HTTP aceita 2 parâmetros: request e response, que representam a requisição enviada pelo cliente e a resposta enviada pelo servidor
    // Retornando a array allPokemon (que tem todos os pokemons) em formato JSON - item 3
    return response.json(allPokemon); 
  });

//INTERACTION 2 - An GET /pokemon/:id route, that serves an object of a specific Pokemon (search in the array using the provided id)

app.get("/pokemon/:id", (req, res) => {
    // Para definir parâmetros de rota no Express, usamos a mesma sintaxe do React Router (:nome-do-parametro), que torna essa porção da URL dinâmica (aceitando qualquer texto)
    // O Express disponibiliza os parâmetros de rota no objeto `params` dentro de req:
    const id = req.params.id;
  
    const foundPokemon = allPokemon.find((pokemonElement) => {
      return pokemonElement.id === id;
    });
  
    if (foundPokemon) {
      return res.json(foundPokemon);
    } else {
      return res.json({ msg: "Pokemon not found." });
    }
  });
// INTERACTION 3 - A GET /search route, where the user can search Pokemons by name or type 
//(when searching by type, should return all the pokemon found with that type)
//?key=value
// Pesquisar um elemento na array usamos query params (parâmetros de pesquisa)
app.get("/search", (req, res) => {
    // Parâmetros de pesquisa (a porção da URL depois do `?`) ficam disponíveis no Express no objeto 'query'
  
    const queryParams = req.query;
  
    // Caso a busca tenha sido feita com a URL ?name=bulbasaur
    console.log(queryParams); // { name: 'bulbasaur' }
    // Caso a busca tenha sido feita com a URL ?type=grass
    console.log(queryParams); // { type: 'grass' }
  
    // Iterar sobre cada propriedade do objeto queryParams
    for (let key in queryParams) {
    //   const foundTypes = allPokemon.includes  
      const foundPokemon = allPokemon.filter((pokemonElement) => {
        if (typeof pokemonElement[key] === "object") {
            return pokemonElement[key].includes(queryParams[key]);
          }
        return pokemonElement[key]
          .toLowerCase()
          .includes(queryParams[key].toLowerCase());
      });
  
      if (foundPokemon) {
        return res.json(foundPokemon);
      } else {
        return res.json({ msg: "Contact not found." });
      }
    }
  //PRA QUE ESSE QUERY PARAMS NO FINAL?
    res.json(queryParams);
  });

//INT 4 -  POST
// A POST /pokemon route, that inserts the new Pokemon into the existing list of all Pokemons (don't worry about persisting the data to the disk, we're gonan learn that later)
app.post("/pokemon", (req, res) => {
    // O objeto body é o objeto que guarda as informações enviadas no corpo da requisição (no React, 
    // o state que enviamos de segundo parâmetro no axios.post). Somente os métodos post e put têm o objeto body.
    // Formatar para Express aceitar requisições no formato json  (item 7 acima)

    const formData = req.body;
  
    const newPokemon = {
        // importar uuid no escopo global - item 8
      id: uuidv4(),
      name: formData.name,
      types: formData.types,
      height: formData.height,
      weight: formData.weight,
      sprite: formData.sprite
    };
  
    // ATENÇÃO: Estamos salvando o novo contato somente na memória do servidor, desta forma, 
    //quando o processo do Node for reiniciado, a memória é resetada e os novos registros perdidos
    allPokemon.push(newPokemon);
  
    return res.json(newPokemon);
  });
//INT 5 - PUT 
// A PUT /pokemon/:id route, that updates an existing Pokemon with the provided data
app.put("/pokemon/:id", (req, res) => {
    const formData = req.body;
  
    // Encontrar registro existente
    const id = req.params.id;
  
    const foundPokemon = allPokemon.find((pokemonElement) => {
      return pokemonElement.id === id;
    });
  
    // Encontrar o índice desse registro na array
    const index = allPokemon.indexOf(foundPokemon);
  
    // São necessários dois spreads para primeiro salvar o que já existe, e depois sobrescrever com as novas 
    //informações
    allPokemon[index] = { ...foundPokemon, ...formData };
  
    return res.json(allPokemon[index]);
  });
//INT 6 - DELETE
// A DELETE /pokemon/:id route, that deletes an existing Pokemon and returns a success message
app.delete("/pokemon/:id", (req, res) => {
    // Encontrar registro existente
    const id = req.params.id;
  
    const foundPokemon = allPokemon.find((pokemonElement) => {
      return pokemonElement.id === id;
    });
  
    // Encontrar o índice desse registro na array
    const index = allPokemon.indexOf(foundPokemon);
  
    // Forma mais simples de identificar o index:
    // const index = contactsArr.findIndex((contactElement) => {
    //     return contactElement.id === req.params.id;
    //   });

    // Se encontrar o pokemon solicitado (index > 0), deletar (ou seja, retirar da array através do splice)
    if(index > 0){
        const pokemonDeleted = allPokemon.splice(index,1)
        return res.json({pokemonDeleted});
        
    } else {
      return res.json({ msg: "Contact not found." });
    }
    // if(index > 0){
    //     allPokemon.splice(index,1)
    //     return res.json({ msg: "Contact deleted successfully" });
    // } else {
    //   return res.json({ msg: "Contact not found." });
    // }
  });
    

// 5. Escutar requisições HTTP em uma porta específica
app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
