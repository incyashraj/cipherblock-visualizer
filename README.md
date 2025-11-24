# CipherBlock Visualizer

CipherBlock Visualizer is an interactive educational tool designed to help users understand the inner workings of cryptographic algorithms. Built with React and TypeScript, this application provides visual demonstrations of block ciphers, stream ciphers, and fundamental cryptographic concepts.

## Features

- **Algorithm Visualizers**:
  - **Block Ciphers**: Visualize AES and DES encryption processes.
  - **Stream Ciphers**: Explore RC4 and LFSR (Linear Feedback Shift Register) mechanisms.
  - **Birthday Attack**: Visualize the probability of collisions.

- **Concept Visualizers**:
  - **Avalanche Effect**: See how a single bit change in input affects the output.
  - **S-Box Visualization**: Interactive demonstration of Substitution Boxes.
  - **Round Visualization**: Step-by-step breakdown of encryption rounds.

- **Interactive Lessons**: Structured lessons to guide you through cryptographic topics.
- **Real-time Encryption**: Encrypt and decrypt text with custom keys and initialization vectors (IVs).
- **Analytics**: Track algorithm usage and learning progress.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (Tailwind CSS classes inferred from usage) / Custom Styles
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cipherblock-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/App.tsx`: Main application component.
- `src/components/`: UI components for visualizers, controls, and layout.
- `src/utils/`: Cryptographic utility functions and logic.
- `src/data/`: Static data for lessons and facts.

## License

[MIT](LICENSE)
