# 🚀 Deployment Guide

## Production Build

```bash
npm run build
```

Outputs to `dist/` directory.

## Hosting Options

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Automatic deployment from git.

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

```bash
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t analytics-pro .
docker run -p 3000:3000 analytics-pro
```

## Environment Setup

Create `.env.production`:

```env
VITE_API_URL=https://api.direct.yandex.com/json/v5
VITE_YANDEX_CLIENT_ID=prod_client_id
VITE_GOOGLE_SHEETS_API_KEY=prod_api_key
VITE_SENTRY_DSN=your_sentry_dsn
```

## Performance Optimization

### Metrics

Check your build:
```bash
npm run build
# See dist/ size
ls -lah dist/
```

Target sizes:
- JS: < 500KB
- CSS: < 100KB
- Images: < 1MB total

### Optimization Checklist

- [ ] Enable gzip compression
- [ ] Enable brotli compression
- [ ] Set cache headers (1 year for /assets/)
- [ ] Set short cache for index.html (1 hour)
- [ ] Enable CDN for static assets
- [ ] Lazy load routes
- [ ] Code split large components
- [ ] Minify CSS and JS

### Server Headers

```
# Add to your server (Vercel/Netlify does automatically)
Cache-Control: max-age=31536000, immutable  (for /assets/*)
Cache-Control: no-cache  (for index.html)
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

## Security

### HTTPS Only
```bash
# Add redirect in your server
if (protocol !== 'https') redirect('https://' + host + path)
```

### CORS Setup
```bash
# For API calls to Yandex
Access-Control-Allow-Origin: yourdomain.com
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
```

### CSP (Content Security Policy)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Monitoring

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

In `App.tsx`:
```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

export default Sentry.withProfiler(App)
```

### Analytics (Google Analytics)

```bash
npm install react-ga4
```

In `App.tsx`:
```typescript
import ReactGA from 'react-ga4'
ReactGA.initialize('G-YOUR_TRACKING_ID')
```

### Performance Monitoring

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## Database (Optional)

If you add backend API:

### Setup
```bash
npm install express cors dotenv
npm install -D nodemon ts-node
```

### Environment
```env
DATABASE_URL=postgresql://user:pass@localhost/dbname
JWT_SECRET=your_secret_key
```

### Migrations
```bash
npx typeorm migration:generate
npx typeorm migration:run
```

## SSL Certificate

### Let's Encrypt (Free)

```bash
# Vercel/Netlify handle this automatically
# For custom servers:
certbot certonly --standalone -d yourdomain.com
```

## Rollback

Keep backup of previous deploy:

```bash
# Before deploying
git tag v1.0.0
npm run build
# Test...
# Deploy to production
```

If issues arise:
```bash
git checkout v1.0.0
npm run build
# Redeploy
```

## Maintenance

### Scheduled Backups
```bash
# Daily backup script
0 2 * * * backup_script.sh
```

### Update Dependencies
```bash
npm outdated
npm update
npm audit fix
```

### Monitor Uptime
- Use: UptimeRobot, StatusPage, Datadog
- Setup alerts for > 5min downtime

## Troubleshooting

### Slow Load Time?
1. Check network tab (Chrome DevTools)
2. Enable compression on server
3. Use CDN for static assets
4. Check API response times

### Blank Page?
1. Check browser console
2. Verify .env variables
3. Check build output
4. Test with `npm run preview`

### API Not Working?
1. Verify CORS headers
2. Check Authorization header
3. Test API with curl
4. Check rate limits

---

**Ready to ship?** Follow the checklist and deploy! 🚀
