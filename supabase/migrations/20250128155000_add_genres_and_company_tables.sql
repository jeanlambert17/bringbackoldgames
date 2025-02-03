-- Create genres table
CREATE TABLE genres (
    id bigint PRIMARY KEY,
    name text NOT NULL
);

-- Create companies table
CREATE TABLE companies (
    id bigint PRIMARY KEY,
    name text NOT NULL,
    logo_url text
);

-- Create join table for games and genres
CREATE TABLE games_genres (
    game_id bigint REFERENCES games(id) ON DELETE CASCADE,
    genre_id bigint REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

-- Create join table for games and companies
CREATE TABLE games_companies (
    game_id bigint REFERENCES games(id) ON DELETE CASCADE,
    company_id bigint REFERENCES companies(id) ON DELETE CASCADE,
    is_publisher boolean DEFAULT false,
    is_developer boolean DEFAULT false,
    is_porting boolean DEFAULT false,
    is_supporting boolean DEFAULT false,
    PRIMARY KEY (game_id, company_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_games_genres_game_id ON games_genres(game_id);
CREATE INDEX idx_games_genres_genre_id ON games_genres(genre_id);
CREATE INDEX idx_games_companies_game_id ON games_companies(game_id);
CREATE INDEX idx_games_companies_company_id ON games_companies(company_id);
