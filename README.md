# BringBackOldGames

An app for ranking your favorite games that you want to see be remade or ported to modern platforms.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

## Development

### Backend

#### Start development server

```bash
  supabase start && supabase functions serve
```

#### Migrations

##### Add migration

```bash
  supabase migration new <NAME>
```

##### Apply pending migration files

<https://supabase.com/docs/reference/cli/supabase-migration-up>

```bash
  supabase migration up
```

##### Run migrations on supabase REMOTE

```bash
  supabase db push
```

#### Edge functions

##### Deploy

```bash
  supabase functions deploy
```

### Frontend

```bash
  npm run dev
```
