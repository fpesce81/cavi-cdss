'use client';

import * as ort from 'onnxruntime-web';

export class RiskCalculator {
    private static binarySession: ort.InferenceSession | null = null;
    private static survivalSession: ort.InferenceSession | null = null;
    private static binaryScaler: unknown = null;
    private static survivalScaler: unknown = null;
    private static featureInfo: unknown = null;
    private static initialized: boolean = false;

    static async initialize() {
        if (this.initialized && this.binarySession && this.survivalSession) {
            return; // Already initialized
        }

        try {
            // Configure ONNX Runtime for browser environment
            ort.env.wasm.wasmPaths = '/';
            ort.env.wasm.simd = false; // Disable SIMD for better compatibility
            ort.env.wasm.proxy = false;
            ort.env.wasm.numThreads = 1;

            // Set execution providers for browser (use CPU backend)
            const executionProviders = ['cpu'];

            console.log('Initializing ONNX Runtime...');

            // Load models with minimal configuration for better compatibility
            this.binarySession = await ort.InferenceSession.create('/models/cavi_binary_model.onnx', {
                executionProviders,
                graphOptimizationLevel: 'basic',
                enableCpuMemArena: false,
                enableMemPattern: false,
                enableProfiling: false,
            });

            this.survivalSession = await ort.InferenceSession.create('/models/cavi_survival_model.onnx', {
                executionProviders,
                graphOptimizationLevel: 'basic',
                enableCpuMemArena: false,
                enableMemPattern: false,
                enableProfiling: false,
            });

            // Load feature information
            const response = await fetch('/models/feature_info.json');
            this.featureInfo = await response.json();

            this.initialized = true;
            console.log('Models loaded successfully');
        } catch (error) {
            console.error('Error initializing models:', error);
            this.initialized = false;
            throw new Error('Failed to load AI models. Please refresh the page.');
        }
    }

    static async calculateRisk(patientData: Record<string, string>) {
        await this.initialize();

        try {
            // Prepare input data
            const inputData = this.prepareInputData(patientData);

            // Run binary classification model
            const binaryInput = new ort.Tensor('float32', inputData.binary, [1, inputData.binary.length]);
            const binaryResults = await this.binarySession!.run({ input: binaryInput });
            const binaryRisk = binaryResults.output.data[0] as number;

            // Run survival analysis model
            const survivalInput = new ort.Tensor('float32', inputData.survival, [1, inputData.survival.length]);
            const survivalResults = await this.survivalSession!.run({ input: survivalInput });
            const rawSurvivalRisk = survivalResults.output.data[0] as number;

            // Convert log hazard ratio to intuitive 0-100 risk score
            // Higher values = higher risk, 50 = average population risk
            const survivalRisk = Math.max(0, Math.min(100, (rawSurvivalRisk + 2) * 25));

            return {
                binaryRisk,
                survivalRisk,
                timestamp: new Date().toISOString(),
                modelVersions: {
                    binary: 'CAVI-Enhanced 10-Year Mortality Predictor v1.0',
                    survival: 'DeepSurv Long-term Risk Profiler v1.0'
                }
            };
        } catch (error) {
            console.error('Error calculating risk:', error);
            throw new Error('Failed to calculate risk. Please check your input data.');
        }
    }

    private static prepareInputData(patientData: Record<string, string>) {
        // Convert patient data to numbers
        const age = parseFloat(patientData.age);
        const sex = parseInt(patientData.sex);
        const cavi_mean = parseFloat(patientData.cavi_mean);
        const abi_mean = parseFloat(patientData.abi_mean);
        const hct = parseFloat(patientData.hct);
        // const hb = parseFloat(patientData.hb); // Not used in current calculation

        // Create CAVI-enhanced features
        const cavi_age_interaction = cavi_mean * age;
        const cavi_sex_interaction = cavi_mean * sex;
        const cavi_normal = cavi_mean >= 8.0 && cavi_mean <= 10.0 ? 1 : 0;
        const cavi_elevated = cavi_mean > 10.0 ? 1 : 0;
        const cavi_age_adjusted = cavi_mean / (age / 65.0);

        // Prepare feature arrays
        const binaryFeatures = [
            age, sex, cavi_mean, abi_mean, hct,
            cavi_age_interaction, cavi_sex_interaction, cavi_normal, cavi_elevated, cavi_age_adjusted
        ];

        const survivalFeatures = [
            age, sex, cavi_mean, abi_mean, hct,
            cavi_age_interaction, cavi_sex_interaction, cavi_normal, cavi_elevated, cavi_age_adjusted
        ];

        // Apply scaling (simplified - in production, load actual scalers)
        const scaledBinaryFeatures = this.applyScaling(binaryFeatures, 'binary');
        const scaledSurvivalFeatures = this.applyScaling(survivalFeatures, 'survival');

        return {
            binary: scaledBinaryFeatures,
            survival: scaledSurvivalFeatures
        };
    }

    private static applyScaling(features: number[], modelType: 'binary' | 'survival'): number[] {
        // Simplified scaling - in production, load actual scaler parameters
        // This is a placeholder implementation
        const means = {
            binary: [67.2, 0.53, 9.47, 1.1, 42.5, 636.8, 5.0, 0.3, 0.7, 9.2],
            survival: [67.2, 0.53, 9.47, 1.1, 42.5, 636.8, 5.0, 0.3, 0.7, 9.2]
        };

        const stds = {
            binary: [12.8, 0.5, 2.57, 0.2, 5.0, 200.0, 2.5, 0.5, 0.5, 2.0],
            survival: [12.8, 0.5, 2.57, 0.2, 5.0, 200.0, 2.5, 0.5, 0.5, 2.0]
        };

        return features.map((value, index) => {
            const mean = means[modelType][index] || 0;
            const std = stds[modelType][index] || 1;
            return (value - mean) / std;
        });
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
