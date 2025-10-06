🐍 Snake vs Blocks — Cocos Creator Game
🎮 Overview

Snake vs Blocks is a clone of the popular mobile game Balls vs Blocks, built using Cocos Creator (TypeScript).
Control a growing snake that collects yellow pickups to increase its length and breaks through red blocks — but beware: if your snake length drops to zero, it’s game over!

🧩 Features

✅ Smooth snake movement using touch/keyboard
✅ Dynamic spawning of blocks and pickups
✅ Real-time collision detection
✅ Score and snake-length HUD
✅ Game Over screen with restart option
✅ Reusable prefabs for Block and Pickup
✅ Modular, easy-to-extend architecture (GameManager, Snake, Block, Pickup, GameOverUI)

🗂 Project Structure
assets/
├── scenes/
│   └── MainScene.scene        # Main game scene
│
├── scripts/
│   ├── GameManager.ts         # Core game logic (spawning, collisions, scoring)
│   ├── Snake.ts               # Snake head & segment control
│   ├── Block.ts               # Block prefab behavior
│   ├── Pickup.ts              # Pickup prefab behavior
│   └── GameOverUI.ts          # UI controls (restart, score display)
│
├── prefabs/
│   ├── Block.prefab
│   ├── Pickup.prefab
│   └── SnakeSegment.prefab
│
└── textures/                  # UI icons, background images, etc.

🧠 How It Works

Snake Movement: The snake moves horizontally; new segments are appended when pickups are collected.

Blocks: Blocks have numeric values. When the snake hits one, it loses that many segments.

Pickups: Yellow pickups add segments and increase score.

GameManager: Controls the spawn of blocks/pickups, handles collisions, updates HUD, and triggers GameOver.

GameOverUI: Displays score and provides restart functionality.

⚙️ Setup & Run Instructions

Clone the repository

git clone https://github.com/<your-username>/snake-vs-blocks.git
cd snake-vs-blocks


Open in Cocos Creator

Launch Cocos Creator (v3.x or later)

Choose “Open Project” and select this folder.

Run the Game

Open MainScene.scene

Click ▶ Play in the editor toolbar to test in simulator or browser.

🎯 Controls
Action	Input
Move left	A / ← / Swipe Left
Move right	D / → / Swipe Right
Restart Game	Click “Restart” button on Game Over panel
