// ============================================================================
// GLASS2GRID: HIGH-FIDELITY BROWSER SIMULATION KERNEL
// ============================================================================
// Physics Engine: Stokes-Shift Ray Tracing Approximation
// Precision: Float64
// Version: 2.0.0-Alpha (Hult Prize Edition)
// ============================================================================

class PhysicsEngine {
    constructor() {
        // --- 1. MATERIAL CONSTANTS (Rice Husk Carbon Dots) ---
        // Refractive index of PMMA/Glass matrix
        this.N_MATRIX = 1.495; 
        
        // Quantum Yield (QY): Probability of re-emission after absorption.
        // Enhanced via Nitrogen doping (Amide groups).
        this.QY_CDOTS = 0.68; 
        
        // Stokes Shift Loss: Energy difference between UV absorbed & Red emitted.
        // Abs ~400nm (3.1eV) -> Emit ~600nm (2.06eV) -> Loss ~33%
        this.STOKES_EFF = 0.66; 

        // Spectral Coverage: % of Solar Spectrum (AM1.5) absorbed.
        // Our C-dots absorb UV + Blue + portion of Green.
        this.ABSORPTION_COVERAGE = 0.42;

        // --- 2. WAVEGUIDE LOSS PARAMETERS ---
        // Surface Reflection (Fresnel)
        this.R_LOSS = 0.04; 
        
        // Matrix Scattering (Rayleigh) per meter
        this.SCATTER_COEFF = 0.08; 

        // Waveguide Trapping Efficiency (TIR Limit)
        // eta_trap = sqrt(1 - 1/n^2)
        this.TRAP_EFF = Math.sqrt(1 - (1/Math.pow(this.N_MATRIX, 2))); // ~0.74
    }

    /**
     * Calculates the power output for a given geometry.
     * @param {number} areaSqM - Surface area of the glass.
     * @param {number} sunHours - Peak sun hours.
     */
    compute(areaSqM, sunHours) {
        // A. GEOMETRIC ANALYSIS
        // Assume Aspect Ratio 1.5:1 (Standard Window)
        // W * 1.5W = Area => 1.5W^2 = Area => W = sqrt(Area/1.5)
        const width = Math.sqrt(areaSqM / 1.5);
        const height = width * 1.5;
        const perimeter = 2 * (width + height);
        const thickness = 0.006; // 6mm standard

        // Geometric Gain (G) = A_face / A_edge
        const areaEdge = perimeter * thickness;
        const G = areaSqM / areaEdge;

        // B. OPTICAL PATH ATTENUATION
        // Average path length for a photon to reach the edge.
        // Approx: 0.5 * Diagonal
        const diagonal = Math.sqrt(width*width + height*height);
        const avgPathLen = diagonal * 0.5;

        // Transport Efficiency (Beer-Lambert decay)
        const transportEff = Math.exp(-this.SCATTER_COEFF * avgPathLen);

        // C. TOTAL OPTICAL EFFICIENCY
        // eta_opt = (1-R) * Abs * QY * Stokes * Trap * Transport
        const opticalEff = (1 - this.R_LOSS) * 
                           this.ABSORPTION_COVERAGE * 
                           this.QY_CDOTS * 
                           this.STOKES_EFF * 
                           this.TRAP_EFF * 
                           transportEff;

        // D. ELECTRICAL CONVERSION
        // Edge PV (GaAs or High-Eff Si) Efficiency
        const PV_EFF = 0.22; 
        
        // Input Power (Standard AM1.5)
        const solarInputKW = areaSqM * 1.0; // 1 kW/m2

        // Output Power
        const powerOutputKW = solarInputKW * opticalEff * PV_EFF;

        // E. IMPACT METRICS
        const dailyEnergyKWh = powerOutputKW * sunHours;
        const annualEnergyMWh = (dailyEnergyKWh * 365) / 1000;
        
        // Waste Utilization: 2.5kg husk -> 1m2 film (Yield adjusted)
        const wasteTonnes = (areaSqM * 2.5) / 1000;
        
        // Farmer Income: ₹15/kg
        const incomeINR = (wasteTonnes * 1000) * 15;
        
        // Carbon: 0.82 kg/kWh (India Grid) + Avoided Burning (1.5 kg/kg husk)
        const co2Grid = (dailyEnergyKWh * 365) * 0.82;
        const co2Burning = (wasteTonnes * 1000) * 1.5; // Burning husk releases CO2
        const totalCO2Tonnes = (co2Grid + co2Burning) / 1000;

        return {
            powerKW: powerOutputKW.toFixed(2),
            energyMWh: annualEnergyMWh.toFixed(2),
            wasteTonnes: wasteTonnes.toFixed(3),
            incomeINR: Math.round(incomeINR).toLocaleString(),
            co2Tonnes: totalCO2Tonnes.toFixed(2),
            meta: {
                geometricGain: G.toFixed(1),
                opticalEfficiency: (opticalEff * 100).toFixed(1) + "%",
                avgPath: avgPathLen.toFixed(2) + "m"
            }
        };
    }
}

// UI Controller
class Simulation {
    constructor() {
        this.physics = new PhysicsEngine();
        this.area = 100;
        this.hours = 5;
        
        // Bind UI
        this.areaInput = document.getElementById("areaRange");
        this.hoursInput = document.getElementById("hoursRange");
        
        this.bindEvents();
        this.update();
    }
    
    bindEvents() {
        this.areaInput.addEventListener("input", (e) => {
            this.area = parseFloat(e.target.value);
            document.getElementById("areaVal").textContent = this.area + " m²";
            this.update();
        });
        
        this.hoursInput.addEventListener("input", (e) => {
            this.hours = parseFloat(e.target.value);
            document.getElementById("hoursVal").textContent = this.hours + " hrs";
            this.update();
        });
    }
    
    update() {
        const data = this.physics.compute(this.area, this.hours);
        
        // Update DOM
        document.getElementById("powerOut").textContent = data.powerKW;
        document.getElementById("energyOut").textContent = data.energyMWh;
        document.getElementById("wasteUtil").textContent = data.wasteTonnes;
        document.getElementById("farmerInc").textContent = "₹" + data.incomeINR;
        document.getElementById("co2Saved").textContent = data.co2Tonnes;
        
        // Visualizer Intensity
        const glowOpacity = Math.min(parseFloat(data.powerKW) / 5, 1);
        const rays = document.querySelector('.sun-rays');
        if(rays) rays.style.opacity = 0.3 + (glowOpacity * 0.5);
    }
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
    new Simulation();
});
