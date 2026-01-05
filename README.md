# ToTea - Premium Bubble Tea & Coffee Website

A beautiful, modern Next.js website for ToTea bubble tea cafe in Northern Virginia.

## Features

- 🎨 Beautiful, responsive design with Tailwind CSS
- 🍵 Complete menu showcase (Vietnamese Coffee, Fruit Tea, Matcha, Milk Tea, Slush)
- 🍰 Food menu (Breakfast Bites, All Day Bites, Pastries)
- 📍 Multiple location information with hours
- 📱 Mobile-friendly navigation
- 🛒 Order online integration links
- ⚡ Fast and optimized with Next.js 14

## Getting Started

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

## Project Structure

```
ToTea/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Hero section
│   ├── MenuSection.tsx  # Beverage menu
│   ├── FoodMenu.tsx     # Food menu
│   ├── Locations.tsx    # Location information
│   ├── About.tsx        # About section
│   ├── OrderSection.tsx # Order online section
│   └── Footer.tsx       # Footer
├── package.json
└── tailwind.config.ts   # Tailwind configuration
```

## Customization

### Update Locations
Edit the `locations` array in `components/Locations.tsx`

### Update Menu Items
Edit the `menuData` array in `components/MenuSection.tsx`

### Update Colors
Modify the color scheme in `tailwind.config.ts`

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This Next.js app can be deployed on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)

## License

© 2024 ToTea. All rights reserved.

# ToTea
