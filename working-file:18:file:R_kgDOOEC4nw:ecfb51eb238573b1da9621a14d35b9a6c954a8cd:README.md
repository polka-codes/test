<a href="https://next-starter-skolaczk.vercel.app/">
<img src="https://github.com/Skolaczk/next-starter/assets/76774237/44b552ff-43aa-441f-b1d0-de9bdfc2a73f" alt="Project thumbnail">
</a>

<p align="center">
  <a href="#-features"><strong>Features</strong></a> ·
  <a href="#-deployment"><strong>Deploy</strong></a> ·
  <a href="#-setup"><strong>Setup</strong></a> ·
  <a href="#-scripts"><strong>Scripts</strong></a> ·
  <a href="#-contribute"><strong>Contribute</strong></a>
</p>

## ✨ Features
- Next.js 14 with App Router
- TypeScript support
- Tailwind CSS with component styling
- UI components using Shadcn/ui
- Payments with Stripe integration
- Authentication via NextAuth.js
- Database management with Prisma
- Form handling with React Hook Form
- Automated testing (Jest, Playwright)
- Code quality tools (Prettier, ESLint)
- Git hooks with Husky
- Internationalization (i18n)
- Dark mode support
- Optimized production build

## 🚀 Deploy
Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Skolaczk/next-starter)

## 🛠️ Setup

### 1. Create project
Choose one method:
- Use GitHub's **Use this template** button
- Run: `npx create-next-app -e https://github.com/Skolaczk/next-starter my-app`
- Clone: `git clone https://github.com/Skolaczk/next-starter my-app`

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
1. Copy `.env.example` to `.env`
2. Add your API keys

### 4. Set up Git hooks
```bash
npm run prepare
```

### 5. Start development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser

## 📂 Project Structure
```
src/
├── app/          # App routes
├── components/   # Reusable components
├── lib/          # Utilities & config
├── styles/       # Global CSS
├── tests/        # Test files
└── ...           # Other core folders
```

## 📜 Scripts
**Development**
- `dev`: Start dev server
- `build`: Create production build
- `start`: Run production server

**Testing**
- `test`: Run unit tests
- `e2e`: Run end-to-end tests

**Code Quality**
- `lint`: Check code style
- `format`: Format code
- `typecheck`: Verify TypeScript types

## 🤝 Contribute
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your fork
5. Open a Pull Request

## Support
⭐ Found this useful? Please star the repo! 

Created by [Michał Skolak](https://michalskolak.netlify.app/)