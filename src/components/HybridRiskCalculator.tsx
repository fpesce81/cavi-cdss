'use client';

import { RiskCalculator } from './RiskCalculator';
import { MockRiskCalculator } from './MockRiskCalculator';

export class HybridRiskCalculator {
    private static useRealModels: boolean = true;
    private static initializationAttempted: boolean = false;

    static async initialize() {
        if (this.initializationAttempted) {
            return;
        }

        this.initializationAttempted = true;

        try {
            console.log('Attempting to initialize real ONNX models...');
            await RiskCalculator.initialize();
            this.useRealModels = true;
            console.log('✅ Real ONNX models initialized successfully');
        } catch (error) {
            console.warn('⚠️ Failed to initialize ONNX models, falling back to mock calculator:', error);
            this.useRealModels = false;
            await MockRiskCalculator.initialize();
            console.log('✅ Mock calculator initialized as fallback');
        }
    }

    static async calculateRisk(patientData: Record<string, string>) {
        await this.initialize();

        if (this.useRealModels) {
            try {
                return await RiskCalculator.calculateRisk(patientData);
            } catch (error) {
                console.warn('⚠️ Real model inference failed, falling back to mock:', error);
                this.useRealModels = false;
                return await MockRiskCalculator.calculateRisk(patientData);
            }
        } else {
            return await MockRiskCalculator.calculateRisk(patientData);
        }
    }

    static getFeatureDescriptions() {
        return this.useRealModels
            ? RiskCalculator.getFeatureDescriptions()
            : MockRiskCalculator.getFeatureDescriptions();
    }

    static getModelPerformance() {
        return this.useRealModels
            ? RiskCalculator.getModelPerformance()
            : MockRiskCalculator.getModelPerformance();
    }

    static isUsingRealModels(): boolean {
        return this.useRealModels;
    }

    static getModeInfo() {
        return {
            mode: this.useRealModels ? 'Production' : 'Demo',
            description: this.useRealModels
                ? 'Using actual trained ONNX models'
                : 'Using mock calculator (ONNX models unavailable)',
            models: this.useRealModels
                ? ['CAVI-Enhanced Binary Classifier', 'DeepSurv Survival Model']
                : ['Mock Risk Calculator (Clinical Knowledge-based)']
        };
    }
}
