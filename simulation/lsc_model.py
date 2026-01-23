
import numpy as np
import matplotlib.pyplot as plt
import json
import os

# ==========================================
# SIMULATION: Agricultural-Waste Derived LSC
# ==========================================
# This script models the optical performance of a Luminescent Solar Concentrator (LSC)
# using Carbon Dots (C-dots) derived from Rice Husk/Bagasse.

class LSCModel:
    def __init__(self, size_m=(1.0, 1.5), thickness_mm=6.0, concentration_ppm=500):
        self.width = size_m[0]
        self.height = size_m[1]
        self.thickness = thickness_mm / 1000.0  # convert to meters
        self.concentration = concentration_ppm
        
        # Physical Constants
        self.solar_irradiance = 1000.0  # W/m^2 (Standard AM1.5)
        self.glass_refractive_index = 1.5
        
        # Carbon Dot Properties (Simulated based on Hybrid Material Strategy)
        # Absorption peak: Blue/UV (~350-450nm)
        # Emission peak: Red (~600-650nm)
        self.quantum_yield = 0.65  # 65% (Enhanced with Nitrogen dopants)
        self.stokes_shift_efficiency = 0.85 # Energy loss due to wavelength shift
        
    def calculate_geometric_gain(self):
        """
        Geometric Gain (G) = Area_gathering / Area_edges
        """
        area_face = self.width * self.height
        area_edges = 2 * (self.width + self.height) * self.thickness
        return area_face / area_edges

    def calculate_efficiency(self):
        """
        Calculates the Optical Efficiency using a simplified LSC equation:
        Eff_opt = (1 - R) * Abs_eff * QY * Trap_eff * (1 - Loss_scattering)
        """
        reflection_loss = 0.04  # ~4% reflection at surface
        absorption_efficiency = 0.40  # Captures ~40% of solar spectrum (UV/Blue)
        trapping_efficiency = 0.75 # Based on refractive index n=1.5 (~75% TIR)
        scattering_loss = 0.10 # Loss due to imperfections in waste-derived material
        
        optical_efficiency = (1 - reflection_loss) * \
                             absorption_efficiency * \
                             self.quantum_yield * \
                             trapping_efficiency * \
                             (1 - scattering_loss)
                             
        return optical_efficiency

    def run_simulation(self):
        area = self.width * self.height
        geometric_gain = self.calculate_geometric_gain()
        optical_efficiency = self.calculate_efficiency()
        
        # Power Calculation
        # Power_edge = Power_in * Optical_Efficiency * Solar_Conversion_Efficiency_of_Edge_Strips
        # Assuming high-efficiency PV strips (e.g., GaAs or efficient Si) = 20%
        pv_strip_efficiency = 0.20
        
        total_solar_input = self.solar_irradiance * area
        light_at_edges = total_solar_input * optical_efficiency
        electrical_output = light_at_edges * pv_strip_efficiency
        
        power_per_sqm = electrical_output / area

        results = {
            "dimensions": f"{self.width}m x {self.height}m",
            "geometric_gain": round(geometric_gain, 2),
            "optical_efficiency_percent": round(optical_efficiency * 100, 2),
            "power_output_watts": round(electrical_output, 2),
            "power_density_w_m2": round(power_per_sqm, 2),
            "annual_energy_kwh": round(electrical_output * 5 * 365 / 1000, 2) # 5 peak sun hours
        }
        return results

    def plot_spectral_response(self, output_path):
        """Generates a dummy spectral plot for visual verification"""
        wavelengths = np.linspace(300, 800, 500)
        
        # Simulated Absorption (Blue/UV strong)
        absorption = np.exp(-0.5 * ((wavelengths - 400) / 50)**2)
        
        # Simulated Emission (Red shifted)
        emission = 0.65 * np.exp(-0.5 * ((wavelengths - 620) / 40)**2)
        
        plt.figure(figsize=(10, 6))
        plt.plot(wavelengths, absorption, label='Absorption (Waste-Derived C-Dots)', color='blue', linewidth=2)
        plt.plot(wavelengths, emission, label='Emission (Luminescent Shift)', color='red', linewidth=2, linestyle='--')
        plt.fill_between(wavelengths, emission, alpha=0.1, color='red')
        plt.title('Spectral Response: Hybrid Agricultural Carbon Dots')
        plt.xlabel('Wavelength (nm)')
        plt.ylabel('Normalized Intensity')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.savefig(output_path)
        plt.close()

if __name__ == "__main__":
    # Run Base Case
    model = LSCModel()
    results = model.run_simulation()
    
    # Save Results
    with open("simulation_results.json", "w") as f:
        json.dump(results, f, indent=4)
        
    print("Simulation Complete. Results:")
    print(json.dumps(results, indent=2))
    
    # Generate Plot
    model.plot_spectral_response("spectral_curve.png")
