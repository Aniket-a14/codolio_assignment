# Deployment Guide

This guide covers deploying the Striver's SDE Sheet Tracker to production using Vercel with automated GitHub Actions.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Node.js 18.x or higher installed locally

---

## Vercel Deployment Setup

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Click **"Deploy"**

### 2. Get Vercel Credentials

You need three secrets for GitHub Actions:

#### VERCEL_TOKEN
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it `GitHub Actions`
4. Set expiration (recommended: No Expiration for CI/CD)
5. Copy the token

#### VERCEL_ORG_ID
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your profile/organization
3. Go to **Settings → General**
4. Copy the **Organization ID** (or Team ID)

#### VERCEL_PROJECT_ID
1. Go to your project in Vercel
2. Click **Settings**
3. Scroll to **Project ID**
4. Copy the ID

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

| Secret Name | Value |
|------------|-------|
| `VERCEL_TOKEN` | Your Vercel token |
| `VERCEL_ORG_ID` | Your organization/team ID |
| `VERCEL_PROJECT_ID` | Your project ID |

---

## Automated Deployment

Once secrets are configured, deployments happen automatically:

### Main Branch (Production)
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/deploy.yml`
- **Environment**: Production
- **URL**: Your Vercel production URL

### Pull Requests (Preview)
Vercel automatically creates preview deployments for PRs via their GitHub integration.

---

## Manual Deployment

### Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Deploy Preview**
   ```bash
   vercel
   ```

### Using GitHub Actions Manually

1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Production"** workflow
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

---

## Docker Deployment

### Production Build

1. **Build Docker Image**
   ```bash
   docker build -t codolio-assignment:latest .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 codolio-assignment:latest
   ```

3. **Access Application**
   - Open browser to `http://localhost:3000`

### Docker Compose (Development)

1. **Start Services**
   ```bash
   docker-compose up
   ```

2. **Run in Background**
   ```bash
   docker-compose up -d
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

---

## Environment Variables

Currently, the application doesn't require environment variables. If you add any:

### Vercel
1. Go to **Project Settings → Environment Variables**
2. Add variables for each environment (Production, Preview, Development)

### Docker
Create a `.env` file:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

Update `docker-compose.yml`:
```yaml
services:
  app:
    env_file:
      - .env
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] GitHub secrets are configured
- [ ] Vercel project is linked
- [ ] Environment variables are set (if any)
- [ ] Domain is configured (optional)

---

## Troubleshooting

### Build Fails on Vercel

**Issue**: Build fails with module not found
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

**Issue**: TypeScript errors during build
- **Solution**: Run `npx tsc --noEmit` locally to check for errors
- Fix all type errors before pushing

### GitHub Actions Fails

**Issue**: `VERCEL_TOKEN` is invalid
- **Solution**: Regenerate token in Vercel and update GitHub secret

**Issue**: Workflow doesn't trigger
- **Solution**: Check branch name matches workflow configuration
- Ensure workflow file is in `.github/workflows/`

### Docker Build Issues

**Issue**: Build fails at npm install
- **Solution**: Delete `node_modules` and `package-lock.json`, run `npm install`

**Issue**: Container exits immediately
- **Solution**: Check logs with `docker logs <container-id>`
- Ensure `output: 'standalone'` is in `next.config.ts`

**Issue**: Port 3000 already in use
- **Solution**: Stop other services or change port mapping:
  ```bash
  docker run -p 3001:3000 codolio-assignment:latest
  ```

---

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor build times
- Check error rates
- View analytics

### GitHub Actions
- View workflow runs
- Check build logs
- Monitor deployment status

---

## Rollback

### Vercel
1. Go to **Deployments** in Vercel dashboard
2. Find previous successful deployment
3. Click **"Promote to Production"**

### GitHub
1. Revert the problematic commit
2. Push to `main` branch
3. Automatic deployment will trigger

---

## Custom Domain

1. Go to **Project Settings → Domains** in Vercel
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

## Performance Optimization

- Enable **Edge Functions** in Vercel for faster response times
- Use **Image Optimization** for static assets
- Enable **Incremental Static Regeneration** if applicable
- Monitor **Core Web Vitals** in Vercel Analytics

---

## Security

- Keep dependencies updated (Dependabot handles this)
- Review security audit reports in GitHub Actions
- Use environment variables for sensitive data
- Enable **Vercel Authentication** for preview deployments if needed

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
