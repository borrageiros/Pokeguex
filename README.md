# PokéGuex! 🎮

## 🤔 What is this?

PokéGuex is a fun Pokémon guessing game! (Who is that Pokémon?) You'll be shown a silhouette of a Pokémon, and your mission is to guess its name. Test your Pokémon knowledge across different generations!

## ⚙️ How it Works

1.  **Download Data (First Time Only!)**: When you first start the game (or if the data is missing/outdated), the app automatically downloads all the necessary Pokémon information (names, sprites, types) from an API and stores it locally. This makes the game super fast on subsequent plays! 🚀
2.  **Select Generations**: Choose which Pokémon generations you want to include in your guessing game. More generations mean more Pokémon to guess! 🌍
3.  **Start Guessing**:
    - You'll see a shadowy figure of a Pokémon and its types.
    - Type your guess in the input box. Suggestions will appear as you type! 💡
    - Hit "Guess!" or press Enter.
4.  **See Results**:
    - If you're correct, you'll see the Pokémon and a "Correct!" message. ✅
    - If you're wrong, it will reveal the Pokémon and tell you the right answer. ❌
5.  **Next Pokémon**: Press "Next Pokémon" (or Enter/Space) to continue to the next challenge.
6.  **Game Over**: Once you've guessed all Pokémon from your selected generations, you'll see your final score. 🏆

## ✨ Features

- **Generation Selection**: Customize your game by choosing specific Pokémon generations.
- **Local Data Storage**: Pokémon data is fetched once and stored locally for faster loading times and offline play potential. 💾
- **Progress Bar**: See a progress bar in your terminal when the Pokémon data is being downloaded for the first time.
- **Suggestions**: Get helpful suggestions as you type the Pokémon's name.
- **Keyboard Navigation**: Use arrow keys (Up/Down) and Enter to navigate suggestions and submit answers.
- **Sleek UI**: A clean and modern interface built with Tailwind CSS. 🎨
- **Responsive Design**: Playable on different screen sizes.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)

## 🚀 Getting Started

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd pokeguess
    ```
2.  **Install dependencies:**
    Make sure you have [Yarn](https://yarnpkg.com/) installed.
    ```bash
    yarn install
    ```
3.  **Run the development server:**

    ```bash
    yarn dev
    ```

    This will automatically:

    - Run the `fetch-data` script (if `public/pokemon-data.json` is missing or incomplete) to download Pokémon data. You'll see a progress bar in your terminal.
    - Start the Next.js development server.

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4.  **To build for production:**
    ```bash
    yarn build
    yarn start
    ```

Have fun guessing! 🎉
