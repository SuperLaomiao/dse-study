# 2026-03-30 Bilingual Main UI Design

## Goal

Lower the first-use barrier for English beginners by adding a simple Chinese/English UI toggle across the main product paths without restructuring routes or introducing a heavy i18n framework.

## Product Decision

- default language is Chinese on first visit
- users can switch between Chinese and English from the main UI
- the app remembers the user's choice across refreshes and later visits
- the first rollout focuses on the main user journey instead of full-site translation completeness

## Scope

### Included in this slice

- global language toggle in the main header area
- default-to-Chinese behavior for first-time visitors
- persisted language preference using cookie plus browser storage
- bilingual static UI text for the main product surfaces:
  - public landing page
  - sign-in and family onboarding pages
  - learner home, learn, practice, progress, assessment, and review surfaces
  - speaking AI page shell and core UI labels
  - core admin family, alerts, learner detail, and system pages
- bilingual navigation labels shared by learner and admin shells
- test coverage for locale preference behavior and representative bilingual UI rendering

### Deferred

- route-level locale prefixes such as `/zh` and `/en`
- a third language
- full formatting localization for dates, numbers, or time
- automatic translation of AI-generated evaluation content
- exhaustive translation of every low-traffic admin or support surface

## UX Design

### Toggle placement

Place a compact `中文 / EN` switch in the top-right area of the shared header. Public pages that do not already use the shared shell should expose the same control in a visually matching position.

### Toggle behavior

- first visit shows Chinese
- changing language updates the current page immediately
- the selected language stays active after refresh
- the chosen language should be reflected in both client navigation and server-rendered page copy on the next request

### Translation style

- use direct, learner-friendly Chinese instead of literal translation when helpful
- keep English copy intact unless brevity or clarity requires a small adjustment
- preserve the current tone: calm, clear, family-guided, and exam-aware

## Technical Design

### Locale model

Use a lightweight two-value locale model:

- `zh`
- `en`

Resolve locale in this order:

1. cookie value if present
2. fallback to `zh`

Client components should also mirror the selected locale into `localStorage` so client-only hydration can stay aligned with the most recent choice.

### Shared infrastructure

Add a small locale layer rather than a framework migration:

- a locale constants module with supported locales and labels
- a server utility that reads the locale cookie
- a client provider that exposes current locale plus `setLocale`
- a shared translation dictionary organized by app section
- a reusable language toggle component

### Rendering approach

- server pages read the locale cookie and pass translated copy into existing page components
- client components consume the locale provider for interactive labels
- shared navigation should derive labels from translated route metadata instead of hard-coded English strings

This preserves current route structure and existing page composition patterns while still letting the first screen render in the correct language.

## File Boundaries

- `lib/i18n/*`: locale constants, cookie helpers, dictionaries, and lookup helpers
- `components/*`: shared toggle and shell integration
- `app/*`: page-level bilingual content wiring for main-path routes
- `tests/*`: locale helper, shell, and representative page coverage

## Failure Handling

- unsupported or missing locale values fall back to Chinese
- untranslated strings in this rollout should stay readable in English rather than breaking rendering
- the toggle should never block navigation or form submission if client storage is unavailable

## Verification

This slice is healthy when:

- first load renders Chinese in the shared UI without requiring user action
- switching to English updates the main UI and remains selected after refresh
- main navigation labels switch language correctly
- representative learner, public, and admin pages render bilingual static copy from the same locale layer
- targeted tests pass without regressing current app behavior
