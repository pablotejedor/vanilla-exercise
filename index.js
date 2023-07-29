const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const resultsContainer = document.querySelector('.results-container');

const createErrorMessage = (error) => {
     resultsContainer.innerHTML = `<h2 class='error-message'>${error}</h2>`;
};

const createCard = (pokemon) => {
     const card = `<img src='${pokemon.sprites.other['official-artwork']['front_default']}' alt='${pokemon.name}' />`;

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
