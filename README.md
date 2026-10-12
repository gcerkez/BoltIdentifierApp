# BoltIdentifierApp

**BoltIdentifierApp** is a React Native mobile application for precision bolt identification, measurement, and classification. It turns a smartphone camera into a digital optical comparator and caliper tool. By placing a known reference item (such as a coin, ID/credit card, or calibrated gauge) beside a fastener, the app accurately computes scale, measures shank diameter, total length, socket drive size, and thread pitch, classifies the bolt head geometry, and matches the fastener against standard **ISO Metric** and **UTS Imperial / SAE** fastener tables.

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [How It Works](#how-it-works)
  - [1. Optical Calibration](#1-optical-calibration)
  - [2. Thread Pitch & Dimension Analysis](#2-thread-pitch--dimension-analysis)
  - [3. Standard Fastener Matching](#3-standard-fastener-matching)
- [Screens](#screens)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Running Unit Tests & Quality Checks](#running-unit-tests--quality-checks)
- [Containerized Tooling (Docker & Podman)](#containerized-tooling-docker--podman)
  - [Building the Container](#building-the-container)
  - [Running Containerized Checks](#running-containerized-checks)
  - [Docker Compose Services](#docker-compose-services)
- [CI/CD Workflow](#cicd-workflow)
- [Contributing & License](#contributing--license)

---

## Features

- **Optical Caliper & Calibration Reticle**:
  - Calibrate pixel-to-millimeter scale ($\text{px/mm}$) using everyday reference objects (coins, credit cards, washers, or custom tokens).
  - Fine-grained caliper controls with multi-step nudge buttons ($\pm 10\,\text{px}$, $\pm 2\,\text{px}$) for pinpoint bounding alignment.
- **Computer Vision & Signal Processing**:
  - **Thread Spacing**: Autocorrelation algorithm analyzes periodic luminance profiles across the bolt shank to extract thread pitch and Threads Per Inch (TPI).
  - **Shank Diameter & Length**: High-precision boundary measurement across user-adjustable caliper guides.
  - **Head Type Classification**: Geometric aspect-ratio and contour classifier identifying Hex, Socket Head Cap (Allen), Flat Countersunk, Pan Head, and Flange Hex.
  - **Socket Size Estimation**: Computes drive/wrench clearance based on head dimensions and nominal standard tables.
- **Fastener Standards Database**:
  - Full support for **ISO Metric** (M3 through M20 coarse & fine pitches) and **UTS Imperial / SAE** (#4 through 1/2" UNC/UNF).
  - Weighted multi-parameter confidence scoring (0–100%) factoring in diameter, length tolerance, pitch compatibility, and head profile.
- **Unit Conversion Engine**:
  - Dynamic conversion between Millimeters (`mm`), Centimeters (`cm`), Inches (`in` - decimal and fractions e.g. `1/4"`, `3/8"`, `1-1/2"`), Feet (`ft`), and `TPI`.
- **Reference Item Management**:
  - Pre-calibrated library of US coins (Quarter, Penny, Nickel, Dime), EU coins (1€, 2€), standard ID/credit cards, and 10mm hex nuts.
  - Custom reference creator with category filtering and persistent storage.
- **Scan History & Engineering Notes**:
  - Persisted history of bolt measurements and match results.
  - Search by standard name, date, or custom notes.
  - Copy formatted engineering fastener specifications directly to clipboard.
- **Production Tooling & Tests**:
  - 100% passing test suite across 11 test suites covering all services, utilities, and UI components.
  - Containerized with Docker / Podman.
  - Automated GitHub Actions CI pipeline.

---

## Architecture & Tech Stack

```
BoltIdentifierApp/
├── __tests__/                  # Unit and integration test suites (11 suites, 51 tests)
│   ├── App.test.tsx
│   ├── BoltMatchBadge.test.tsx
│   ├── BoltMatcherService.test.ts
│   ├── CameraScreen.test.tsx
│   ├── HistoryScreen.test.tsx
│   ├── HistoryService.test.ts
│   ├── ImageProcessingService.test.ts
│   ├── MeasurementCard.test.tsx
│   ├── ReferenceItemsScreen.test.tsx
│   ├── ReferenceItemsService.test.ts
│   └── UnitConverter.test.ts
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── BoltMatchBadge.tsx        # Standard designation badge with confidence score
│   │   ├── CaliperOverlay.tsx        # Interactive calibration reticle & caliper guides
│   │   ├── MeasurementCard.tsx       # Live multi-unit measurement grid
│   │   └── ReferenceItemPicker.tsx   # Reference selection with dimension tags
│   ├── constants/             # Constants and design tokens
│   │   ├── BoltStandards.ts          # ISO Metric & UTS Imperial standard tables
│   │   ├── PredefinedItems.ts        # Built-in reference items (coins, cards, nuts)
│   │   └── Theme.ts                  # Typography, spacing, colors, and shadows
│   ├── screens/               # Main application screens
│   │   ├── CameraScreen.tsx          # Fastener capture, calipers, and analysis
│   │   ├── HistoryScreen.tsx         # Scan history, search, and spec viewer
│   │   └── ReferenceItems.tsx        # Reference item manager and custom creator
│   ├── services/              # Business logic & algorithms
│   │   ├── BoltMatcherService.ts     # Standard matching & scoring engine
│   │   ├── CameraService.ts          # Camera/gallery intake & permissions
│   │   ├── HistoryService.ts         # AsyncStorage scan persistence & formatting
│   │   ├── ImageProcessingService.ts # CV pipeline, autocorrelation pitch & head classifier
│   │   └── ReferenceItemsService.ts  # Reference items CRUD & validation
│   ├── styles/                # Screen-specific StyleSheet definitions
│   └── utils/                 # Utility functions
│       ├── CommonHelper.ts           # ID generator & text utilities
│       └── UnitConverter.ts          # 2-way unit conversions & fraction parsing
├── scripts/                   # Container runner scripts
│   ├── container-build.sh            # Universal Podman / Docker build script
│   └── container-test.sh             # Universal Podman / Docker test runner
├── .github/workflows/         # Continuous integration
│   └── ci.yml                        # GitHub Actions CI workflow
├── Dockerfile                 # Node 20 reproducible container environment
└── docker-compose.yml         # Compose configuration (test, lint, typecheck, dev)
```

---

## How It Works

### 1. Optical Calibration
A known physical reference object is placed in the camera field of view on the same focal plane as the bolt. The user aligns the calibration reticle to the reference object's bounding dimensions. The scale factor is computed as:
$$\text{Scale} = \frac{\text{Pixel Dimension}}{\text{Reference Nominal Dimension (mm)}} \quad (\text{px/mm})$$

### 2. Thread Pitch & Dimension Analysis
- **Caliper Extraction**: Caliper reticle coordinates are mapped into world millimetric dimensions using the calibrated scale factor.
- **Autocorrelation Pitch Estimation**: Thread crests and roots create a spatial luminance wave along the bolt shaft. The algorithm computes the discrete autocorrelation:
$$R_{xx}[k] = \sum_{n} x[n] \, x[n+k]$$
The lag $k$ corresponding to the first prominent harmonic peak identifies the fundamental thread period in pixels, which is converted to millimetric pitch ($\text{mm}$) and imperial Threads Per Inch:
$$\text{TPI} = \frac{25.4}{\text{Pitch (mm)}}$$
- **Head Geometry Classification**: The head region's width-to-height aspect ratio and top contour gradient classify the profile into standard head types (Hex, Socket Head Cap, Countersunk, Pan, Flange).

### 3. Standard Fastener Matching
Measurements are evaluated against ISO Metric and UTS Imperial standards tables using a weighted Euclidean-like scoring model:
- **Diameter Score**: Evaluated against nominal major diameters with $\pm 0.6\,\text{mm}$ standard tolerance window.
- **Pitch Match**: Matches coarse/fine standard pitch tables; penalizes pitch deviations.
- **Length Score**: Proximity to standard catalog length increments (e.g. 10, 12, 16, 20, 25, 30mm, or 1/2", 3/4", 1", etc.).
- **Head Type Compatibility**: Matches detected profile to standard specifications.

---

## Screens

1. **Camera Screen**:
   - Live photo capture and gallery import.
   - Reference selector with preview dimensions.
   - Interactive optical caliper with multi-step nudge buttons.
   - Instant live measurement card and standard match badge.
   - Save scan directly to history.
2. **Reference Items Screen**:
   - Filter by category: All, Coins, Cards, Custom.
   - Add custom reference objects with custom width, height, and unit.
   - Delete custom reference items.
3. **History Screen**:
   - Chronological list of previous fastener analyses.
   - Search bar filtering by bolt designation, notes, or date.
   - Fastener spec modal with one-tap clipboard copying.
   - Clear all or delete individual entries.

---

## Getting Started

### Prerequisites
- Node.js (>= 18.x)
- npm (>= 9.x)
- React Native CLI (optional for native runs)
- Podman or Docker (optional for containerized runs)

### Local Installation

```bash
# Clone the repository
git clone https://github.com/gcerkez/BoltIdentifierApp.git
cd BoltIdentifierApp

# Switch to the feature branch
git checkout feature/refactor-and-tooling

# Install dependencies
npm ci
```

### Running Unit Tests & Quality Checks

```bash
# Run unit tests
npm test

# Run tests with code coverage report
npm run test:coverage

# Run TypeScript typecheck
npm run typecheck

# Run ESLint
npm run lint
```

---

## Containerized Tooling (Docker & Podman)

The project includes first-class support for running development checks inside containers without needing a local Node.js setup. Scripts automatically detect and use either **Podman** or **Docker**.

### Building the Container

```bash
# Using the helper script
./scripts/container-build.sh

# Or via npm script
npm run container:build

# Or directly with Podman / Docker
podman build -t bolt-identifier-app .
# docker build -t bolt-identifier-app .
```

### Running Containerized Checks

```bash
# Run full suite (tests, typecheck, lint) inside container
./scripts/container-test.sh

# Or run specific commands inside the container
./scripts/container-test.sh npm test
./scripts/container-test.sh npm run test:coverage
./scripts/container-test.sh npm run typecheck
./scripts/container-test.sh npm run lint
```

### Docker Compose Services

```bash
# Run unit tests
docker-compose run --rm test

# Run test coverage
docker-compose run --rm coverage

# Run type checking
docker-compose run --rm typecheck

# Run linter
docker-compose run --rm lint

# Start Metro bundler in container (mapped to port 8081)
docker-compose up dev
```

---

## CI/CD Workflow

Continuous Integration is configured via GitHub Actions (`.github/workflows/ci.yml`). On every push and pull request, the CI pipeline automatically:
1. Installs dependencies using clean install (`npm ci`).
2. Runs ESLint across the codebase (`npm run lint`).
3. Runs TypeScript strict type validation (`npm run typecheck`).
4. Executes the full Jest test suite with coverage (`npm run test:coverage`).

---

## Contributing & License

Contributions are welcome! Please submit a pull request or open an issue on GitHub.

This project is licensed under the [MIT License](LICENSE).
