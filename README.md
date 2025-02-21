# bringbackoldgames

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
