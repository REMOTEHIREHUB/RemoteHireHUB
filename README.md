# Remote Job Aggregation Platform

A modern remote job board aggregating listings from multiple sources.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Features

- Job aggregation from multiple sources
- Advanced search and filtering
- Blog/Content management system
- Admin dashboard
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- A Supabase account and project

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
remotehirehub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── remote-jobs/       # Job listings page
│   │   ├── remote-job/[slug]/ # Individual job page
│   │   ├── blog/              # Blog pages
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── jobs/             # Job-related components
│   │   ├── blog/             # Blog-related components
│   │   ├── layout/           # Layout components
│   │   └── shared/           # Shared components
│   ├── lib/                  # Utilities and helpers
│   │   ├── supabase/         # Supabase client configuration
│   │   └── utils/            # Utility functions
│   └── types/                # TypeScript type definitions
└── public/                   # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.local.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Development Status

This project is currently in the initial setup phase. Core features will be implemented in upcoming phases.

## License

ISC
