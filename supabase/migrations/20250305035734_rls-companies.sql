alter table "public"."companies" enable row level security;
alter table "public"."games_companies" enable row level security;

create policy "Enable read access for all users"
on "public"."companies"
as PERMISSIVE
for SELECT
to public using (true);

create policy "Enable read access for all users"
on "public"."games_companies"
as PERMISSIVE
for SELECT
to public using (true);