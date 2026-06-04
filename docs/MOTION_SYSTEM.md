# UMQ Motion System

Built on **Framer Motion**.

## Patterns

| Pattern        | Component / utility                     |
| -------------- | --------------------------------------- |
| Section reveal | `FadeUp`, `StaggerList` / `StaggerItem` |
| Hero entrance  | `motion.div` initial opacity/y          |
| Card hover     | `Card` with `hover` + spring `y`        |
| Page headers   | `PageHeader` fade-in                    |
| Mobile nav     | `AnimatePresence` height                |
| FAQ accordion  | `AnimatePresence` on contact            |
| Success state  | spring scale on contact form            |

## Principles

- `once: true` for scroll reveals
- Easing: `[0.22, 1, 0.36, 1]`
- Prefer transform/opacity over layout thrashing
- Stagger delay ~0.04–0.08s between items
