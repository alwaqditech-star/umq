# UMQ Design System

## Brand palette (locked)

| Token     | Hex       | Usage                     |
| --------- | --------- | ------------------------- |
| Light     | `#F4FAFB` | Background                |
| Primary   | `#0F244D` | Headings, primary buttons |
| Accent    | `#488695` | CTAs, links, highlights   |
| Secondary | `#2C516E` | Hover, secondary text     |
| Muted     | `#9ABFC4` | Borders, soft UI          |

## Derived tokens

- `--color-primary-deep` — dark surfaces
- Gradient text: `.text-gradient`, `.text-gradient-hero`
- Mesh backgrounds: `MeshBackground` component

## Surfaces

- `.surface-premium` — glass-like cards
- `.card-elevated` — layered shadow + ring
- `.border-gradient` — gradient border frame

## Typography

- Headings: semibold, tight tracking
- Body: `--color-foreground-muted`, relaxed leading
- Section labels: `.section-kicker`

## Spacing

- Container: `.container-umq` (max-w-7xl)
- Sections: `py-20 sm:py-24`
- Cards: `p-6` / `p-8` by size

## Components

See `apps/web/components/ui/*` and `apps/web/components/design/*`.
