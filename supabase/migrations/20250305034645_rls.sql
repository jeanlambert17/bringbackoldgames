alter table "public"."user_votes" enable row level security;
alter table "public"."games" enable row level security;
alter table "public"."platforms" enable row level security;
alter table "public"."genres" enable row level security;
alter table "public"."games_platforms" enable row level security;
alter table "public"."games_genres" enable row level security;


create policy "Enable read access for all users"
on "public"."user_votes"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable read access for all users"
on "public"."games"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable read access for all users"
on "public"."platforms"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable read access for all users"
on "public"."genres"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable read access for all users"
on "public"."games_platforms"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable read access for all users"
on "public"."games_genres"
as PERMISSIVE
for SELECT
to public
using (true);