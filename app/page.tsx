"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface Pokemon {
  id: number
  name: string
  sprite: string
  types: string[]
  error?: boolean
  status?: number
  message?: string
}

interface PokemonGeneration {
  id: number
  name: string
  region: string
  range: [number, number]
}

// Definition of Pokémon generations
const POKEMON_GENERATIONS: PokemonGeneration[] = [
  { id: 1, name: "Generation 1", region: "Kanto", range: [1, 151] },
  { id: 2, name: "Generation 2", region: "Johto", range: [152, 251] },
  { id: 3, name: "Generation 3", region: "Hoenn", range: [252, 386] },
  { id: 4, name: "Generation 4", region: "Sinnoh", range: [387, 493] },
  { id: 5, name: "Generation 5", region: "Unova", range: [494, 649] },
  { id: 6, name: "Generation 6", region: "Kalos", range: [650, 721] },
  { id: 7, name: "Generation 7", region: "Alola", range: [722, 809] },
  { id: 8, name: "Generation 8", region: "Galar/Hisui", range: [810, 905] },
  { id: 9, name: "Generation 9", region: "Paldea", range: [906, 1025] },
]

const POKEMON_TYPE_STYLES: { [key: string]: { translation: string; className: string } } = {
  normal: { translation: "Normal", className: "bg-gray-400 text-black" },
  fire: { translation: "Fire", className: "bg-orange-500 text-white" },
  water: { translation: "Water", className: "bg-blue-500 text-white" },
  grass: { translation: "Grass", className: "bg-green-500 text-white" },
  electric: { translation: "Electric", className: "bg-yellow-400 text-black" },
  ice: { translation: "Ice", className: "bg-cyan-300 text-black" },
  fighting: { translation: "Fighting", className: "bg-red-700 text-white" },
  poison: { translation: "Poison", className: "bg-purple-500 text-white" },
  ground: { translation: "Ground", className: "bg-amber-600 text-white" },
  flying: { translation: "Flying", className: "bg-indigo-400 text-white" },
  psychic: { translation: "Psychic", className: "bg-pink-500 text-white" },
  bug: { translation: "Bug", className: "bg-lime-500 text-black" },
  rock: { translation: "Rock", className: "bg-yellow-700 text-white" },
  ghost: { translation: "Ghost", className: "bg-indigo-700 text-white" },
  dragon: { translation: "Dragon", className: "bg-indigo-600 text-white" },
  dark: { translation: "Dark", className: "bg-gray-700 text-white" },
  steel: { translation: "Steel", className: "bg-slate-500 text-white" },
  fairy: { translation: "Fairy", className: "bg-pink-300 text-black" },
  unknown: { translation: "Unknown", className: "bg-gray-300 text-black" },
  shadow: { translation: "Shadow", className: "bg-neutral-800 text-white" }
};

// Component for the Pokémon collage background
const PokemonCollageBackground = ({ pokemon }: { pokemon: Pokemon[] }) => {
  const [backgroundItems, setBackgroundItems] = useState<Array<{
    pokemon: Pokemon;
    x: number;
    y: number;
    rotation: number;
    scale: number;
  }>>([]);
  
  useEffect(() => {
    if (pokemon.length > 0) {
      const getRandomPokemon = () => {
        if (pokemon.length === 0) return [];
        
        // We are going to create positions to ensure full coverage
        const pokemonPositions = [];
        
        // Distribute Pokémon across the entire screen with less space between them
        for (let y = 0; y <= 100; y += 5) { // Reduced to 5% increments for height (previously 8%)
          for (let x = 0; x <= 100; x += 5) { // Reduced to 5% increments for width (previously 8%)
            // Select a random Pokémon
            const randomIndex = Math.floor(Math.random() * pokemon.length);
            
            // Add variation to the position so it's not a perfect grid
            const xPos = x + (Math.random() * 3 - 1.5); // ±1.5% variation
            const yPos = y + (Math.random() * 3 - 1.5); // ±1.5% variation
            
            pokemonPositions.push({
              pokemon: pokemon[randomIndex],
              x: xPos,
              y: yPos,
              rotation: Math.random() * 30 - 15, // Reduced rotation for better visibility
              scale: 1.3 + Math.random() * 0.7, // Increased base size (previously 0.9-1.5, now 1.3-2.0)
            });
          }
        }
        
        // Ensure special coverage at the bottom (last 25% of the screen)
        for (let i = 0; i < 50; i++) {
          const randomIndex = Math.floor(Math.random() * pokemon.length);
          pokemonPositions.push({
            pokemon: pokemon[randomIndex],
            x: Math.random() * 100,
            y: 75 + Math.random() * 25, // Between 75% and 100% of the height
            rotation: Math.random() * 30 - 15,
            scale: 1.3 + Math.random() * 0.7,
          });
        }
        
        // Add additional randomly scattered Pokémon to fill gaps
        for (let i = 0; i < 100; i++) {
          const randomIndex = Math.floor(Math.random() * pokemon.length);
          pokemonPositions.push({
            pokemon: pokemon[randomIndex],
            x: Math.random() * 100,
            y: Math.random() * 100,
            rotation: Math.random() * 30 - 15,
            scale: 1.3 + Math.random() * 0.7,
          });
        }
        
        return pokemonPositions;
      };
      
      setBackgroundItems(getRandomPokemon());
    }
  }, [pokemon]);
  
  if (backgroundItems.length === 0) return null;
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 opacity-35 pointer-events-none" style={{ filter: 'none' }}>
      {backgroundItems.map((item, index) => (
        <div 
          key={`${item.pokemon.id}-${index}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            willChange: 'transform',
          }}
        >
          <Image 
            src={item.pokemon.sprite} 
            alt=""
            width={144}
            height={144}
            className="w-36 h-36 object-contain"
            style={{ imageRendering: 'pixelated' }}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};

export default function PokemonQuiz() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [pokemonQueue, setPokemonQueue] = useState<Pokemon[]>([])
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null)
  const [userInput, setUserInput] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]) // Default to the first 3 generations
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [allPokemonData, setAllPokemonData] = useState<Pokemon[]>([]) // Store all data from JSON
  const [pokemonPerRound, setPokemonPerRound] = useState<number>(50) // Default value for Pokémon per round

  // Reference for the suggestions container
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);

  // Effect to load all Pokémon data from the static JSON file once
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const response = await fetch('/pokemon-data.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch pokemon-data.json: ${response.statusText}`);
        }
        const data = await response.json();
        setAllPokemonData(data.filter((p: Pokemon) => !p.error)); // Filter out any fetch errors from script
        setLoading(false);
      } catch (error) {
        console.error("Error loading all Pokemon data from JSON:", error);
        alert("Failed to load Pokémon data. Please try running 'yarn fetch-data' and refresh.");
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Function to prepare Pokémon for the game based on selected generations
  const preparePokemonForGame = useCallback(() => {
    if (selectedGenerations.length === 0) {
      alert("Please select at least one generation")
      return
    }
    if (allPokemonData.length === 0) {
      alert("Pokémon data is not loaded yet. Please wait or try refreshing.");
      return;
    }

    setLoading(true)
    setLoadingProgress(0) // Reset progress for this new loading type

    const pokemonForSelectedGenerations: Pokemon[] = []
    selectedGenerations.forEach(genId => {
      const generationInfo = POKEMON_GENERATIONS.find(gen => gen.id === genId)
      if (generationInfo) {
        const [start, end] = generationInfo.range
        allPokemonData.forEach(pokemon => {
          if (pokemon.id >= start && pokemon.id <= end) {
            pokemonForSelectedGenerations.push(pokemon)
          }
        })
      }
    })

    if (pokemonForSelectedGenerations.length === 0) {
      alert("No Pokémon found for the selected generations. This might indicate an issue with the data.");
      setLoading(false);
      return;
    }

    setAllPokemon(pokemonForSelectedGenerations) // This state now holds only the Pokémon for the current game
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...pokemonForSelectedGenerations];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Limit the queue to the specified number of Pokémon per round
    const limitedQueue = shuffled.slice(0, Math.min(pokemonPerRound, shuffled.length));
    
    setPokemonQueue(limitedQueue)
    setCurrentPokemon(limitedQueue[0])
    setShowResult(null)
    setLoading(false)
    setGameStarted(true)
    setLoadingProgress(100) // Indicate completion

  }, [selectedGenerations, allPokemonData, pokemonPerRound]);

  // Filter suggestions based on user input
  useEffect(() => {
    if (userInput.length > 0 && allPokemon.length > 0) {
      const filtered = allPokemon
        .map((p) => p.name)
        .filter((name) => name.toLowerCase().includes(userInput.toLowerCase()))
        .slice(0, 8) // Limit to 8 suggestions
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
      setSelectedSuggestionIndex(-1) // Reset selected index
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }, [userInput, allPokemon])

  // Handle automatic scrolling when selection changes
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsContainerRef.current) {
      const container = suggestionsContainerRef.current;
      const selectedElement = container.children[selectedSuggestionIndex] as HTMLElement;
      
      if (selectedElement) {
        // Calculate position of the selected element relative to the container
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elementTop = selectedElement.offsetTop;
        const elementBottom = elementTop + selectedElement.clientHeight;
        
        // Scroll if the element is out of view
        if (elementTop < containerTop) {
          // If the element is above the view
          container.scrollTop = elementTop;
        } else if (elementBottom > containerBottom) {
          // If the element is below the view
          container.scrollTop = elementBottom - container.clientHeight;
        }
      }
    }
  }, [selectedSuggestionIndex]);

  const handleSubmit = useCallback(
    (guess: string) => {
      if (!currentPokemon || !guess.trim()) return

      const isCorrect = guess.toLowerCase() === currentPokemon.name.toLowerCase()

      setShowResult(isCorrect ? "correct" : "incorrect")
      setCorrectAnswer(currentPokemon.name)
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }))

      setUserInput("")
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    },
    [currentPokemon],
  )

  const nextPokemon = useCallback(() => {
    const remainingQueue = pokemonQueue.slice(1)

    if (remainingQueue.length === 0) {
      // Show final score screen instead of restarting
      setGameFinished(true)
      setCurrentPokemon(null)
    } else {
      setPokemonQueue(remainingQueue)
      setCurrentPokemon(remainingQueue[0])
      setShowResult(null)
      setCorrectAnswer("")
    }
  }, [pokemonQueue])

  const resetGame = () => {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...allPokemon];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Limit the queue to the specified number of Pokémon per round
    const limitedQueue = shuffled.slice(0, Math.min(pokemonPerRound, shuffled.length));

    setPokemonQueue(limitedQueue)
    setCurrentPokemon(limitedQueue[0])
    setScore({ correct: 0, total: 0 })
    setShowResult(null)
    setCorrectAnswer("")
    setUserInput("")
    setShowSuggestions(false)
    setGameFinished(false)
    setGameStarted(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    handleSubmit(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle navigation with arrow keys
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        setSelectedSuggestionIndex((prev) => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        setSelectedSuggestionIndex((prev) => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      
      if (showResult) {
        nextPokemon()
      } else if (selectedSuggestionIndex >= 0 && filteredSuggestions.length > 0) {
        const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex]
        handleSubmit(selectedSuggestion)
      } else if (userInput.trim()) {
        const guess = userInput.trim()
        const exactMatch = allPokemon.find((p) => p.name.toLowerCase() === guess.toLowerCase())

        if (exactMatch) {
          handleSubmit(guess)
        } else if (filteredSuggestions.length > 0) {
          handleSubmit(filteredSuggestions[0])
        } else {
          handleSubmit(guess)
        }
      }
    } else if (e.key === " ") {
      if (showResult) {
        e.preventDefault()
        e.stopPropagation()
        nextPokemon()
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  // REMOVE the global event listener that was causing conflicts
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (showResult && (e.key === "Enter" || e.key === " ") && !gameFinished) {
        e.preventDefault()
        e.stopPropagation()
        nextPokemon()
      }
    }

    if (showResult && !gameFinished) {
      window.addEventListener("keydown", handleGlobalKeyPress)
    }

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyPress)
    }
  }, [showResult, nextPokemon, gameFinished])

  // Focus the input when the current Pokémon changes
  useEffect(() => {
    if (gameStarted && !showResult) {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [currentPokemon, showResult, gameStarted])

  // Handle changes in generation checkboxes
  const handleGenerationChange = (genId: number) => {
    setSelectedGenerations((prev) => {
      if (prev.includes(genId)) {
        return prev.filter((id) => id !== genId)
      } else {
        return [...prev, genId]
      }
    })
  }

  // Select all generations
  const selectAllGenerations = () => {
    setSelectedGenerations(POKEMON_GENERATIONS.map((gen) => gen.id))
  }

  // Deselect all generations
  const deselectAllGenerations = () => {
    setSelectedGenerations([])
  }

  // Generation selection screen
  if (!gameStarted && !loading && !gameFinished) {
    // Calculate total Pokémon available from selected generations
    const totalAvailablePokemon = selectedGenerations.reduce((total, genId) => {
      const gen = POKEMON_GENERATIONS.find(g => g.id === genId);
      if (gen) {
        return total + (gen.range[1] - gen.range[0] + 1);
      }
      return total;
    }, 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center p-4 relative">
        {/* Background with Poké Ball pattern */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0ZM30 10C39.9411 10 48 18.0589 48 28H33C31.3431 28 30 29.3431 30 31C30 32.6569 31.3431 34 33 34H48C48 43.9411 39.9411 52 30 52C20.0589 52 12 43.9411 12 34H27C28.6569 34 30 32.6569 30 31C30 29.3431 28.6569 28 27 28H12C12 18.0589 20.0589 10 30 10Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <Card className="max-w-4xl w-full bg-white/90 backdrop-blur-sm relative z-10">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Who&apos;s That Pokémon?</h1>
            <h2 className="text-xl font-semibold mb-4">Select Generations</h2>
            
            <div className="mb-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllGenerations}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllGenerations}>
                Deselect All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
              {POKEMON_GENERATIONS.map((gen) => (
                <div
                  key={gen.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedGenerations.includes(gen.id)
                      ? "bg-blue-100 border-blue-500 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleGenerationChange(gen.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Generation {gen.id}</div>
                    {selectedGenerations.includes(gen.id) && (
                      <span className="w-3 h-3 rounded-full bg-blue-500 block"></span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">({gen.region})</div>
                  <div className="text-xs text-gray-500">Pokémon {gen.range[0]}-{gen.range[1]}</div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Pokémon per Round</h2>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-3/4">
                  <input 
                    type="range"
                    min="1"
                    max={totalAvailablePokemon || 100}
                    value={pokemonPerRound}
                    onChange={(e) => setPokemonPerRound(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>{Math.floor(totalAvailablePokemon / 2)}</span>
                    <span>{totalAvailablePokemon || 100}</span>
                  </div>
                </div>
                <div className="flex items-center md:w-1/4">
                  <Input
                    type="number"
                    min="1"
                    max={totalAvailablePokemon || 100}
                    value={pokemonPerRound}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= (totalAvailablePokemon || 100)) {
                        setPokemonPerRound(value);
                      }
                    }}
                    className="w-24 text-center"
                  />
                  <span className="ml-2 text-sm text-gray-600">Pokémon</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {pokemonPerRound === totalAvailablePokemon ? 
                  "All available Pokémon will be included in this round." : 
                  `${pokemonPerRound} random Pokémon will be selected from the available ${totalAvailablePokemon}.`}
              </p>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={preparePokemonForGame} 
                disabled={selectedGenerations.length === 0 || loading || allPokemonData.length === 0}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8"
              >
                {loading && allPokemonData.length === 0 ? "Loading Data..." : (loading ? "Preparing Game..." : "Start Game!")}
              </Button>
              
              {allPokemonData.length === 0 && !loading && (
                <p className="text-orange-500 text-sm mt-2">Loading initial Pokémon data, please wait...</p>
              )}
              {selectedGenerations.length === 0 && (
                <p className="text-red-500 text-sm mt-2">Select at least one generation</p>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                {selectedGenerations.length > 0 
                  ? `Total Pokémon available: ${totalAvailablePokemon}`
                  : "No Pokémon selected"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading screen
  if (loading && allPokemonData.length === 0) { // Show initial data loading screen
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading All Pokémon Data...</h2>
            <p className="text-gray-600">
              This is a one-time process. Please wait.
            </p>
          </div>
          {/* We don't have granular progress for this initial fetch from local JSON, could add if json is huge and parsing takes time */}
          <Progress value={undefined} className="w-full h-3 mb-4" /> 
          <div className="text-center text-sm text-gray-600">Fetching from <code>pokemon-data.json</code>...</div>
        </div>
      </div>
    )
  }

  // Game loading screen (preparing generations)
  if (loading && allPokemonData.length > 0) { // Show this when preparing game from already loaded data
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Pokémon...</h2>
            <p className="text-gray-600">
              Getting Pokémon from your selected generations...
            </p>
          </div>
          <Progress value={loadingProgress} className="w-full h-3 mb-4" />
          <div className="text-center text-sm text-gray-600">{Math.round(loadingProgress)}% complete</div>
        </div>
      </div>
    )
  }

  // Final score screen
  if (gameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Collage background with Pokémon */}
        <PokemonCollageBackground pokemon={allPokemon} />
        
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm relative z-10">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Game Over!</h1>
            
            <div className="text-center mb-8">
              <div className="text-2xl font-bold mb-2">
                Final Score: {score.correct}/{score.total}
              </div>
              <div className="text-xl">
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}% correct
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button 
                onClick={resetGame} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button 
                onClick={() => {
                  setGameStarted(false)
                  setGameFinished(false)
                  setAllPokemon([])
                  setPokemonQueue([])
                  setCurrentPokemon(null)
                  setScore({ correct: 0, total: 0 })
                }} 
                variant="outline"
              >
                Change Generations
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              You&apos;ve completed all Pokémon from the selected generations!
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Game screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 relative overflow-hidden">
      {/* Collage background with Pokémon */}
      <PokemonCollageBackground pokemon={allPokemon} />
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Who&apos;s That Pokémon?</h1>
          <div className="text-white text-lg">
            Score: {score.correct}/{score.total}
            {score.total > 0 && <span className="ml-2">({Math.round((score.correct / score.total) * 100)}%)</span>}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
            <Button 
              onClick={() => {
                setGameStarted(false)
                setAllPokemon([])
                setPokemonQueue([])
                setCurrentPokemon(null)
                setScore({ correct: 0, total: 0 })
              }} 
              variant="outline" 
              size="sm"
            >
              Change Generations
            </Button>
          </div>
        </div>

        {currentPokemon && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 md:p-8">
              {/* Main container with fixed height */}
              <div className="flex flex-col" style={{ minHeight: "480px" }}>
                {/* Pokémon image */}
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <Image
                      key={currentPokemon.id}
                      src={currentPokemon.sprite || "/placeholder.svg"}
                      alt="Pokemon silhouette"
                      width={192}
                      height={192}
                      className={`w-36 h-36 md:w-48 md:h-48 mx-auto transition-all duration-300`}
                      style={{
                        filter: !showResult ? "brightness(0)" : "none",
                        imageRendering: 'pixelated',
                      }}
                      unoptimized
                    />
                  </div>
                </div>

                {/* Types */}
                <div className="flex justify-center gap-2 mb-4">
                  {currentPokemon.types.map((type) => {
                    const typeStyle = POKEMON_TYPE_STYLES[type.toLowerCase()] || { translation: type, className: "bg-gray-200 text-gray-800" }; // Fallback
                    return (
                      <Badge 
                        key={type} 
                        variant="secondary" 
                        className={`text-sm px-3 py-1 capitalize ${typeStyle.className}`}
                      >
                        {typeStyle.translation}
                      </Badge>
                    );
                  })}
                </div>

                {/* Flexible space */}

                {/* Result */}
                {showResult && (
                  <div className="text-center mb-4">
                    <div
                      className={`flex items-center justify-center gap-2 text-lg md:text-xl font-bold mb-4 ${
                        showResult === "correct" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {showResult === "correct" ? (
                        <>
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                          Incorrect
                        </>
                      )}
                    </div>
                    <div className="text-base md:text-lg mb-4">
                      The Pokémon was: <span className="font-bold capitalize">{correctAnswer}</span>
                    </div>
                    <Button onClick={nextPokemon} className="bg-blue-600 hover:bg-blue-700">
                      Next Pokémon
                    </Button>
                    <div className="text-xs md:text-sm text-gray-500 mt-2">
                      Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">Enter</kbd> or{" "}
                      <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">Space</kbd> to continue
                    </div>
                  </div>
                )}

                {/* Input and suggestions */}
                {!showResult && (
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Type the Pokémon's name..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-base md:text-lg p-4 text-center"
                      autoComplete="off"
                      autoFocus={true}
                    />

                    {/* Suggestions */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div 
                        ref={suggestionsContainerRef}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 md:max-h-48 overflow-y-auto"
                      >
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full text-left px-4 py-2 text-sm md:text-base capitalize border-b border-gray-100 last:border-b-0 ${
                              index === selectedSuggestionIndex 
                                ? "bg-blue-100 text-blue-900" 
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="text-center mt-4">
                      <Button
                        onClick={() => handleSubmit(userInput.trim())}
                        disabled={!userInput.trim()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8"
                      >
                        Guess!
                      </Button>
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
                  Pokémon remaining in this round: {pokemonQueue.length > 0 ? pokemonQueue.length - 1 : 0}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
