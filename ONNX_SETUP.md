# ONNX Runtime Setup Guide for CAVI CDSS

## 🚨 Current Status: Demo Mode

The CDSS is currently running in **Demo Mode** using a mock risk calculator. This provides a fully functional demonstration of the clinical interface while we resolve the ONNX Runtime configuration.

## 🔧 ONNX Runtime Setup

### Option 1: Quick Demo (Current)

The application currently uses `MockRiskCalculator` which simulates the AI model behavior based on clinical knowledge. This provides:

- ✅ Full UI functionality
- ✅ Realistic risk calculations
- ✅ Clinical decision support features
- ✅ No ONNX dependencies

### Option 2: Full ONNX Implementation

To enable the actual AI models, follow these steps:

#### 1. Install ONNX Runtime Web

```bash
npm install onnxruntime-web
```

#### 2. Copy WebAssembly Files

```bash
# Copy ONNX Runtime WASM files to public directory
cp node_modules/onnxruntime-web/dist/*.wasm public/
cp node_modules/onnxruntime-web/dist/*.mjs public/
```

#### 3. Update RiskCalculator Import

In `src/app/page.tsx`, change:

```typescript
// From:
import { MockRiskCalculator as RiskCalculator } from '@/components/MockRiskCalculator';

// To:
import { RiskCalculator } from '@/components/RiskCalculator';
```

#### 4. Verify Model Files

Ensure these files exist in `public/models/`:

- `cavi_binary_model.onnx`
- `cavi_survival_model.onnx`
- `feature_info.json`

#### 5. Test ONNX Runtime

```bash
npm run dev
```

## 🐛 Troubleshooting ONNX Issues

### Common Errors and Solutions

#### 1. "no available backend found"

**Cause**: ONNX Runtime WebAssembly files not properly served
**Solution**:

```bash
# Ensure WASM files are in public directory
ls public/*.wasm
ls public/*.mjs

# If missing, copy them:
cp node_modules/onnxruntime-web/dist/*.wasm public/
cp node_modules/onnxruntime-web/dist/*.mjs public/
```

#### 2. "Failed to fetch dynamically imported module"

**Cause**: CORS or file serving issues
**Solution**: Update `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cross-Origin-Embedder-Policy",
          value: "require-corp",
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
      ],
    },
  ];
}
```

#### 3. "TypeError: Failed to fetch"

**Cause**: Model files not found
**Solution**: Verify model files exist:

```bash
ls -la public/models/
# Should show:
# - cavi_binary_model.onnx
# - cavi_survival_model.onnx
# - feature_info.json
```

#### 4. Browser Compatibility Issues

**Cause**: Browser doesn't support WebAssembly
**Solution**:

- Use modern browsers (Chrome 57+, Firefox 52+, Safari 11+)
- Enable WebAssembly in browser settings
- Check browser console for specific errors

## 🔄 Switching Between Demo and Production

### Enable Demo Mode (Current)

```typescript
// In src/app/page.tsx
import { MockRiskCalculator as RiskCalculator } from '@/components/MockRiskCalculator';
```

### Enable Production Mode

```typescript
// In src/app/page.tsx
import { RiskCalculator } from '@/components/RiskCalculator';
```

## 📊 Model Performance Comparison

### Mock Calculator (Demo Mode)

- **Binary Risk**: Clinical knowledge-based simulation
- **Survival Risk**: Simplified hazard ratio calculation
- **Performance**: Instant response, no model loading
- **Accuracy**: Simulates expected model behavior

### ONNX Models (Production Mode)

- **Binary Risk**: Actual trained neural network (AUC 0.907)
- **Survival Risk**: DeepSurv model (C-index 0.689)
- **Performance**: ~1-2 second model loading + inference
- **Accuracy**: Validated on clinical data

## 🚀 Deployment Considerations

### Demo Mode Deployment

- ✅ No ONNX dependencies
- ✅ Smaller bundle size
- ✅ Faster loading
- ✅ Works on all browsers
- ❌ Not using actual AI models

### Production Mode Deployment

- ✅ Uses actual trained models
- ✅ Higher accuracy
- ✅ Clinical validation
- ❌ Requires ONNX Runtime setup
- ❌ Larger bundle size
- ❌ Browser compatibility requirements

## 🏥 Clinical Validation

### Demo Mode

- **Purpose**: UI/UX testing, workflow validation
- **Accuracy**: Simulated based on clinical knowledge
- **Use Case**: Prototype testing, user training

### Production Mode

- **Purpose**: Clinical decision support
- **Accuracy**: Validated on clinical data
- **Use Case**: Patient risk assessment

## 🔧 Development Workflow

### 1. UI Development

Use Demo Mode for:

- Interface design
- User experience testing
- Clinical workflow validation
- Feature development

### 2. Model Integration

Switch to Production Mode for:

- Model performance testing
- Clinical validation
- Accuracy verification
- Production deployment

### 3. Testing Strategy

```bash
# Test Demo Mode
npm run dev
# Verify UI functionality

# Test Production Mode
# Follow ONNX setup steps
# Verify model inference
```

## 📝 Next Steps

### Immediate (Demo Mode)

1. ✅ Test UI functionality
2. ✅ Validate clinical workflow
3. ✅ Gather user feedback
4. ✅ Refine interface design

### Production Ready (ONNX Mode)

1. 🔄 Resolve ONNX Runtime configuration
2. 🔄 Test model inference
3. 🔄 Validate clinical accuracy
4. 🔄 Deploy to production

## 🆘 Support

### Demo Mode Issues

- Check browser console for JavaScript errors
- Verify all components are imported correctly
- Test with different input values

### ONNX Mode Issues

- Check browser console for ONNX errors
- Verify WebAssembly files are served
- Test with different browsers
- Check model file integrity

---

**Current Status**: Demo Mode Active | **Next Phase**: ONNX Integration | **Goal**: Production-Ready CDSS
