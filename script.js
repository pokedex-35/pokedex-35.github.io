let urlTypes = "https://pokeapi.co/api/v2/type";
let typesList;
let shapesList;
let pokemon;
let homeUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100"
let pokemonList;

//todo 1 : regrouper dans une seule fonction les instructions qui permettent d'afficher la page d'accueil : lancer cette fonction au démarrage du site ou si on clique sur "accueil"

//todo 2 : établir une fonction qui se déclenche quand on clique pour voir un pokemon : le contenu est alors remplacé par les stats du pokemon choisi, ainsi que par des liens vers ses évolutions, ou d'autres pokemons (du même type ou de la même génération...)

//todo 3 : gérer la barre de recherche : on tape le nom d'un pokemon et on le recupère. Si le pokemon est inconnu Que se passe-t-il ?

//todo 4 : dropdown par espèce, par forme...


// mise en place de la nav
fetch(urlTypes)
.then(response => response.json())
.then(response => typesList = response)
.then(()=>constructDropdown(typesList.results));   

getDropdown("shape");
getDropdown("habitat");
getDropdown("color");

/**
 * afficher les dropdowns pour habitat, shape et color
 * @param {string} criteria 
 */
function getDropdown(criteria){
    fetch(`https://pokeapi.co/api/v2/pokemon-${criteria}`)
    .then(response => response.json())
    .then(response => shapesList = response)
    .then(()=>constructShapesDropdown(shapesList.results, criteria));   
}
constructHome();

function constructHome(){
    document.getElementById("page-title").textContent = "Pokedex Accueil"
    // mise en place du carousel
    for(let i=0; i<3; i++){
        let id = getRandomIntInclusive(1, 1025);    
        let urlCarousel = `https://pokeapi.co/api/v2/pokemon/${id}`;
        fetch(urlCarousel)
            .then(response => response.json())
            .then(response => pokemon = response)
            .then(() => constructCarouselItem(pokemon, i));
    }
    // mise en place de la liste des pokemons
    fetch(homeUrl)
        .then(response => response.json())
        .then(response => pokemonList = response.results)
        .then(() => displayPokemonList(pokemonList, document.getElementById("section2")));
}

// sert à la construction du carousel
function constructCarouselItem(pokemon, i){
    let carouselItemHtml =`
        <div class="carousel-item ">
            <div class="card">
                <img src="${pokemon.sprites.other.home.front_default}" class="card-img-top w-50 m-auto" alt="${pokemon.name}">
                <div class="card-body">
                <h5 class="card-title">${capitalize(pokemon.name)}</h5>
                <div class="btn-group mb-2" role="group" aria-label="Basic example"></div>
                <a href="#" class="btn btn-primary d-block w-25 m-auto" onclick="displaySinglePokemon(event)" data="${pokemon.name}">Go to stats</a>
                </div>
            </div>
        </div>`;
    let carouselItemElement = createElementFromHtml(carouselItemHtml);
    for(type of pokemon.types){
        carouselItemElement.querySelector("div.btn-group").insertAdjacentHTML("beforeend",`<button type="button" class="btn btn-primary ${type.type.name}" onclick="handleType(event)">${capitalize(type.type.name)}</button>`);
    }

    if(i==0){
        carouselItemElement.classList.add("active");
    }

    document.getElementById("carousel").insertAdjacentElement("afterbegin", carouselItemElement);
}

/**
 * Permet d'afficher une liste de pokemons dans des "cards"
 * @param {array} arr 
 */
function displayPokemonList(arr, parentElement){
    parentElement.innerHTML ="";
    console.log(arr);
    for(item of arr){
        let pokemonItem;
        fetch(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
            .then(response => response.json())
            .then(response => pokemonItem = response)
            .then(() => {
                let pokemonElement = createElementFromHtml(
                `
                <div class="card w-25 mt-3 text-center">
                    <img src="${pokemonItem.sprites.other.home.front_default}" class="card-img-top w-50 m-auto" alt="${pokemonItem.name}">
                    <div class="card-body">
                    <h5 class="card-title">${capitalize(pokemonItem.name)}</h5>
                    <div class="btn-group mb-2" role="group" aria-label="Basic example"></div>
                    <a onclick="displaySinglePokemon(event)" data="${pokemonItem.name}" class="btn btn-primary d-block w-75 m-auto">Go to stats</a>
                    </div>
                </div>`);
                for(type of pokemonItem.types){
                    pokemonElement.querySelector("div.btn-group").insertAdjacentHTML("beforeend",`<button type="button" class="btn btn-primary ${type.type.name}" onclick="handleType(event)">${capitalize(type.type.name)}</button>`);
                }
            
                parentElement.insertAdjacentElement("beforeend", pokemonElement);
            })
    }
}

/**
 * permet d'afficher la page pour 1 pokemon
 * @param {event} e 
 */
function displaySinglePokemon(e){
    let pokemonName = e.target.getAttribute("data");
    console.log(pokemonName);
    let pokemon;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(response => pokemon = response)
        .then(() => constructSinglePokemon(pokemon));
}

/**
 * Construit l'élément pour 1 pokemon et l'insère dans le document
 * @param {object} pokemon 
 */
function constructSinglePokemon(pokemon){
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    document.getElementById("page-title").textContent = capitalize(pokemon.name);
    console.log(pokemon);
    let pokemonHtml = `
        <div class="card w-75 mt-3 text-center">
            <img src="${pokemon.sprites.other.home.front_default}" class="card-img-top w-50 m-auto" alt="${pokemon.name}">
            <div class="card-body">
            <h5 class="card-title">${capitalize(pokemon.name)}</h5>
            <div class="stats"></div>
            <div class="btn-group" role="group" aria-label="Basic example"></div>
            </div>
        </div>`;
    let pokemonElement = createElementFromHtml(pokemonHtml);
    pokemonElement.querySelector("div.stats").insertAdjacentHTML("beforeend",`<p>Height : ${pokemon.height}</p>`);
    pokemonElement.querySelector("div.stats").insertAdjacentHTML("beforeend",`<p>Weight : ${pokemon.weight}</p>`);
    pokemonElement.querySelector("div.stats").insertAdjacentHTML("beforeend",`<p>Base experience : ${pokemon.base_experience}</p>`);
    for(stat of pokemon.stats){
        pokemonElement.querySelector("div.stats").insertAdjacentHTML("beforeend",`<p>${capitalize(stat.stat.name)} : ${stat.base_stat}</p>`);
    }
    for(type of pokemon.types){
        pokemonElement.querySelector("div.btn-group").insertAdjacentHTML("beforeend",`<button type="button" class="btn btn-primary ${type.type.name}" onclick="handleType(event)">${capitalize(type.type.name)}</button>`);
    }
    document.getElementById("section2").insertAdjacentElement("beforeend", pokemonElement);
}

/**
 * se déclenche quand on clique sur un type dans le dropdown : remplace le contenu de la page avec la liste des pokemons du type sélectionné
 * @param {array} e 
 */
function handleType(e){
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    document.getElementById("page-title").textContent = `Pokemon : type ${e.target.textContent}`;
    let pokemonType = e.target.textContent.toLowerCase();
    console.log(`https://pokeapi.co/api/v2/type/${pokemonType}`);
    fetch(`https://pokeapi.co/api/v2/type/${pokemonType}`)
        .then(response => response.json())
        .then(response => {
            console.log(response.pokemon);
            let pokemonList = response.pokemon.map(pokemon => pokemon.pokemon);
            console.log(pokemonList);
            displayPokemonList(pokemonList, document.getElementById("section2"));
        });
            
}

/**
 * se déclenche quand on clique sur un type dans le dropdown : remplace le contenu de la page avec la liste des pokemons du type sélectionné
 * @param {array} e 
 */
function handleDropdown(e){
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    let pokemonType = e.target.textContent.toLowerCase();
    let criteria = e.target.getAttribute("data");
    document.getElementById("page-title").textContent = `Pokemon : ${criteria} ${e.target.textContent}`;
    let pokemonList;
    fetch(`https://pokeapi.co/api/v2/pokemon-${criteria}/${pokemonType}`)
        .then(response => response.json())
        .then(response => pokemonList = response.pokemon_species)
        .then(() => displayPokemonList(pokemonList, document.getElementById("section2")));            
}

function handleSearch(e){
    e.preventDefault();
    let pokemonName = document.getElementById("search").value.toLowerCase();

    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    document.getElementById("page-title").textContent = `Search result for ${pokemonName}`;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(response => pokemon = response)
        .then(() => constructSinglePokemon(pokemon))
        .catch(() => {
            document.getElementById("section2").innerHTML = "<h1>no result found</h1>";
        });
}


/**
 * sert à la mise en place du dropdown
 * @param {array} arr 
 */
function constructDropdown(arr){
    document.getElementById("types-dropdown").innerHTML = "";
    for(item of arr){
        let itemElement = `<li><p class="dropdown-item" onclick="handleType(event)">${capitalize(item.name)}</p></li>`;
        document.getElementById("types-dropdown").insertAdjacentHTML("beforeend", itemElement);
    }
}

function constructShapesDropdown(arr, criteria){
    document.getElementById(`${criteria}-dropdown`).innerHTML = "";
    for(item of arr){
        let itemElement = `<li><p class="dropdown-item" onclick="handleDropdown(event)" data="${criteria}">${capitalize(item.name)}</p></li>`;
        document.getElementById(`${criteria}-dropdown`).insertAdjacentHTML("beforeend", itemElement);
    }
}

/**
 * tirer un entier au hasard dans un intervalle borné
 * @param {integer} min 
 * @param {integer} max 
 * @returns 
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * créer un objet élément en js à partir d'une string
 * @param {string} str 
 * @returns 
 */
function createElementFromHtml(str){
    var divElement = document.createElement("div");
    divElement.innerHTML = str.trim();
    return divElement.firstChild;
}

/**
 * Met une majuscule à une chaîne de caractères
 * @param {string} str 
 * @returns 
 */
function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}