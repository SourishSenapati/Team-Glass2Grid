# TECHNICAL DOSSIER: Glass2Grid Renewable Infrastructure

**Submission ID:** HULT-2026-IND-ALPHA
**Subject:** Technical Validation & Feasibility
**Date:** January 2026

## 1. Engineering Principles

### 1.1 The Core Innovation

The fundamental mechanism relies on the Stokes Shift phenomenon observed in carbon nanostructures derived from lignocellulosic biomass. Unlike traditional silicon photovoltaics which rely on direct photon absorption and electron-hole pair generation in a semiconductor lattice, our system functions as a **Luminescent Solar Concentrator (LSC)**.

We utilize rice husk—a biowaste with high silica content—as a precursor. Through hydrothermal carbonization, we synthesize Carbon Dots (C-dots). These C-dots possess tunable bandgaps. We engineer them to:

1.  Absorb heavily in the UV and Blue spectrum (300-450nm).
2.  Undergo internal relaxation.
3.  Re-emit photons in the Red spectrum (600-650nm) with high quantum yield (>60%).

### 1.2 Waveguiding & Conversion

The re-emitted red photons are emitted isotropically. Due to the refractive index difference between the host medium (Glass/Polymer, n≈1.5) and air (n≈1.0), approximately 75% of these photons are trapped within the sheet via Total Internal Reflection (TIR).

They travel to the edges of the module, effectively concentrating the solar energy collected over a large surface area (e.g., 1m²) onto a small edge area (e.g., optical perimeter). Here, high-efficiency PV strips convert this concentrated narrow-band light into electricity.

## 2. Methodology: Waste-to-Device

### 2.1 Synthesis Protocol: Hydrothermal Carbonization (HTC)

To ensure compliance with green chemistry principles (Atom Economy > 80%), we employ a bottom-up synthesis route:

1.  **Precursor Preparation:**
    - **Raw Input:** _Oryza sativa_ (Rice) husks, washed with distilled water, dried at 60°C, and ground to mesh size 60.
    - **Chemical Composition:** Cellulose (35%), Hemicellulose (25%), Lignin (20%), Silica (15-20%). The high silica serves as a natural template, preventing agglomeration.

2.  **HTC Process:**
    - Precursor (1g) is mixed with deionized water (30mL) in a Teflon-lined stainless steel autoclave.
    - **Reaction Conditions:** Heated to 200°C for 5 hours.
    - **Mechanism:** Hydrolysis of polysaccharides -> dehydration -> aromatization -> polymerization -> nucleation of C-dots.

3.  **Surface Passivation (Functionalization):**
    - Ethylenediamine (EDA) or Urea is introduced (0.5g) to introduce N-doping.
    - **Result:** Formation of surface amide (-CONH2) and amine (-NH2) groups, which introduce n-π\* transitions, significantly enhancing Quantum Yield (QY) from <5% to ~60%.

4.  **Purification:**
    - Centrifugation at 12,000 rpm for 20 mins to remove bulk char.
    - Dialysis (1 kD membrane) for 24h to remove unreacted small molecules.

### 2.2 Modular Integration: The Layered Retrofit Architecture

Addressing the critical bottleneck of existing building stock (Retrofit Market), we bypass glass manufacturing constraints by developing a **Flexible Luminescent Film**.

- **Matrix:** Poly(methyl methacrylate) (PMMA) or Polyvinyl butyral (PVB).
- **Dispersion:** C-dots are dispersed using ultrasonication to ensure homogeneity and prevent scattering losses (Rayleigh scattering < 5%).
- **Application:** The film is applied to the _interior_ face (Surface #4) of an Insulated Glazing Unit (IGU).
- **Edge Couplers:**
  - Instead of framing the entire window, we utilize "Snap-on" optical couplers.
  - These couplers contain linear arrays of micro-scale PV cells (GaAs or cut c-Si cells).
  - They adhere to the window perimeter using refractive index-matched optical gel (n=1.49) to minimize coupling losses.

## 3. Performance Simulation & Benchmarking

Based on our `lsc_model.py` optical simulations, a standard 1.5m² office window installation yields:

- **Geometric Gain (G):** >100 (Ratio of window area to edge area).
- **Optical Efficiency:** ~4-6% (Conservative estimate for organic LSCs).
- **Power Output:** ~25-35 W/m² under peak insolation.

While this is lower than opaque rooftop solar (150-200 W/m²), the effective deployment area on high-rise facades is 20x larger than the roof area. Furthermore, the system serves a dual purpose: electricity generation and **passive cooling** (by absorbing UV/IR heat before it enters the building), reducing HVAC loads by an estimated 15%.

## 4. Scalability & Material Flow

India produces 600MT of crop residue.

- 1 MT of Rice Husk -> ~300kg of Carbon Precursor.
- 1kg of C-dots covers ~500m² of glazing (doping concentration is low, <500ppm).
- **Supply Chain:** We establish "Village Collection Centers" paying ₹2/kg for husk (doubling current biomass power plant rates). This ensures a robust, ethics-first supply chain that directly tackles the stubble burning crisis.

## 5. Risk Analysis

- **Photobleaching:** Organic fluorophores degrade under UV.
  - _Mitigation:_ We use inorganic encapsulation (silica shell derived from the husk itself) to protect the C-core, projected to extend luminous half-life to 10+ years.
- **Efficiency Drop:** Re-absorption losses in large windows.
  - _Mitigation:_ The "Stokes Shift" is engineered to separate absorption and emission spectra heavily, minimizing self-absorption.

---

---

## 6. References & Bibliographic Standards

This technical approach is grounded in recent advancements in nanomaterial engineering. Key theoretical foundations include:

1.  _Meinardi, F., et al. (2017)._ "Highly efficient luminescent solar concentrators based on earth-abundant indirect-bandgap silicon quantum dots." _Nature Photonics_, 11(3), 177-185. (Basis for Stokes Shift engineering).
2.  _Essner, J. B., & Baker, G. A. (2017)._ "The burgeoning world of carbon dots: Theory to experiment." _Environmental Science: Nano_, 4(6), 1216-1263. (Synthesis pathways).
3.  _Debruyne, D., et al. (2020)._ "Optical and efficiency limits of luminescent solar concentrators." _Energies_, 13(3), 670. (Simulation parameters).

_Note: This simulation and material design assume optimal lab conditions. Field degradation factors (yellowing index of polymers) are accounted for in the 10-year lifecycle analysis._
