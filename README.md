# COVID Dashboard

A modern, interactive COVID-19 data visualization dashboard built with React, TypeScript, and Vite.

## Features

- 📊 Interactive charts and data visualization
- 📋 Data table with sorting and filtering
- 📤 CSV file upload functionality
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 📱 Responsive design
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── CovidTable.tsx
│   ├── CovidChart.tsx
│   ├── CsvDataTable.tsx
│   └── FormModal.tsx
│
├── pages/
│   ├── Index.tsx
│   ├── CsvUpload.tsx
│   └── NotFound.tsx
│
├── hooks/
│   └── useCovidData.ts
│
└── lib/
    └── utils.ts
```

## Key Components

### CovidChart.tsx
Handles the visualization of COVID data using Recharts library. Provides interactive charts for displaying trends and statistics.

### CovidTable.tsx
Displays COVID data in a tabular format with sorting, filtering, and pagination capabilities.

### CsvDataTable.tsx
Manages CSV file upload and data display. Handles file parsing and displays uploaded data in a structured table.

### FormModal.tsx
Provides a modal interface for data entry and editing with form validation using React Hook Form and Zod.

### Navbar.tsx
Navigation component with responsive design and routing integration.

## Data Sources

The dashboard supports CSV file uploads for COVID data. Sample data is provided in `test-sample.csv` for testing purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
