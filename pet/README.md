# Freshers Party 3D Pet

`pet.js` is a self-contained, lazy-loaded Three.js companion. It observes only `fullName`, `course`, and `batch`, and calls `/api/pet-chat` only after meaningful form events.

## Production model assets

Place licensed, web-optimised GLB files at:

- `pet/models/friendly.glb`
- `pet/models/extra-friendly.glb`

Each model should use a consistent scale and include named clips from the approved list in `api/pet-chat.js` (at least `Idle`, `Welcome`, `Happy`/`Smug`, and `Celebrate`). The module automatically uses named GLB clips and same-named facial morph targets when present.

The visual reference calls for two polished, rigged characters—not primitive geometry. `friendly.glb` should be the orange-and-white fox in a cobalt-blue UOW hoodie with headphones/backpack and a welcoming expression. `extra-friendly.glb` should be the same fox universe in a black-and-purple hoodie with cap/sunglasses and a playful smirk. Both need a skeleton, PBR materials, expressive face morph targets, and the required named animation clips. Until real assets are supplied, the controller intentionally shows an asset-fitting notice rather than pretending a primitive model is final.

## AI configuration

Set `OPENAI_API_KEY` and optionally `PET_AI_MODEL` in Vercel. The key is only read by `api/pet-chat.js`. If no key is configured or the provider is unavailable, the endpoint returns a safe contextual fallback response and the registration/payment flow remains unaffected.
