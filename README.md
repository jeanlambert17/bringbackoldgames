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

supabase functions deploy

##### Run migrations on supabase

supabase db push

### Frontend

```bash
  npm run dev
```

## TODO

- Add publicity.
- Add virtualization
- Add dropdown for choosing what the user wants, either remake, remaster, port, etc...
- Save new data (genres, involved companies, ports, remakes, remasters)
- Remove @radix-ui/react-icons (need to update several components to use lucide icons instead)
- Open game modal in url e.g: ?game_id=5833
