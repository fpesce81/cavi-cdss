'use client';

export class MockRiskCalculator {
    private static initialized: boolean = false;

    static async initialize() {
        if (this.initialized) {
            return;
        }

        console.log('Initializing Mock Risk Calculator...');
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.initialized = true;
        console.log('Mock Risk Calculator initialized successfully');
    }

    static async calculateRisk(patientData: Record<string, string>) {
        await this.initialize();

        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Convert patient data to numbers
            const age = parseFloat(patientData.age);
            const sex = parseInt(patientData.sex);
            const cavi_mean = parseFloat(patientData.cavi_mean);
            const abi_mean = parseFloat(patientData.abi_mean);
            const hct = parseFloat(patientData.hct);
            // const hb = parseFloat(patientData.hb); // Not used in current calculation

            // Mock risk calculation based on clinical knowledge
            // This simulates the actual model behavior
            let binaryRisk = 0;
            let survivalRisk = 0;

            // Age factor (increases risk with age)
            const ageFactor = Math.min((age - 50) / 30, 1) * 0.3;

            // CAVI factor (higher CAVI = higher risk)
            const caviFactor = Math.max((cavi_mean - 8) / 5, 0) * 0.4;

            // ABI factor (lower ABI = higher risk)
            const abiFactor = Math.max((1.1 - abi_mean) / 0.5, 0) * 0.2;

            // Sex factor (males slightly higher risk)
            const sexFactor = sex === 1 ? 0.1 : 0;

            // Hematocrit factor (anemia increases risk)
            const hctFactor = Math.max((40 - hct) / 10, 0) * 0.1;

            // Calculate binary risk (probability of death)
            binaryRisk = Math.min(ageFactor + caviFactor + abiFactor + sexFactor + hctFactor, 0.95);

            // Calculate survival risk as a more intuitive metric
            // Convert to a 0-100 scale representing relative risk compared to average population
            const baseRisk = ageFactor + caviFactor + abiFactor + sexFactor + hctFactor;
            survivalRisk = Math.max(0, Math.min(100, (baseRisk * 200) + 50)); // Scale to 0-100

            // Add some randomness to simulate model uncertainty
            binaryRisk += (Math.random() - 0.5) * 0.1;
            survivalRisk += (Math.random() - 0.5) * 0.2;

            // Ensure values are within reasonable bounds
            binaryRisk = Math.max(0.05, Math.min(0.95, binaryRisk));
            survivalRisk = Math.max(0, Math.min(100, survivalRisk));

            return {
                binaryRisk,
                survivalRisk,
                timestamp: new Date().toISOString(),
                modelVersions: {
                    binary: 'CAVI-Enhanced 10-Year Mortality Predictor v1.0 (Mock)',
                    survival: 'DeepSurv Long-term Risk Profiler v1.0 (Mock)'
                },
                confidence: {
                    binary: 0.85,
                    survival: 0.65
                }
            };
        } catch (error) {
            console.error('Error calculating risk:', error);
            throw new Error('Failed to calculate risk. Please check your input data.');
        }
    }

    static getFeatureDescriptions() {
        return {
            age: 'Patient age in years',
            sex: 'Patient sex (1=Male, 0=Female)',
            cavi_mean: 'Cardio-Ankle Vascular Index mean value',
            abi_mean: 'Ankle-Brachial Index mean value',
            hct: 'Hematocrit (%)',
            cavi_age_interaction: 'CAVI × Age interaction term',
            cavi_sex_interaction: 'CAVI × Sex interaction term',
            cavi_normal: 'Normal CAVI category (8-10)',
            cavi_elevated: 'Elevated CAVI category (>10)',
            cavi_age_adjusted: 'Age-adjusted CAVI value'
        };
    }

    static getModelPerformance() {
        return {
            binary: {
                auc: 0.907,
                accuracy: 0.75,
                sensitivity: 1.0,
                specificity: 0.0
            },
            survival: {
                c_index: 0.6892,
                description: 'Moderate discriminative ability'
            }
        };
    }
}
