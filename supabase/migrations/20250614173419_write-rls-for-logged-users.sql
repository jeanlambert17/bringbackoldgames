-- Create policies
create policy "Authenticated users can create games"
on "public"."games"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create genres"
on "public"."genres"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create games_genres"
on "public"."games_genres"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create platforms"
on "public"."platforms"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create games_platforms"
on "public"."games_platforms"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create companies"
on "public"."companies"
as PERMISSIVE
for insert
to authenticated
with check (true);

create policy "Authenticated users can create games_companies"
on "public"."games_companies"
as PERMISSIVE
for insert
to authenticated
with check (true);

-- Update policies
create policy "Authenticated users can update games"
on "public"."games"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update genres"
on "public"."genres"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update games_genres"
on "public"."games_genres"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update platforms"
on "public"."platforms"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update games_platforms"
on "public"."games_platforms"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update companies"
on "public"."companies"
as PERMISSIVE
for update
to authenticated
using (true);

create policy "Authenticated users can update games_companies"
on "public"."games_companies"
as PERMISSIVE
for update
to authenticated
using (true);