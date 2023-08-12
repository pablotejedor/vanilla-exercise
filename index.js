const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const resultsContainer = document.querySelector('.results-container');
const messagesContainer = document.querySelector('.messages-container');

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

const displayErrorMessage = (error) => {
     messagesContainer.textContent = error;
     messagesContainer.classList.add('error-message');
};

const displayLoadingMessage = () => {
     messagesContainer.textContent = 'Loading...';

     if (messagesContainer.classList.contains('error-message'))
          messagesContainer.classList.remove('error-message');
};

const clearMessages = () => {
     messagesContainer.textContent = '';
};

const createCard = (pokemon) => {
     const types = pokemon.types.map((types) => types.type);

     const cardContainer = document.createElement('div');
     cardContainer.classList.add('card');

     const cardLeft = document.createElement('div');
     cardLeft.classList.add('card-left');

     const cardRight = document.createElement('div');
     cardRight.classList.add('card-right');

     const pokemonImg = document.createElement('img');
     pokemonImg.src =
          pokemon.sprites.other['official-artwork']['front_default'];
     pokemonImg.alt = pokemon.name;
     pokemonImg.classList.add('sprite');

     const pokemonName = document.createElement('h3');
     pokemonName.textContent = `#${pokemon.id} ${capitalizeFirstLetter(
          pokemon.name
     )}`;

     const badgeContainer = document.createElement('div');
     badgeContainer.classList.add('badge-container');

     const pokemonTypes = document.createElement('h4');
     pokemonTypes.textContent = 'Types: ';
     badgeContainer.appendChild(pokemonTypes);

     types.map((type) => {
          const badge = document.createElement('span');
          badge.classList.add('badge');
          badge.style.background = colors[type.name];
          badge.textContent = capitalizeFirstLetter(type.name);
          badgeContainer.appendChild(badge);
     });

     const pokemonHeight = document.createElement('h4');
     pokemonHeight.textContent = `Height: ${pokemon.height}`;

     const pokemonWeight = document.createElement('h4');
     pokemonWeight.textContent = `Weight: ${pokemon.weight}`;

     cardLeft.appendChild(pokemonImg);
     cardLeft.appendChild(pokemonName);

     cardRight.appendChild(badgeContainer);
     cardRight.appendChild(pokemonHeight);
     cardRight.appendChild(pokemonWeight);

     cardContainer.appendChild(cardLeft);
     cardContainer.appendChild(cardRight);

     resultsContainer.insertBefore(cardContainer, resultsContainer.firstChild);
};

const getPokemon = async (term) => {
     displayLoadingMessage();

     let pokemon = localStorage.getItem(term);

     if (pokemon) {
          clearMessages();
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
          .catch((error) => displayErrorMessage(error));

     if (pokemon) {
          localStorage.setItem(term, JSON.stringify(pokemon));
          clearMessages();
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
     if (!searchInput.value.match(/^[A-Za-z0-9]*$/)) {
          return displayErrorMessage('Your search term cannot contain symbols');
     }

     getPokemon(searchInput.value.toLowerCase());
});
