# Contributing to [Sheryians Hiring Platform](https://hire.sheryians.com/)

First off, thank you for considering contributing to our project! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

---

## 📋 How to Get Started

### 1. Fork the Repository

Click the **Fork** button at the top right of this page. This creates a copy of the project in your own GitHub account.

### 2. Clone Your Fork

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/recruitment-server.git
cd recruitment-server
```

> 🔗 **Original repository:** `https://github.com/test-organization-sheryians/recruitment-server.git`

### 3. Set Up the Environment

Since this is a **MERN/Next.js** project, ensure you have **Node.js** installed.

- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file based on `.env.example`:
  ```bash
  cp .env.example .env
  ```
- Start the development server:
  ```bash
  npm run dev
  ```

### 4. Create a Branch

**Never** work directly on the `main` branch. Create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

---

## 🛠 Making Changes

- **Code Quality:** Please follow the existing coding style (Prettier/ESLint rules are included in the project).
- **Commit Messages:** Use descriptive commit messages following the convention below:

  | Type | Example |
  |------|---------|
  | New feature | `feat: added user authentication` |
  | Bug fix | `fix: resolved mobile navbar overflow` |
  | Documentation | `docs: updated README setup steps` |
  | Refactor | `refactor: simplified job filter logic` |

---

## 🚀 Submitting Your Changes

### 1. Push to Your Fork

```bash
git add .
git commit -m "Brief description of changes"
git push origin feature/your-feature-name
```

### 2. Open a Pull Request (PR)

- Go to the [original repository](https://github.com/test-organization-sheryians/recruitment-server) on GitHub.
- You will see a banner saying **"Compare & pull request."** Click it.
- Describe your changes in detail. Mention any related **Issues** (e.g., `Closes #12`).
- **Wait for Review:** One of our team members will review your code. We might ask for some small changes before merging!

---

## 🤝 Community Guidelines

- Be respectful to all contributors.
- Check the **Issues** tab before starting work to ensure no one else is already working on the same thing.
- When in doubt, open an **Issue** first to discuss your proposed change before writing code.

---

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| 🌐 Live Project | [hire.sheryians.com](https://hire.sheryians.com/) |
| 📦 Repository | [recruitment-server](https://github.com/test-organization-sheryians/recruitment-server) |
| 🐛 Report a Bug | [Open an Issue](https://github.com/test-organization-sheryians/recruitment-server/issues) |

---

*Happy contributing! 🎉*