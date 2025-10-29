# Megafi Landing V2

A modern Next.js landing page featuring a stunning scroll hero section with animated text transitions.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Scroll Hero Section** with smooth animations
- **Responsive Design** optimized for all devices
- **Light/Dark Mode** support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
megafi-landing-v2/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with WordHeroPage
│   └── globals.css         # Global styles
├── components/
│   └── ui/
│       └── scroll-hero-section.tsx  # Main hero component
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Component Usage

The `WordHeroPage` component accepts the following props:

- `items`: Array of words to cycle through (default: ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'cook.', 'ship.'])
- `showFooter`: Show/hide footer (default: true)
- `theme`: Theme mode - 'system', 'light', or 'dark' (default: 'system')
- `animate`: Enable view-timeline animations (default: true)
- `hue`: Accent color hue 0-359 (default: 280)
- `startVh`: Where the highlight band starts in vh (default: 50)
- `spaceVh`: Space below the sticky header in vh (default: 50)
- `debug`: Show debug outlines (default: false)
- `taglineHTML`: Custom intro text with HTML support

### Example Usage

```tsx
import { WordHeroPage } from "@/components/ui/scroll-hero-section";

export default function Home() {
  return (
    <WordHeroPage
      items={['create.', 'innovate.', 'launch.', 'succeed.']}
      theme="dark"
      animate
      hue={200}
      taglineHTML={`your journey starts here.<br /><a href="https://example.com">learn more</a>.`}
    />
  );
}
```

## Customization

### Changing Colors

Modify the `hue` prop to change the accent color (0-359):

- Purple/Magenta: 280 (default)
- Blue: 200
- Green: 120
- Red: 0

### Modifying Animation

The component uses CSS View Timeline API for smooth scroll animations. Animations can be disabled by setting `animate={false}`.

### Styling

The component uses scoped styles with `<style jsx global>`. You can customize:

- Grid background in the `body::before` pseudo-element
- Typography with CSS custom properties
- Scroll behavior by adjusting `startVh` and `spaceVh`

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT

