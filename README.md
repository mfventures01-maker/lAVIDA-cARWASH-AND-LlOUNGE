# LaVida Carwash & Lounge — Cinematic Hospitality Frontend & BFF Gateway

Built under HOEOS Governance with strict CARSS compliance, data integrity, and evidence-first engineering.

## Architecture Overview

```
[Customer Browser / Android App]
             │
             ▼
[Vite React + TypeScript SPA] ─── (Persistent Zustand Cart & Idempotency Key)
             │
             ▼
[Fullstack Express / Vercel BFF Gateway] (/api/*)
             │
   ┌─────────┴───────────────────────┐
   ▼                                 ▼
[Upstream Google Apps Script]   [Deterministic HOEOS Demo Fixture]
(Probed: currently redirects    (Certified pricing & line-item authority)
 to Google sign-in)
```

## Governance Boundary & Disclaimers

> **DEMO MODE · GOOGLE SHEETS BACKEND · NOT FIREBASE-CERTIFIED**

1. **Price Authority**: The client browser never decides item prices or line totals. All prices and totals are authoritatively calculated and persisted by the backend upon order creation.
2. **Idempotency Protection**: Every order checkout uses a unique `idempotency_key` preserved across retries to prevent duplicate orders.
3. **WhatsApp Order Handoff**: Transmitting the generated order reference via WhatsApp does not prove kitchen acceptance or payment completion.
4. **Android APK**: Prepared for native Android packaging via Capacitor with verified package identifier `com.lavida.carwashandlounge`.

## Deliverables & Components

- **Scene 1: Arrival**: Automotive hero with dramatic lighting, brand identity, and dual CTAs.
- **Scene 2: The Wash**: Detailing packages (The Ceramic Royale, Executive Deep Steam, Signature Foam Wash).
- **Scene 3: The Reveal**: 9H nano-matrix ceramic coating, water-beading hydrophobic effect, and pristine cabin sanctuary.
- **Scene 4: The Grill**: Live charcoal delicacies (Smoked Peppered Asun, Grilled Croaker, Prime Suya Platter, Seafood Boil).
- **Scene 5: Drinks & Lounge**: Macallan 18, Hennessy XO, Dom Pérignon, and handcrafted signature mocktails (Chapman Noir, Hibiscus Royale).
- **Scene 6: Snooker & Game Night**: Championship Strachan slate tables with session booking requests and Game Night with Karaoke.
- **Scene 7: Curated Offers & 3D Carousel**: Showcase event **LAST SATURDAY BIKINI CAR WASH** with date/package transparency and interactive mixed-media 3D carousel.
- **Scene 8: Unified Digital Menu**: Real-time filtering, search, table context, and persistent cart.
- **Checkout & WhatsApp Handoff**: Order confirmation with verified reference, line items, and formatted `wa.me` handoff.
- **Download Modal**: Android APK binary details with installation guide.
- **System Diagnostics**: Real-time probe of upstream Apps Script connectivity and CARSS compliance status.

## Environment Variables (`.env`)

```env
# Google Apps Script Web App Deployment URL
APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec"

# Direct APK Binary Download URL
APK_DOWNLOAD_URL=""

# Business WhatsApp Phone Number (International format without '+')
VITE_WHATSAPP_PHONE="2348030000000"
```

## Commands

- `npm run dev`: Runs the fullstack Express BFF server + Vite dev middleware on port 3000.
- `npm run build`: Compiles the React SPA and bundles the server.
- `npm run test`: Executes automated contract and validation test suite.
- `npm run lint`: Type-checks codebase with `tsc --noEmit`.
