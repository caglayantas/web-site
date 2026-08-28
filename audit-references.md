# Technical audit references

- Vite env and mode documentation: https://vite.dev/guide/env-and-mode — `VITE_*` variables are exposed in client bundles; sensitive values should remain server-side; `import.meta.env.DEV` branches can be tree-shaken in production.
- tRPC authorization documentation: https://trpc.io/docs/server/authorization — request context supplies the user and reusable authorization middleware can reject unauthorized calls.
- tRPC middleware documentation: https://trpc.io/docs/server/middlewares — middleware is the recommended reusable boundary for authorization checks.
- Google Search Console sitemap documentation: https://support.google.com/webmasters/answer/7451001 — submitted sitemap status/history is tracked per verified property; robots discovery is separate from report submission.
- react-helmet-async package: https://www.npmjs.com/package/react-helmet-async — request-scoped head management package for asynchronous rendering.
