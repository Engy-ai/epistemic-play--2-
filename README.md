<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
npm run dev

## Installation & Setup

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 8.0.0
- A [Google Gemini API key](https://ai.google.dev/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/epistemic-play.git
   cd epistemic-play
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy or create a `.env.local` file in the project root
   - Add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Troubleshooting

- **Node version error:** Ensure you're using Node 20+. Use `nvm use 20` if installed.
- **API key error:** Verify your Gemini API key is correctly set in `.env.local`
- **Port already in use:** Modify the port in `vite.config.ts` if 5173 is taken
