async function fetchPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) {
        throw new Error('Pokemon not found');
    }
    const pokemonData = await response.json();
    return pokemonData;


}

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.getElementById('searchButton');
    const pokemonNameInput = document.getElementById('pokemonName');
    const loadingGif = document.getElementById('loadingGif');
    const cardContainer = document.getElementById('cardContainer');
    const deckContainer = document.getElementById('deck');

    searchButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const pokemonName = pokemonNameInput.value.trim();
        if (!pokemonName) {
            alert('Please enter a Pokemon name');
            return;
        }

        loadingGif.style.display = 'block';
        cardContainer.style.display = 'none';

        try {
            const pokemonData = await fetchPokemonData(pokemonName);
            const hp = pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat;
            cardContainer.innerHTML = `
                <div class="flex-wrapper">
                    <div class="container-fluid mx-5 d-flex justify-content-center rounded" id="wrap" style="background-color: blue; width: 70%; height: auto;" draggable="true">
                        <div class="container-fluid d-flex justify-content-center flex-column my-3 " id="inner-container" style="background-color: yellow; padding-top: 5%; padding-bottom: 5%;">
                            <div class="container-fluid d-flex justify-content-between" id="nameAndHp">
                                <h4>${pokemonData.name}</h4>
                                <h4>${hp}</h4>
                            </div>
                            <div class="container-fluid d-flex justify-content-center align-items-center text-center" id="poke-img" style="width: 95%; height: auto;">
                                <img src="${pokemonData.sprites.front_default}" style="width: 20vw; height: auto;">
                            </div>
                            <div class="container-fluid d-flex justify-content-end" id="lengthAndWeight">
                                <p style="margin-right: 3%">Height: ${pokemonData.height}</p>
                                <p>Weight: ${pokemonData.weight}</p>
                            </div>
                            <div class="container-fluid" id="abilities-container">
                                ${pokemonData.abilities.map(ability => `
                                    <div class="container-fluid text-center" style="border-bottom: 1px solid black; padding: 3%;">
                                        <h4>${ability.ability.name}</h4>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            cardContainer.style.display = 'block';

            const card = document.getElementById('wrap');
            const dropZone = document.getElementById('drop-zone');

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    name: pokemonData.name,
                    hp: hp,
                    height: pokemonData.height,
                    weight: pokemonData.weight,
                    abilities: pokemonData.abilities.map(ability => ability.ability.name),
                    sprite: pokemonData.sprites.front_default
                }));
            });

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text/plain');
                const pokemon = JSON.parse(data);

                const newCard = document.createElement('div');
                newCard.classList.add('container-fluid', 'm-5', 'd-flex', 'justify-content-center', 'rounded');
                newCard.style.backgroundColor = 'blue';
                newCard.style.width = '20%'; // 50% of the original width
                newCard.style.height = 'auto';
                newCard.innerHTML = `
                    <div class="container-fluid d-flex justify-content-end flex-column my-2" style="background-color: yellow; padding-top: 5%; padding-bottom: 5%;">
                        <div class="container-fluid d-flex justify-content-between">
                            <h6 style>${pokemon.name}</h6>
                            <h6>${pokemon.hp}</h6>
                        </div>
                        <div class="container-fluid d-flex justify-content-center align-items-center text-center" style="width: 95%; height: auto;" id="poke-img">
                            <img src="${pokemon.sprite}" style="width: 15vw; height: auto;">
                        </div>
                        <div class="container-fluid d-flex justify-content-end">
                            <p style="margin-right: 3%; font-size: 50%;">Height: ${pokemon.height}</p>
                            <p style="font-size: 50%">Weight: ${pokemon.weight}</p>
                        </div>
                        <div class="container-fluid">
                            ${pokemon.abilities.map(ability => `
                                <div class="container-fluid text-center" style="border-bottom: 1px solid black; padding: 3%;">
                                    <h6 style="font-size: 70%">${ability}</h6>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                deckContainer.appendChild(newCard);
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setTimeout(() => {
                loadingGif.style.display = 'none';
            }, 1300);
        }
    });
});