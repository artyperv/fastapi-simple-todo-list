# Todo List Frontend

A modern, responsive frontend for a Todo list application built with React, TypeScript, and Vite. This project is part of a full-stack Todo application with a FastAPI backend.

## Features

- Modern UI with Emotion styling
- Type-safe API integration using OpenAPI
- Form handling with React Hook Form and Zod validation
- State management with React Query
- Routing with TanStack Router
- Phone number input support
- Optimized build with Vite
- Docker support for containerization

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Emotion
- **State Management**: React Query
- **Routing**: TanStack Router
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios + OpenAPI
- **Package Manager**: pnpm

## Prerequisites

- Node.js (LTS version recommended)
- pnpm 9.15.1 or later

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm generate-client` - Generate TypeScript client from OpenAPI spec

## Development

### API Client Generation

The project uses OpenAPI for type-safe API integration. To generate the API client:

```bash
pnpm generate-client
```

This will:
1. Merge OpenAPI specifications using `openapi-merge-cli`
2. Generate TypeScript client code using `openapi-ts`

### Building for Production

To create a production build:

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Docker Support

The project includes a Dockerfile for containerization. To build and run the Docker container:

```bash
docker build -t todo-frontend .
docker run -p 80:80 todo-frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
