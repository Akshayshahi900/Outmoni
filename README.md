# Outmoni 💸

Outmoni is a full-stack personal finance tracker that helps users manage their income and expenses through a clean dashboard with charts and analytics.

## Features

- 🔐 Google OAuth Authentication
- 💰 Income & Expense Management (CRUD)
- 📊 Dashboard with Income vs Expense Chart
- 🔍 Filter transactions by category and date
- 📱 Responsive UI
- 🚀 CI/CD with GitHub Actions

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Express.js
- TypeScript
- Prisma ORM

**Database**
- MongoDB Atlas

**Infrastructure**
- Turborepo
- GitHub Actions
- Vercel
- Render

## Project Structure

```text
outmoni/
├── apps/
│   ├── web/        # Next.js frontend
│   └── backend/    # Express API
├── packages/       # Shared packages
└── turbo.json
```

## Getting Started

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
yarn install

# Start development
yarn turbo build
```

## Future Improvements

- Budget alerts
- Bank account integration
- PDF & CSV exports
- Mobile application

## License

This project is licensed under the MIT License.