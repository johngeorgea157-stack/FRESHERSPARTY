# Freshers Party 3D Pet

`pet.js` is a self-contained, lazy-loaded Three.js companion. It observes only `fullName`, `course`, and `batch`, and calls `/api/pet-chat` only after meaningful form events.

## Production model assets

Place licensed, web-optimised GLB files at:

- `pet/models/friendly.glb`
- `pet/models/extra-friendly.glb`

Each model should use a consistent scale and include named clips from the approved list in `api/pet-chat.js` (at least `Idle`, `Welcome`, `Happy`/`Smug`, and `Celebrate`). The module automatically uses named GLB clips when present. Until those licensed assets are supplied, it renders a lightweight real-time Three.js fox prototype so the integration, speech, state handling, and responsive safe overlay can be tested without a static image substitute.

## AI configuration

Set `OPENAI_API_KEY` and optionally `PET_AI_MODEL` in Vercel. The key is only read by `api/pet-chat.js`. If no key is configured or the provider is unavailable, the endpoint returns a safe contextual fallback response and the registration/payment flow remains unaffected.
