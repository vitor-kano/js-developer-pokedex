const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton');
const popup = document.querySelector('.popup');
const overlayPopup = document.querySelector('.overlay-popup');
const closeButton = document.querySelector(".close-button");
const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="pokemonWidget" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        clickOnPokemon(offset, limit);
        closePopup();
    })
}

//click => show pokemon info
function clickOnPokemon(offset, limit) {

    //showing the popup info by adding class "active" to popup and overlay 
    pokemonList.childNodes.forEach((pokemonNode) => {
        pokemonNode.addEventListener("click", (event) => {
            
            //get name of clicked pokemon
            const clickedPokemon = event.currentTarget.childNodes[3].textContent;

            pokeApi.getSinglePokemon(offset, limit, clickedPokemon).then(pokemon => {   
                const newHTML = 
                    `
                        <div class="popup-header ${pokemon.type}">
                            <div class="popup-name-types">
                                ${pokemon.name}
                                <ol class="types">
                                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                </ol>
                            </div>
                            <img src="${pokemon.photo}" alt="${pokemon.name}"/>
                            <div class="close-button">&times;</div>
                        </div>
                        <div class="popup-body">
                            <div class="base-stats">Base-stats:</div> 
                                ${pokemon.stats.map((stat) => 
                                    `<li class="stat-${pokemon.stats.indexOf(stat)}">${stat}: ${pokemon.statsBaseNum[pokemon.stats.indexOf(stat)]}</li>`).join('')}
                        </div>
                    `;
                popup.innerHTML = newHTML;
                //finally show the popup & overlay of pokemon info
                popup.classList.add("active")
                overlayPopup.classList.add("active")

                //add listener to close button...
                closePopup();
            })
        });
    });    
};

function closePopup() {
    const closeButton = document.querySelector(".close-button");
    console.log(closeButton);
    closeButton.addEventListener("click", () => {
        popup.classList.remove("active");
        overlayPopup.classList.remove("active");
    })
}
//MAIN 
loadPokemonItens(offset, limit)
console.log("checkpoint");

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
