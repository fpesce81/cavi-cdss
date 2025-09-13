'use client';

import { useState } from 'react';
import { HybridRiskCalculator as RiskCalculator } from '@/components/HybridRiskCalculator';

export default function Home() {
  const [patientData, setPatientData] = useState({
    age: '',
    sex: '',
    cavi_mean: '',
    abi_mean: '',
    hct: '',
    hb: ''
  });

  const [results, setResults] = useState<{
    binaryRisk: number;
    survivalRisk: number;
    timestamp: string;
    modelVersions: {
      binary: string;
      survival: string;
    };
    confidence?: {
      binary: number;
      survival: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modeInfo, setModeInfo] = useState<{
    mode: string;
    description: string;
    models: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');

    try {
      const requiredFields = ['age', 'sex', 'cavi_mean', 'abi_mean', 'hct', 'hb'];
      const missingFields = requiredFields.filter(field => !patientData[field as keyof typeof patientData]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const riskResults = await RiskCalculator.calculateRisk(patientData);
      setResults(riskResults);

      // Update mode info
      const currentModeInfo = RiskCalculator.getModeInfo();
      setModeInfo(currentModeInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CAVI Risk Assessment CDSS</h1>
              <p className="text-sm text-gray-600">Clinical Decision Support System for Mortality Prediction</p>
              <div className="mt-1">
                {modeInfo ? (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${modeInfo.mode === 'Production'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {modeInfo.mode} Mode - {modeInfo.description}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Initializing...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Data Input</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (years) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 65"
                    value={patientData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
                  <select
                    value={patientData.sex}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select sex</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CAVI Mean *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 9.5"
                    value={patientData.cavi_mean}
                    onChange={(e) => handleInputChange('cavi_mean', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cardio-Ankle Vascular Index (normal: 8-10)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ABI Mean *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.1"
                    value={patientData.abi_mean}
                    onChange={(e) => handleInputChange('abi_mean', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ankle-Brachial Index (normal: 0.9-1.3)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hematocrit (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 42.5"
                    value={patientData.hct}
                    onChange={(e) => handleInputChange('hct', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hemoglobin (g/dL) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 14.2"
                    value={patientData.hb}
                    onChange={(e) => handleInputChange('hb', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Calculating...' : 'Calculate Risk'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!results ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Assessment Yet</h3>
                <p className="text-gray-500">Enter patient data and click &quot;Calculate Risk&quot; to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">10-Year Mortality Risk</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {(results.binaryRisk * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Probability of death within 10 years
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        Based on CAVI-enhanced binary classification model
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${results.binaryRisk < 0.2 ? 'bg-green-500' :
                              results.binaryRisk < 0.4 ? 'bg-yellow-500' :
                                results.binaryRisk < 0.6 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${results.binaryRisk * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {results.binaryRisk < 0.2 ? 'Low Risk (<20%)' :
                          results.binaryRisk < 0.4 ? 'Moderate Risk (20-40%)' :
                            results.binaryRisk < 0.6 ? 'High Risk (40-60%)' : 'Very High Risk (>60%)'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Long-term Risk Profile</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {results.survivalRisk.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Relative Risk Score (0-100)
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        50 = Average population risk
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${results.survivalRisk < 30 ? 'bg-green-500' :
                            results.survivalRisk < 60 ? 'bg-yellow-500' :
                              results.survivalRisk < 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${results.survivalRisk}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {results.survivalRisk < 30 ? 'Below Average Risk' :
                          results.survivalRisk < 60 ? 'Average Risk' :
                            results.survivalRisk < 80 ? 'Above Average Risk' : 'High Risk'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Clinical Recommendations</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>10-Year Mortality Risk:</strong> {results.binaryRisk < 0.2 ? 'Low risk (<20%) - routine follow-up recommended' :
                            results.binaryRisk < 0.4 ? 'Moderate risk (20-40%) - enhanced monitoring suggested' :
                              results.binaryRisk < 0.6 ? 'High risk (40-60%) - intensive intervention recommended' : 'Very high risk (>60%) - immediate intensive care required'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>Long-term Risk Profile:</strong> {results.survivalRisk < 30 ? 'Below average risk - routine follow-up recommended' :
                            results.survivalRisk < 60 ? 'Average risk - standard monitoring appropriate' :
                              results.survivalRisk < 80 ? 'Above average risk - enhanced monitoring suggested' : 'High risk - intensive intervention recommended'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>Integrated Approach:</strong> {results.binaryRisk < 0.3 && results.survivalRisk < 50 ? 'Low overall risk - standard care protocol' :
                            results.binaryRisk < 0.5 && results.survivalRisk < 70 ? 'Moderate overall risk - enhanced monitoring protocol' :
                              results.binaryRisk < 0.7 && results.survivalRisk < 85 ? 'High overall risk - intensive intervention protocol' : 'Very high overall risk - immediate intensive care protocol'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}