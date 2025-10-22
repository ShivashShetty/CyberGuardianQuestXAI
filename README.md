## 🏗️ Project Structure

```
src/
├── components/          # React components (UI and feature components)
│   ├── ui/             # Reusable UI primitives (shadcn/ui)
│   ├── AIExplainer.tsx # AI assistant UI
│   ├── SocialEngineeringDefense.tsx # Phishing detection UI (compact card)
│   ├── CyberDefenseGame.tsx # Main game component
│   └── ...
├── pages/              # Page-level components (Index, AdminDashboard, NotFound)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets (images, icons)
└── styles/             # Global CSS and Tailwind config

AI-backend/
├── phishing_api.py     # FastAPI server for local LLM phishing detection
├── train_phishing_model.py # Script to retrain the classifier
├── phishing_tactics_model/ # Local model files (config.json, model.safetensors, etc.)
├── server.js           # Node backend (Gemini AI proxy, MongoDB integration)
└── .env                # environment variables for backend

db/
├── index.js            # MongoDB connection helper
└── controllers/        # API controllers for players, leaderboard, game sessions

public/                 # Static public files (robots.txt, favicon)
README.md               # This file
package.json            # npm scripts and frontend deps

## 🚀 How to get this project running (PowerShell)

Follow these steps to set up and run the full stack locally on Windows (PowerShell):

1. Clone the repo and install frontend deps

```powershell
git clone https://github.com/ShivashShetty/CyberGuardianQuestXAI.git
cd CyberGuardianQuestXAI
npm install
```

2. Create and activate the Python virtual environment for the AI backend

```powershell
# Create venv (if not already present)
python -m venv .venv

# Activate the venv in PowerShell
& .venv/Scripts/Activate.ps1

# Install Python packages required by the LLM server
pip install fastapi uvicorn transformers torch
```

3. Configure environment variables

Create the file `AI-backend/.env` with (example values):

```text
MONGODB_URI=mongodb://localhost:27017/yourdbname
MONGODB_DB_NAME=yourdbname
GEMINI_API_KEY=your_gemini_key_here
# Optional: HF_TOKEN for private huggingface models
HF_TOKEN=your_hf_token_here
```

4. Start everything with one command (from project root)

```powershell
npm start --prefix d:/CyberGuardianQuestXAI
```

This runs both the Node.js backend and the local FastAPI LLM server in parallel.

5. Open the frontend

Open `http://localhost:5173` (Vite default) in your browser to use the app.

### Tips
- If the LLM fails to start due to port conflicts, edit `AI-backend/phishing_api.py` and change the uvicorn port (default 8082).
- If transformers attempts to download private models, authenticate with `huggingface-cli login` or set `HF_TOKEN` in `.env`.
- Use `npm run start:node --prefix d:/CyberGuardianQuestXAI` and `npm run start:llm --prefix d:/CyberGuardianQuestXAI` to start servers individually for debugging.

# CyberGuard Academy 🛡️

**An interactive cybersecurity education platform combining gamified learning with AI-powered assistance.**

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [LLM & Local Phishing Detection](#-llm--local-phishing-detection-recent-additions)
- [Quick Run Commands](#-quick-run-commands-single-command-start)
- [Model & Data Notes](#-model--data-notes)
- [Troubleshooting](#-troubleshooting-common-errors-and-fixes)
- [Recent Changes](#-what-changed-recently)
- [Documentation](#-documentation)
- [Acknowledgments](#-acknowledgments)

## 🎯 Project Overview

CyberGuard Academy is a comprehensive educational platform designed to make cybersecurity learning engaging and accessible. The platform combines traditional learning modules with an interactive tower defense game and AI-powered explanations to create an immersive learning experience.

### Key Features

- **📚 Interactive Learning Modules**: Structured cybersecurity curriculum with progressive difficulty
- **🎮 Cyber Defense Game**: Real-time tower defense game with cybersecurity themes
- **🏆 Arcade-Style Scoreboard**: Every game session (even with the same player name) is a unique entry. Scoreboard displays all sessions, sorted by score, with the highest at the top.
- **🔒 Admin Dashboard**: Password-protected admin page (`/admin`, password: `admin123`) for managing scoreboard entries and monitoring backend status.
- **🤖 AI Learning Assistant (Gemini)**: Uses Google Gemini API for intelligent threat explanations and interactive Q&A. API key is stored in `.env`.
- **📊 Progress Tracking**: Comprehensive dashboard with statistics and achievements
- **🏆 Gamification System**: XP, levels, achievements, and combo multipliers

## � Technology Stack

### Frontend
- **React**: UI framework with TypeScript support
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible and customizable component library
- **Lucide**: Modern icon system

### Backend
- **Node.js**: Server runtime for the main backend
- **Express**: Web framework for the REST API
- **MongoDB**: Database for user data and game sessions
- **FastAPI**: Python web framework for the LLM service
- **Transformers**: Hugging Face library for local LLM integration

### AI/ML
- **Google Gemini**: AI model for interactive assistance
- **Local LLM**: Custom-trained model for phishing detection
- **PyTorch**: Deep learning framework for model training

## �🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Python 3.11+ and a virtual environment (recommended for the LLM)
- Modern web browser

### Installation
```powershell
# Clone the repository
git clone https://github.com/ShivashShetty/CyberGuardianQuestXAI.git
cd CyberGuardianQuestXAI

# Install frontend dependencies
npm install

# (optional) Create and activate the Python virtual environment for AI backend
python -m venv .venv
& .venv/Scripts/Activate.ps1

# Install Python dependencies used by the LLM server
pip install fastapi uvicorn transformers torch

```

### Build for Production
```powershell
npm run build
npm run preview
```

## 🧠 LLM & Local Phishing Detection (Recent additions)

This project includes a local LLM-based phishing detection API (FastAPI) used by the `SocialEngineeringDefense` UI component. Recent work added a compact, professional UI and a local FastAPI service that analyzes text for phishing tactics.

Key points:
- The local LLM server runs via `AI-backend/phishing_api.py` and expects a model folder at `AI-backend/phishing_tactics_model/` (local files like `config.json` and `model.safetensors`).
- The FastAPI service listens on port `8082` by default so the frontend can call `http://localhost:8082/analyze-email`.
- The frontend component `src/components/SocialEngineeringDefense.tsx` now shows friendly error messages and troubleshooting tips (no raw "failed to fetch").

## ▶️ Quick run commands (single-command start)

From the project root you can start both the Node backend and the LLM service together using the npm alias:

```powershell
# starts Node backend (MongoDB + Gemini AI) and the local LLM service in parallel
npm start --prefix d:/CyberGuardianQuestXAI
```

Alternative (start each service individually):

```powershell
# Start Node.js backend (run from project root)
npm run start:node --prefix d:/CyberGuardianQuestXAI

# Start the LLM FastAPI server (uses the project venv python)
npm run start:llm --prefix d:/CyberGuardianQuestXAI

# Or run the Python directly (activate venv first):
# & D:/CyberGuardianQuestXAI/.venv/Scripts/Activate.ps1
# D:/CyberGuardianQuestXAI/.venv/Scripts/python.exe AI-backend/phishing_api.py
```

## 🧩 Model & Data Management

### Model Files
The project uses a custom-trained model for phishing detection. To keep the repository size manageable, model files are not stored in the Git repository. You have two options:

1. **Download from Hugging Face (Recommended)**:
   ```powershell
   # First, authenticate with Hugging Face (if the model is private)
   huggingface-cli login
   # Set your HF_TOKEN in AI-backend/.env
   ```
   The code will automatically download the model when first run.

2. **Manual Installation**:
   - Download the model files from our release page
   - Place them in `AI-backend/phishing_tactics_model/`
   - Required files:
     - `model.safetensors`
     - `config.json`
     - `training_args.bin`

### Training and Development
- For model retraining: use `AI-backend/train_phishing_model.py`
- Training data (CSV) is available separately to keep repository size small
- Model checkpoints during training are automatically excluded from Git

## 🩺 Troubleshooting (common errors and fixes)

- "Connection refused / failed to fetch": Make sure both the Node server and LLM FastAPI server are running. Use `npm start --prefix d:/CyberGuardianQuestXAI` or start each individually.
- "ModuleNotFoundError: No module named 'fastapi'": Install Python deps into the virtualenv: `pip install fastapi uvicorn transformers torch` and ensure the venv python is used by `start:llm`.
- "Port already in use" when starting the LLM: The FastAPI server was set to port `8082` to avoid conflicts. If another process uses that port, either stop that process or change the port in `AI-backend/phishing_api.py`.
- "RepositoryNotFoundError / 401 Unauthorized" when transformers tries to download the model: either provide a valid HF token (via `huggingface-cli login` or env var) or place the model files locally under `AI-backend/phishing_tactics_model/`.
- "MongoDB connection error": Ensure `AI-backend/.env` contains a valid `MONGODB_URI` and that the Node server is run from the `AI-backend` directory (the npm scripts already `cd AI-backend` before starting).

## 📚 Documentation

For detailed information about specific aspects of the project, please refer to these documentation files:

- [Architecture Overview](docs/ARCHITECTURE.md): System design and component interactions
- [Game Mechanics](docs/GAME_MECHANICS.md): Detailed explanation of game rules and systems
- [Component Documentation](docs/COMPONENTS.md): Frontend component specifications
- [Development Guide](docs/DEVELOPMENT.md): Setup and contribution guidelines
- [Table of Contents](docs/TABLE_OF_CONTENTS.md): Overview of all documentation

## 🔄 What changed recently

- SocialEngineeringDefense UI: compact card layout, subtle animations, friendly errors, random test phrases, improved threat meter and badges.
- Backend changes: CORS enabled, improved error logging, start scripts updated to run both Node and LLM together, `start` npm alias added.
- LLM server: configured to run on port `8082` and to load a local model by default. Python deps documented.

## 🙏 Acknowledgments

- **shadcn/ui**: Excellent accessible component library
- **Lucide**: Comprehensive and consistent icon system
- **Tailwind CSS**: Utility-first CSS framework enabling rapid development
- **React Team**: Powerful and flexible frontend framework
- **Cybersecurity Community**: Inspiration for educational content and game mechanics

---

**🔐 Securing the future, one game at a time**
- **Font Scales**: Responsive typography with proper contrast ratios

- **Hierarchy**: Clear heading and body text distinctions

- **Accessibility**: WCAG compliant contrast ratios
