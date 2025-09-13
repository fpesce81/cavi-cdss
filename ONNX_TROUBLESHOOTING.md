# ONNX Runtime Troubleshooting Guide

## 🔍 **Why "Demo Mode - Using Mock Calculator"?**

The application shows "Demo Mode" because the ONNX Runtime Web encountered a backend initialization error. This is a common issue with ONNX Runtime Web in browser environments.

## 🚨 **Root Cause Analysis**

### **Original Error**

```
Error: no available backend found. ERR: [wasm] TypeError: Failed to fetch dynamically imported module: http://localhost:3000/models/ort-wasm-simd-threaded.jsep.mjs
```

### **Common Causes**

1. **Version Compatibility**: ONNX Runtime Web 1.15.x+ has known compatibility issues
2. **WebAssembly Configuration**: Missing or improperly configured WASM files
3. **Backend Availability**: Specified execution provider not available
4. **CORS Issues**: Cross-origin resource sharing problems
5. **Browser Compatibility**: WebAssembly support issues

## ✅ **Solution Implemented: Hybrid Approach**

I've implemented a **HybridRiskCalculator** that:

1. **First Attempt**: Tries to load real ONNX models
2. **Fallback**: If ONNX fails, automatically switches to mock calculator
3. **Dynamic UI**: Shows current mode (Production vs Demo) in real-time
4. **Seamless Experience**: User gets results regardless of backend status

## 🔧 **Current Status**

### **What's Working**

- ✅ **Hybrid Calculator**: Automatically detects and uses best available backend
- ✅ **Dynamic Mode Display**: Shows "Production Mode" or "Demo Mode" based on what's working
- ✅ **Fallback System**: Always provides results, even if ONNX fails
- ✅ **User Experience**: Seamless operation regardless of backend issues

### **ONNX Configuration Applied**

- **Version**: Downgraded to ONNX Runtime Web 1.14.0 (stable version)
- **Backend**: Using CPU execution provider for better compatibility
- **SIMD**: Disabled for broader browser support
- **WASM Files**: Properly copied to public directory

## 🎯 **How to Test Real Models**

### **Option 1: Automatic Detection**

The hybrid calculator will automatically try to use real models. Check the header badge:

- **Green "Production Mode"**: Real ONNX models are working
- **Yellow "Demo Mode"**: Using mock calculator (ONNX unavailable)

### **Option 2: Manual Testing**

1. **Open Browser Console** (F12)
2. **Enter patient data** and click "Calculate Risk"
3. **Check console logs**:
   - `"✅ Real ONNX models initialized successfully"` = Production mode
   - `"⚠️ Failed to initialize ONNX models, falling back to mock calculator"` = Demo mode

### **Option 3: Force Production Mode**

If you want to ensure real models are used, you can modify the hybrid calculator to not fall back to mock mode.

## 🐛 **Troubleshooting Steps**

### **If Still in Demo Mode**

1. **Check Browser Console**

   ```javascript
   // Look for these error messages:
   "Error initializing models: [specific error]"
   "Failed to initialize ONNX models, falling back to mock calculator"
   ```

2. **Verify Model Files**

   ```bash
   ls -la public/models/
   # Should show:
   # - cavi_binary_model.onnx
   # - cavi_survival_model.onnx
   # - feature_info.json
   ```

3. **Check WASM Files**

   ```bash
   ls -la public/*.wasm
   # Should show ONNX Runtime WebAssembly files
   ```

4. **Browser Compatibility**
   - Use Chrome 57+, Firefox 52+, Safari 11+
   - Enable WebAssembly in browser settings
   - Disable browser extensions that might interfere

### **Common Solutions**

#### **Solution 1: Clear Browser Cache**

```bash
# Hard refresh the page
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

#### **Solution 2: Check Network Tab**

1. Open Developer Tools → Network tab
2. Refresh the page
3. Look for failed requests to `/models/` or `*.wasm` files
4. Check if files are being served with correct MIME types

#### **Solution 3: Try Different Browser**

- Test in Chrome, Firefox, and Safari
- Some browsers have better WebAssembly support

#### **Solution 4: Check Server Configuration**

Ensure your development server serves WASM files with correct headers:

```javascript
// In next.config.js
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

## 📊 **Performance Comparison**

### **Production Mode (Real ONNX Models)**

- **Accuracy**: AUC 0.907 (binary), C-index 0.689 (survival)
- **Speed**: ~1-2 seconds (model loading + inference)
- **Reliability**: Depends on browser WebAssembly support
- **Features**: Full AI model capabilities

### **Demo Mode (Mock Calculator)**

- **Accuracy**: Clinical knowledge-based simulation
- **Speed**: Instant response
- **Reliability**: 100% (no external dependencies)
- **Features**: Simulates expected model behavior

## 🚀 **Deployment Considerations**

### **Production Deployment**

- **Vercel/Netlify**: Should work with proper configuration
- **Docker**: Ensure WebAssembly support in container
- **CDN**: May need special configuration for WASM files

### **Browser Support**

- **Modern Browsers**: Full support
- **Older Browsers**: May fall back to demo mode
- **Mobile**: Generally good support on modern devices

## 🔮 **Future Improvements**

### **Planned Enhancements**

1. **Better Error Handling**: More specific error messages
2. **Model Validation**: Verify model integrity on load
3. **Performance Monitoring**: Track model loading times
4. **User Feedback**: Allow users to report issues

### **Alternative Approaches**

1. **Server-side Inference**: Move models to backend
2. **WebGL Backend**: Use GPU acceleration
3. **TensorFlow.js**: Alternative ML framework
4. **Model Optimization**: Smaller, faster models

## 🆘 **Getting Help**

### **If Issues Persist**

1. **Check Console Logs**: Look for specific error messages
2. **Test in Different Browser**: Isolate browser-specific issues
3. **Verify File Integrity**: Ensure model files are not corrupted
4. **Check Network**: Ensure all files are loading properly

### **Debug Information**

When reporting issues, include:

- Browser version and type
- Console error messages
- Network tab failures
- Model file sizes and checksums

---

**Current Status**: Hybrid System Active | **Goal**: Seamless Production Experience | **Fallback**: Always Available
