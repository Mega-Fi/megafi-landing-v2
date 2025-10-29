# MegaFi Landing Page

A modern Next.js landing page featuring a beautiful animated tubelight navbar with MegaFi brand colors.

## 🎨 Brand Colors

- **Background:** Pure Black (`#000000`) - Main background
- **Primary (Night Sky):** `#19191A` - Card backgrounds and secondary elements
- **Secondary (Full Moon):** `#DFD9D9` - Text, UI elements, and accents

## ✨ Features

- **Animated Tubelight Navbar:** Smooth animated navigation with a glowing tubelight effect that follows the active tab
- **Responsive Design:** Mobile-first approach with adaptive layouts
- **Minimal Dark Design:** Pure black background with monochrome aesthetic
- **TypeScript:** Fully typed for better developer experience
- **Tailwind CSS:** Utility-first styling with custom brand color configuration
- **Framer Motion:** Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
megafi-landing/
├── app/
│   ├── globals.css          # Global styles with brand color variables
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page
├── components/
│   └── ui/
│       └── tubelight-navbar.tsx  # Animated navbar component
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── tailwind.config.ts        # Tailwind configuration with brand colors
└── tsconfig.json             # TypeScript configuration
```

## 🎯 Key Components

### Tubelight Navbar

The navbar component (`components/ui/tubelight-navbar.tsx`) features:
- Smooth animated tab indicator with tubelight glow effect
- Responsive design (text on desktop, icons on mobile)
- Built with Framer Motion for fluid animations
- Minimal monochrome design
- Fully customizable via props

Usage:
```tsx
import { Home, User, Briefcase, FileText } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

const navItems = [
  { name: "Home", url: "#", icon: Home },
  { name: "About", url: "#", icon: User },
  { name: "Projects", url: "#", icon: Briefcase },
  { name: "Resume", url: "#", icon: FileText },
]

<NavBar items={navItems} />
```

## 🎨 Customizing Colors

Brand colors are configured in two places:

1. **Tailwind Config** (`tailwind.config.ts`):
```typescript
colors: {
  "night-sky": "#19191A",
  "full-moon": "#DFD9D9",
}
```

2. **CSS Variables** (`app/globals.css`):
```css
.dark {
  --primary: 0 4% 87%;          /* Full Moon */
  --secondary: 240 2% 10%;      /* Night Sky */
  --foreground: 0 4% 87%;       /* Full Moon */
  --background: 0 0% 0%;        /* Pure Black */
}
```

Use them in your components:
```tsx
<div className="bg-black text-full-moon">
  <button className="bg-full-moon hover:bg-full-moon/90 text-black">
    Click me
  </button>
</div>
```

## 📦 Dependencies

- **next**: ^15.0.0 - React framework
- **react**: ^18.3.1 - UI library
- **framer-motion**: ^11.0.0 - Animation library
- **lucide-react**: ^0.344.0 - Icon library
- **tailwindcss**: ^3.4.0 - CSS framework
- **typescript**: ^5 - Type safety

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 Notes

- The navbar is positioned at the top on larger screens and bottom on mobile devices
- All animations use `framer-motion` for smooth, performant transitions
- The design system is built with shadcn/ui principles for consistency
- Brand colors are accessible throughout the project via Tailwind utilities

## 🎨 Design Features

- **Pure black background** for maximum contrast
- **Monochrome aesthetic** using only Night Sky and Full Moon
- **Subtle hover effects** with Full Moon highlights
- **Shadow effects** for depth and modern look
- **Transform animations** for interactive elements
- **Responsive grid layouts** for content cards

## 🚀 Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

The build will be optimized and ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS

