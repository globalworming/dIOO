# Repository Guidelines

## Project Structure & Module Organization
- App source lives in `src/`.
- Route-level pages are in `src/pages/` (`Index.tsx`, `DebugModifiers.tsx`, `NotFound.tsx`).
- Reusable UI components are in `src/components/`; shadcn primitives are in `src/components/ui/`.
- State and behavior helpers are split across `src/hooks/`, `src/utils/`, and `src/lib/`.
- Static game/config data is in `src/data/`.
- Public static assets are in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with hot reload.
- `npm run build`: Create a production bundle in `dist/`.
- `npm run build:dev`: Build using development mode flags.
- `npm run preview`: Serve the built output locally.
- `npm run lint`: Run ESLint across `*.ts` and `*.tsx`.

## Coding Style & Naming Conventions
- Use TypeScript + React functional components.
- Use 2-space indentation and keep files ASCII unless existing content requires otherwise.
- Name components and page files in `PascalCase` (`DiceGrid.tsx`), hooks in `camelCase` with `use` prefix (`useAchievements.ts`), and utility modules in `camelCase` (`gameLogic.ts`).
- Prefer path aliases over deep relative imports: `@/components`, `@/hooks`, `@/lib`, `@/utils`.
- Tailwind is the default styling approach; keep shared tokens in `src/index.css` and `tailwind.config.ts`.

## Testing Guidelines
- There is no dedicated automated test suite configured yet.
- Minimum validation for each change: run `npm run lint` and `npm run build`.
- For behavior changes, verify flows in `npm run dev` and document manual test steps in the PR.
- When adding tests later, place them near the feature (`src/**/__tests__`) and use `*.test.ts(x)` naming.

## Commit & Pull Request Guidelines
- Follow the repository’s existing commit style: short, imperative summaries (for example, `add keystone system`, `gate keystone feature`).
- Keep commits scoped to one logical change.
- PRs must include:
  - What changed and why.
  - Linked issue/task when available.
  - Screenshots or short recordings for UI updates.
  - Manual validation steps and commands run (`npm run lint`, `npm run build`).

## Configuration Notes
- TypeScript is intentionally non-strict in this repo; do not enable strict flags in unrelated work.
- ESLint disables `@typescript-eslint/no-unused-vars`; remove dead code intentionally instead of relying on lint errors.
