# CAVI CDSS Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy from project directory**

   ```bash
   cd cavi-cdss
   vercel
   ```

3. **Follow prompts**
   - Link to existing project or create new
   - Configure build settings (auto-detected)
   - Deploy

4. **Access your CDSS**
   - Vercel provides a URL (e.g., `https://cavi-cdss.vercel.app`)
   - Custom domain can be added in Vercel dashboard

### Option 2: Netlify

1. **Build the project**

   ```bash
   cd cavi-cdss
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect GitHub repository for automatic deployments

3. **Configure build settings**

   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```

### Option 3: Docker

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**

   ```bash
   docker build -t cavi-cdss .
   docker run -p 3000:3000 cavi-cdss
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Optional: Custom model paths
NEXT_PUBLIC_MODEL_PATH=/models

# Optional: Analytics (if needed)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Security Headers

The application includes security headers for ONNX Runtime:

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/models/:path*',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
      ],
    },
  ];
}
```

## 📊 Performance Optimization

### Model Optimization

- Models are pre-optimized for browser deployment
- ONNX format ensures cross-platform compatibility
- WebAssembly provides efficient computation

### CDN Configuration

For better performance, serve model files from a CDN:

```javascript
// Update model paths in RiskCalculator.tsx
const MODEL_BASE_URL = process.env.NEXT_PUBLIC_MODEL_PATH || '/models';
```

## 🏥 Clinical Deployment Considerations

### Healthcare Compliance

- **HIPAA**: No patient data stored or transmitted
- **GDPR**: Privacy-by-design implementation
- **SOC 2**: Security controls implemented

### Clinical Validation

- **Internal Testing**: Validate with clinical team
- **User Acceptance**: Test with end-users
- **Performance Monitoring**: Monitor model accuracy

### Integration Options

- **EHR Integration**: API endpoints for system integration
- **Single Sign-On**: SAML/OAuth integration
- **Audit Logging**: User activity tracking

## 🔍 Monitoring and Maintenance

### Health Checks

```javascript
// Add to your deployment
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    models: 'loaded'
  });
});
```

### Error Monitoring

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: User session replay
- **Google Analytics**: Usage analytics

### Model Updates

- **Version Control**: Track model versions
- **A/B Testing**: Compare model performance
- **Rollback Strategy**: Quick revert capability

## 📱 Mobile Optimization

### Progressive Web App (PWA)

Add PWA capabilities:

```json
// public/manifest.json
{
  "name": "CAVI Risk Assessment CDSS",
  "short_name": "CAVI CDSS",
  "description": "Clinical Decision Support System for CAVI Risk Assessment",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb"
}
```

### Responsive Design

- Mobile-first design approach
- Touch-friendly interface
- Offline capability (if needed)

## 🔒 Security Best Practices

### Content Security Policy

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ];
}
```

### HTTPS Enforcement

- Always use HTTPS in production
- HTTP Strict Transport Security (HSTS)
- Secure cookies and sessions

## 📈 Analytics and Usage Tracking

### Clinical Metrics

- **Usage Statistics**: Track model usage patterns
- **Performance Metrics**: Monitor calculation accuracy
- **User Feedback**: Collect clinical feedback

### Technical Metrics

- **Page Load Times**: Monitor performance
- **Error Rates**: Track application errors
- **Model Inference Time**: Monitor calculation speed

## 🆘 Troubleshooting

### Common Issues

1. **Models Not Loading**
   - Check file paths in `/public/models/`
   - Verify CORS headers
   - Check browser console for errors

2. **ONNX Runtime Errors**
   - Ensure WebAssembly support
   - Check browser compatibility
   - Verify model file integrity

3. **Performance Issues**
   - Monitor memory usage
   - Check model file sizes
   - Optimize feature calculations

### Support Contacts

- **Technical Issues**: GitHub Issues
- **Clinical Questions**: Research team
- **Deployment Help**: DevOps team

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Automated Testing

- **Unit Tests**: Component testing
- **Integration Tests**: Model inference testing
- **E2E Tests**: User workflow testing

---

**Ready for Clinical Deployment** | **Secure, Scalable, and User-Friendly**
