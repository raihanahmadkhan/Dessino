# Dessino - Digital Drawing Application

Dessino is a modern web-based digital drawing application built with Next.js and React. It features an intuitive canvas interface with various drawing tools, color selection, and the ability to save your artwork.

## Features

- Intuitive drawing tools: pencil, rectangle, circle, eraser, line, and fill
- Color selection with a customizable palette
- Adjustable brush size and opacity
- Undo/redo functionality
- Export canvas as image
- Day/night theme toggle
- Responsive design for various screen sizes

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This project is configured for easy deployment on various platforms:

### Deploy on Vercel

The easiest way to deploy your Dessino app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project into Vercel
3. Vercel will automatically detect Next.js and configure the build settings

### Deploy on Netlify

You can also deploy on Netlify:

1. Push your code to a Git repository
2. Create a new site on Netlify and import your repository
3. Use the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Self-hosting

To self-host the application:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## License

MIT © 2025 Dessino
