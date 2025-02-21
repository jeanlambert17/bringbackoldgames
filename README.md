# BringBackOldGames

An app for ranking your favorite games that you want to see be remade or ported to modern platforms.

## Features

- Rank your favorite games.
- Responsive design for all devices.

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

##### Deploy edge functions

```bash
  supabase functions deploy
```

##### Run migrations on supabase

```bash
  supabase db push
```

### Frontend

```bash
  npm run dev
```
