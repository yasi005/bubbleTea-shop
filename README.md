# Bubble Tea Boutique

A warm, sunlit bubble tea storefront — portfolio-ready with an optimized 3D pipeline, React Spring physics, and cozy UI polish.

## Routes

| Route | Experience |
|-------|------------|
| `/` | 3D hero, flavor picker, buttery spin + color swap |
| `/menu` | 2D grid (no WebGL — browser gets a break) |
| `/drink/:id` | Interactive 3D cup + customization |
| `/basket` | Cart with derived total + confetti checkout |
| `/favorites` | Heart-saved drinks |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 1. The 3D Asset Pipeline

### Step 1 — Source & compress

Place your raw model at `public/models/source/boba-cup.glb`, then run Draco compression:

```bash
npm run optimize-model
```

This outputs `public/models/boba-cup-draco.glb` — drastically smaller, faster to load.

### Step 2 — gltfjsx code generation

```bash
npm run generate-cup
```

This reads the optimized `.glb` and generates `src/components/three/BobaCupGenerated.tsx` — a pure React component tree of `<mesh>` elements for cup, liquid, straw, etc.

### Step 3 — Wire it up

Name your liquid mesh `Liquid` (or `liquid` / `drink` / `tea`). The scene targets it via `findLiquidMesh()` and updates `material.color` from flavor state.

Until you add a real model, `BobaCupModel.tsx` mirrors the gltfjsx output structure.

---

## 2. Color & Animation (R3F)

- **Dynamic materials** — `liquidColor` prop flows into the `Liquid` mesh material
- **Buttery rotations** — `@react-spring/three` handles spin physics (heavy, premium deceleration)
- **Comfy shadows** — `<ContactShadows>` from Drei (soft blur, no real-time shadow cost)

---

## 3. Global State (`ShopProvider`)

| Cycle | Behavior |
|-------|----------|
| **Load** | `useEffect` on mount reads `localStorage` → hydrates React state |
| **Update** | `addToCart()` / `toggleFavorite()` update state + persist to `localStorage` |
| **Derived** | `cartTotal` loops basket × price — Cart page renders one variable |

---

## 4. Soft UI Details

- Warm brown typography (`#3d3830`) — no pure black
- Peach-tinted shadows (`.shadow-warm`, `.card-warm`)
- Pill buttons with lift-on-hover (`.btn-pill`)
- Framer Motion page transitions via `template.tsx`

## Stack

- Next.js 15 · React Three Fiber · Drei · React Spring
- Tailwind CSS v4 · Framer Motion
- localStorage + React Context

---

## Deploy (GitHub + Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Bubble Tea Boutique"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

`.gitignore` is included — `node_modules`, `.next`, `.env*`, and `.vercel` are not committed.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → import your repository.
3. Vercel auto-detects **Next.js** — leave defaults:
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (automatic)
   - **Install Command:** `npm install`
4. Click **Deploy**.

No environment variables are required for this app (cart/favorites use `localStorage` in the browser).

### Local production check

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to verify the production build before deploying.
