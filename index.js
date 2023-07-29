const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const resultsContainer = document.querySelector('.results-container');

const colors = {
     bug: '#A7B723',
     dark: '#75574C',
     dragon: '#7037FF',
     electric: '#F9CF30',
     fairy: '#E69EAC',
     fighting: '#C12239',
     fire: '#F57D31',
     flying: '#A891EC',
     ghost: '#70559B',
     normal: '#AAA67F',
     grass: '#74CB48',
     ground: '#DEC16B',
     ice: '#9AD6DF',
     poison: '#A43E9E',
     psychic: '#FB5584',
     rock: '#B69E31',
     steel: '#B7B9D0',
     water: '#6493EB',
};

const capitalizeFirstLetter = (string) => {
     return `${string[0].toUpperCase()}${string.slice(1)}`;
};

const createErrorMessage = (error) => {
     resultsContainer.innerHTML = `<h2 class='error-message'>${error}</h2>`;
};

const createCard = (pokemon) => {
     const types = pokemon.types.map((types) => types.type.name);

     const card = `<div class='card'>
     <div class='card-left'>
     <img src='${
          pokemon.sprites.other['official-artwork']['front_default']
     }' alt='${pokemon.name}' class='sprite' />
     <h3>#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}</h3>
     </div>

     <div class='card-right'>
     
     <div class='badge-container'>
          <h4>Types: </h4>
     ${types.map(
          (type) =>
               `<div class='badge' style='background: ${
                    colors[type]
               }'>${capitalizeFirstLetter(type)}</div>`
     )}
     </div>
     <h4>Height: ${pokemon.height}</h4>
     <h4>Weight: ${pokemon.weight}</h4>
     </div>
     </div>`;

     resultsContainer.innerHTML = card;
};

const getPokemon = async (term) => {
     let pokemon = localStorage.getItem(term);

     if (pokemon) {
          createCard(JSON.parse(pokemon));
          return;
     }

     pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`)
          .then((response) => {
               if (!response.ok) {
                    throw new Error('No search results');
               }

               return response.json();
          })
          .catch((error) => createErrorMessage(error));

     if (pokemon) {
          localStorage.setItem(term, JSON.stringify(pokemon));
          createCard(pokemon);
     }
};

searchInput.addEventListener('keyup', () => {
     if (!searchInput.value) {
          searchButton.setAttribute('disabled', '');
     } else {
          searchButton.removeAttribute('disabled');
     }
});

searchButton.addEventListener('click', () => {
     getPokemon(searchInput.value);
});
