// Physics Constants
const SOLAR_CONST = 1000; // W/m2
const EFFICIENCY_BASE = 0.05; // 5% base efficiency for organic LSC (conservative)
const WASTE_KG_PER_M2 = 2.5; // kg of husk needed per m2 of glass
const FARMER_PAY_PER_KG = 15; // INR
const CO2_SAVED_PER_KWH = 0.82; // kg CO2 (India grid average)

class Simulation {
  constructor() {
    this.area = 10; // m2
    this.hours = 5; // peak sun hours
    this.clarity = 70; // % transmission

    // DOM Elements
    this.areaInput = document.getElementById("areaRange");
    this.hoursInput = document.getElementById("hoursRange");

    // Output Elements
    this.powerOutEl = document.getElementById("powerOut");
    this.energyOutEl = document.getElementById("energyOut");
    this.wasteUtilEl = document.getElementById("wasteUtil");
    this.farmerIncEl = document.getElementById("farmerInc");
    this.co2SavedEl = document.getElementById("co2Saved");

    this.init();
  }

  init() {
    // Event Listeners
    this.areaInput.addEventListener("input", (e) => {
      let val = parseFloat(e.target.value);
      // Reliability: Clamp values to prevent UI breaking
      if (val < 1) val = 1;
      if (val > 10000) val = 10000;
      this.area = val;
      document.getElementById("areaVal").textContent = this.area + " m²";
      this.update();
    });

    this.hoursInput.addEventListener("input", (e) => {
      let val = parseFloat(e.target.value);
      if (val < 0) val = 0; 
      if (val > 24) val = 24;
      this.hours = val;
      document.getElementById("hoursVal").textContent = this.hours + " hrs";
      this.update();
    });

    // Initial run
    this.update();
  }

  calculate() {
    // RIGOROUS PHYSICS MODEL (Based on Stokes Shift & Geometric Gain)
    // -------------------------------------------------------------
    // Constants from Lab Data (Technical Dossier)
    const QUANTUM_YIELD = 0.65; // 65% (N-doped Carbon Dots)
    const REFLECTION_LOSS = 0.04; // 4% surface reflection
    const ABSORPTION_EFF = 0.40; // 40% spectrum capture (UV/Blue)
    const TRAPPING_EFF = 0.75; // 75% Total Internal Reflection (n=1.5 glass)
    const SCATTERING_LOSS = 0.10; // 10% matrix imperfection
    const PV_STRIP_EFF = 0.20; // 20% efficiency of edge-mounted strips

    // 1. Geometric Gain (G)
    // G = Area_face / Area_edges
    // Assuming a standard pane thickness of 6mm (0.006m)
    // We approximate the pane as a square for the given Area
    const sideLength = Math.sqrt(this.area);
    const thickness = 0.006;
    const areaFace = this.area;
    const areaEdges = 4 * sideLength * thickness;
    const geometricGain = areaFace / areaEdges;

    // 2. Optical Efficiency (n_opt)
    // n_opt = (1-R) * Abs * QY * Trap * (1-Scat)
    const opticalEfficiency = (1 - REFLECTION_LOSS) * 
                              ABSORPTION_EFF * 
                              QUANTUM_YIELD * 
                              TRAPPING_EFF * 
                              (1 - SCATTERING_LOSS);

    // 3. Power Output
    // Power = Solar_Input * Optical_Eff * PV_Eff
    // Note: In LSCs, the high geometric gain "concentrates" light to the edges.
    // Total Power = Solar_Const * Area * Optical_Eff * PV_Eff
    const totalSolarInput = this.area * SOLAR_CONST;
    const powerW = totalSolarInput * opticalEfficiency * PV_STRIP_EFF;
    
    // Annual Energy (Standard Formula)
    const dailyEnergyWh = powerW * this.hours;
    const annualEnergyKWh = (dailyEnergyWh * 365) / 1000;

    // Impact Calculations
    const wasteUsedKg = this.area * WASTE_KG_PER_M2;
    const farmerIncome = wasteUsedKg * FARMER_PAY_PER_KG;
    const co2Saved = annualEnergyKWh * CO2_SAVED_PER_KWH;

    return {
      powerKW: (powerW / 1000).toFixed(2),
      energyMWh: (annualEnergyKWh / 1000).toFixed(2),
      wasteTonnes: (wasteUsedKg / 1000).toFixed(3),
      incomeINR: Math.round(farmerIncome).toLocaleString(),
      co2Tonnes: (co2Saved / 1000).toFixed(2),
      // debug: { geometricGain: geometricGain.toFixed(1), optEff: (opticalEfficiency*100).toFixed(1) + "%" }
    };
  }

  update() {
    const data = this.calculate();

    // Animate numbers (simple text update for now)
    this.powerOutEl.textContent = data.powerKW;
    this.energyOutEl.textContent = data.energyMWh;
    this.wasteUtilEl.textContent = data.wasteTonnes;
    this.farmerIncEl.textContent = "₹" + data.incomeINR;
    this.co2SavedEl.textContent = data.co2Tonnes;

    // Visual updates
    this.updateVisualizer();
  }

  updateVisualizer() {
    // Dynamic opacity based on "Clarity" or power...
    // For now, just a placeholder function
    const frame = document.querySelector(".window-frame");
    // Example: Make it glow more if area is high
    frame.style.boxShadow = `0 0 ${this.area * 2}px rgba(255, 50, 50, 0.4)`;
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  new Simulation();
});
