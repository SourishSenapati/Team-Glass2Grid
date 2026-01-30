# GLASS2GRID // HULT PRIZE 2026

_"Waste isn't waste unless you waste it."_

We are re-engineering the urban skin. **Glass2Grid** isn't just another solar project—it's a material science breakthrough that turns agricultural burning (a massive smog contributor) into localized energy generation for skyscrapers. We take crop residues like rice husk ash, extract high-grade carbon quantum dots, and embed them into optical-grade window glazings.

The result? Windows that generate power and pay farmers, instead of just sitting there.

---

## What's in this Repo?

This is our digital headquarters. You'll find the full stack here—from the verifiable physics models proving our efficiency limits to the interactive pitch deck we're using to close investors.

- **`simulation/`** -> The heavy lifting. Python scripts calculating photon transport efficiency and finding the thermodynamic limits of our N-doped precursors. If you want to check our math (Stern-Volmer Quenching, Stokes Shift), start here.
- **`glass-viz-app/`** -> The face of the operation. This is the React-based investor portal. It runs the real-time impact calculator (Farmer Revenue + Carbon Offset) and the 3D material explorer.

---

## Getting Started

If you're judging this repository or just setting it up for a demo, here is the playbook.

### 1. The "Wow" Factor (Web App)

Don't mess with the CLI if you just want to see the product. This dashboard is what we use for the pitch.

```bash
cd glass-viz-app
npm install
npm run dev
```

> Open the localhost link.

This spins up the full "Lumicore" dashboard. It's connected to live currency APIs, so you can toggle between **USD** and **INR** to see the financial viability in real-time.

### 2. The Science (Python Sim)

For the technical due diligence team who wants to see the raw numbers:

```bash
cd simulation
python lumicore_optimizer.py
```

This spits out our optimization curves (Quantum Yield vs. Concentration). It's based on lab-verified parameters, so these aren't just random numbers—it's a simulation of the actual material physics.

---

## Why We Win

Most teams are building apps. We are building **hard tech with a social supply chain.**

Every square meter of Glass2Grid installed puts direct cash into a rural farmer's pocket for their "waste," stopping the crop burning cycle at the source. We aren't just offsetting carbon—we are rewriting the economic incentives of pollution.

- **Circular Economy:** Farmers get paid. Smog gets stopped. Cities get power.
- **Aesthetic First:** It looks like premium tinted glass, not a science experiment.
- **Bankable:** We've modeled the ROI to make sense for developers even before subsidies.

---

**Principal Maintainer:** Sourish Senapati  
_Built for the 2026 Hult Prize._

_(Note: IP-sensitive datasets in this repo are encrypted at rest. Contact the admin if you need the decryption keys.)_
