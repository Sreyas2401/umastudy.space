# UMassStudy.space

UMassStudy.space is a web app designed to help UMass Amherst students find optimal study spots on campus. By providing real-time information on space availability, peak times, and open classrooms, students can always locate a productive environment.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## Tech Stack
- [Next.js](https://nextjs.org/) - Framework for server-rendered React applications.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for responsive design.
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript for reliable, maintainable code.
- [bun](https://bun.sh) - JS runtime.

## Features
- **Real-time Availability:** Shows open classrooms and study spaces, updated in real-time.
- **Peak Time Indicators:** Displays times when spaces are typically busiest.
- **3D Interactive Map:** Uses Mapbox GL for a 3D view of campus buildings with interactive layers.
- **Future Study Groups** (coming soon): Allows students to form study groups with classmates.

## Setup and Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/umastudy.space.git
   cd umastudy.space
   ```
2. **Install dependencies**
    ```npm install```
3. **Set up environment variables**
    ```
    NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_key
    NEXT_PUBLIC_25LIVE_API_KEY=your_25live_key
    ```
4. **Run the development server**
    ```bun run dev```

## Usage
- Visit the homepage to see available study spots, peak times, and classroom availability.
- Use the 3D campus map to navigate and find study spots by location.

## Future Enhancements
- **Study Groups:** Allow students to join or form study groups within their classes.
- **Additional Map Layers:**  Integrate layers for quiet zones, crowd density, and study styles.