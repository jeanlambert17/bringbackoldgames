create function increment_votes() returns trigger as $$
begin
  update games
  set votes = votes + 1
  where id = NEW.game_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_vote_added
  after insert on user_votes
  for each row
  execute function increment_votes();

create function decrement_votes() returns trigger as $$
begin
  update games
  set votes = votes - 1
  where id = NEW.game_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_vote_deleted
  after delete on user_votes
  for each row
  execute function increment_votes();
