# Codex workflow for KASTONIA ERP

For every future change request in this repository:

1. Start from the current `main` branch: fetch/pull `main` when a remote is configured.
2. Create a new feature/fix branch before changing files.
3. Implement the requested changes without automatically merging into `main`.
4. Run the full validation suite before opening a PR:
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
5. Fix any failures introduced by the change whenever possible.
6. Commit changes on the working branch.
7. Push the branch to GitHub when a remote is available.
8. Open a Draft Pull Request against `main` and share the PR link.

Never automatically merge into `main`.
