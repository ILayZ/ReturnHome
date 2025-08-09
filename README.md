# Backpack Adventure

Backpack Adventure is a simple 2D platformer built with the [Phaser 3](https://phaser.io/) framework. You play as a sentient backpack navigating a side‑scrolling world filled with enemies and collectibles. The project currently showcases core platforming mechanics and serves as a foundation for future game development.

## Features

- **Phaser 3** game framework configured for Arcade Physics.
- **Player movement** with left/right walking, jumping, and idle animations.
- **Enemy interactions** including a walking stone enemy that patrols between boundaries.
- **Collectibles** for keys and stars with on‑screen score tracking.
- **Lives system** with a game over screen when all lives are lost.
- **Speed power‑up** that temporarily doubles player movement speed.
- **Parallax background** layers to add depth to the environment.

## Getting Started

### Prerequisites

The game is written in plain HTML, CSS, and JavaScript. No build step is required. To run it locally you only need a modern web browser. Launching the files through a web server is recommended so assets load correctly.

### Running the Game

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ReturnHome
   ```
2. Start a local web server in the project directory. You can use any static server, for example:
   ```bash
   npx http-server .
   # or
   python3 -m http.server
   ```
3. Open your browser and navigate to the URL printed by the server (typically `http://localhost:8080` or `http://localhost:8000`).
4. The game loads automatically. Use the arrow keys to play:
   - `Left/Right` – move
   - `Up` – jump

## Project Structure

```
ReturnHome/
├── assets/             # Image assets for the game
├── game.js             # Game logic and Phaser scene
├── index.html          # Entry point and Phaser loader
├── style.css           # Basic page styling
└── game.prd            # Product requirements and future plans
```

## Development Notes

The repository also contains a `game.prd` document outlining planned features such as additional enemy types, multiple levels, audio, and improved UI elements. Contributions are welcome to expand the gameplay.

## License

This project is provided for educational purposes and does not currently include a specific license. Feel free to experiment and modify the code for personal use.

