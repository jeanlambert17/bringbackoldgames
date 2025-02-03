create table games (
  id bigint primary key,
  name text not null,
  votes bigint default 0,
  release_year integer,
  cover_url text,
  summary text
);

create table platforms (
  id bigint primary key,
  name text not null,
  abbreviation text not null,
  logo_url text
);

create table games_platforms (
  game_id bigint references games(id) on delete cascade,
  platform_id bigint references platforms(id) on delete cascade,
  primary key (game_id, platform_id)
);

create table user_votes (
  id uuid default uuid_generate_v4() primary key,
  game_id bigint references games(id),
  user_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(game_id, user_email)
);