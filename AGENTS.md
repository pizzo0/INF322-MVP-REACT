<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Architecture rules

- Prototype data (session, tickets, notifications) lives in `src/lib/usm/store.ts` (localStorage + useSyncExternalStore); there is no backend yet, so keep all persistence behind that module.
- Ticket business rules are pure functions in `src/lib/usm/rules.ts` with tests in `rules.test.ts`; UI must call these instead of re-implementing permissions or timings.
- Signed-in pages wrap their content in `AppShell` (client-side session guard + simulation ticker) rather than a pathless layout route.
