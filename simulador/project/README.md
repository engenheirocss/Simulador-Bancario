# Mortgage Simulator Application

This is a Next.js application that simulates mortgage financing options from different banks. The application allows users to input property values, down payments, and other relevant information to get financing simulations.

## Features

- Property financing simulation
- Multiple bank comparison
- Support for different amortization systems (PRICE and SAC)
- Detailed installment breakdown
- Print-friendly reports
- User authentication system

## Technologies Used

- Next.js 13.5
- React 18.2
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utility functions and business logic
- `/public` - Static assets

## Deployment

This project is configured for static exports using Next.js's export feature. To build for production:

```bash
npm run build
```

The static files will be generated in the `/out` directory.

## License

MIT