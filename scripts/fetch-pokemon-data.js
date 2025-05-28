const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // node-fetch v2 is CommonJS
const cliProgress = require('cli-progress');

const TOTAL_POKEMON = 1025; // As of Gen 9
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'pokemon-data.json');

async function fetchAllPokemonData() {
  console.log('Starting Pokémon data check...');

  if (fs.existsSync(OUTPUT_PATH)) {
    console.log(`Found existing data file: ${OUTPUT_PATH}`);
    try {
      const existingData = fs.readFileSync(OUTPUT_PATH, 'utf-8');
      const pokemonArray = JSON.parse(existingData);
      
      if (Array.isArray(pokemonArray)) {
        const validPokemonCount = pokemonArray.filter(p => p && !p.error).length;
        if (validPokemonCount === TOTAL_POKEMON) {
          console.log(`Pokémon data is already up-to-date. ${validPokemonCount}/${TOTAL_POKEMON} Pokémon loaded correctly. Skipping download.`);
          return; // Exit if data is complete and valid
        } else {
          console.log(`Existing data is incomplete or contains errors (${validPokemonCount}/${TOTAL_POKEMON} valid). Proceeding with download.`);
        }
      } else {
        console.log('Existing data file is not a valid JSON array. Proceeding with download.');
      }
    } catch (error) {
      console.warn(`Error reading or parsing existing data file: ${error.message}. Proceeding with download.`);
    }
  }

  console.log('Starting Pokémon data download...');
  const allPokemonData = [];
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  progressBar.start(TOTAL_POKEMON, 0);

  try {
    for (let id = 1; id <= TOTAL_POKEMON; id++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          console.warn(`
Failed to fetch Pokémon with ID ${id}. Status: ${response.status}`);
          // Add a placeholder or skip
          allPokemonData.push({ id, name: `pokemon_${id}_fetch_failed`, sprite: '', types: [], error: true, status: response.status });
          progressBar.increment();
          continue;
        }
        const pokemon = await response.json();
        allPokemonData.push({
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map((t) => t.type.name),
        });
      } catch (error) {
        console.warn(`
Error fetching Pokémon ID ${id}: ${error.message}`);
        allPokemonData.push({ id, name: `pokemon_${id}_error`, sprite: '', types: [], error: true, message: error.message });
      }
      progressBar.increment();
    }
  } finally {
    progressBar.stop();
  }

  console.log(`
Fetched data for ${allPokemonData.filter(p => !p.error).length} Pokémon (out of ${TOTAL_POKEMON}).`);
  
  // Ensure the public directory exists
  const publicDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allPokemonData, null, 2));
  console.log(`Pokémon data saved to ${OUTPUT_PATH}`);
}

fetchAllPokemonData().catch(error => {
  console.error('An error occurred during Pokémon data fetching:', error);
  process.exit(1);
}); 