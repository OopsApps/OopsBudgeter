# OopsBudgeter

OopsBudgeter is a personal finance management app designed to help users track their income and expenses. Built with **Next.js**, **React**, and **Tailwind CSS**, the app is **PWA** (Progressive Web App)-enabled and can be easily self-hosted with Docker. 

*(**Why made it?** Because who doesn't want a budget app that makes them realize how broke they are? 💸😂)*

## Features

- **Track income and expenses**: Easily manage transactions with details like amount, description, category, and date.
- **Advanced Analytics Dashboard**: Gain insights into your financial trends with detailed graphs and FakeAI-powered insights. *Yes, we graphically display your bad decisions!*
- **FakeAI-Powered Insights 🤖📊**: Automated spending analysis and financial recommendations (like, "Stop buying useless stuff!").
- **No-Spend Streaks**: Tracks how many consecutive days you've avoided spending. *Good luck breaking your record past a week!* 😂
- **PWA Support**: Works offline, and you can install it as a native app. *Now you can check your tragic finances even without internet!*
- **JWT-based authentication**: Secure your app with token-based authentication. *Hackers want your money? Joke’s on them, you don’t have any!*
- **Customizable Currency**: Supports all ISO 4217 currencies. *Yes, even Monopoly money... but don’t ask why.*
- **Passcode Protection**: Add a passcode to protect access to the app and API. *As if your bank account isn’t already protecting itself.*
- **Responsive UI**: Built using Tailwind CSS for a clean and modern design.
- **Docker support**: Easily deploy with Docker.
- **Data Export**: Download transactions in **CSV** or **JSON** format or print them to a **PDF** format. *Because your financial misery should be well-documented!*

## Methods and Technologies Used

### **Frontend:** 
- **Next.js 15**, **React 19**
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zod** for form validation
- **Recharts** for dynamic financial visualizations
- **Next-PWA** for Progressive Web App features

### **Backend:**
- **PostgreSQL** for database storage
- **JWT-based authentication** for securing the application
- **Drizzle ORM** for database management

### **Deployment:**
- **Docker** for containerization and easy deployment

## Installation

### Deploy via Vercel (easiest)
1. Afer deploying with the button, change the build command to `npx drizzle-kit push && next build`
2. There, it will update the database with the correct schema.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOopsApps%2FOopsBudgeter%2F&env=NEXT_PUBLIC_CURRENCY,PASSCODE,JWT_SECRET,DATABASE_URL&project-name=oopbudgeter&repository-name=OopsBudgeterFork&redirect-url=https%3A%2F%2Fgithub.com%2FOopsApps%2FOopsBudgeter&production-deploy-hook=Github)

### **Install and Run via Docker**

1. **Clone the repository**:
    ```bash
    git clone https://github.com/OopsApps/OopsBudgeter.git
    cd OopsBudgeter
    ```
2. **Build the Docker image**:
    ```bash
    docker build -t OopsBudgeter .
    ```
3. **Run the Docker container**:
    ```bash
    docker run -p 3000:3000 OopsBudgeter
    ```
    The app should now be accessible at `http://localhost:3000`.

### **Build from Source**

1. **Clone the repository**:
    ```bash
    git clone https://github.com/OopsApps/OopsBudgeter.git
    cd OopsBudgeter
    ```
2. **Install dependencies**:
    ```bash
    bun install
    ```
3. **Set environment variables** in a `.env.local` file (see below).
4. **Build the app**:
    ```bash
    bun run build
    ```
5. **Start the app**:
    ```bash
    bun start
    ```
    The app should now be accessible at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file in the root directory and add the following:

```ini
NEXT_PUBLIC_CURRENCY=USD # Set your preferred currency
PASSCODE=123456 # 6-digit passcode for app security
JWT_SECRET=your-secure-jwt-secret # Secret key for JWT authentication
DATABASE_URL=your-postgresql-url # PostgreSQL database connection URL
```

## Contributing

We welcome contributions! Here’s how you can help:

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement your changes and write tests if necessary.
4. Open a pull request with a description of what you've done and why it's useful.

We appreciate all contributions, whether small or large!

### Issues

If you encounter any issues with the app, please open an issue on the [GitHub Issues page](https://github.com/OopsApps/OopsBudgeter/issues).

## Support

If you need support or have any questions about using the app, feel free to contact me at [help@oopsapps.tech](mailto:help@oopsapps.tech) or open an issue in the [GitHub Issues page](https://github.com/OopsApps/OopsBudgeter/issues).

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for more details.

---

## **How OopsBudgeter Works**

1. **Track Income or Expenses**: Add transactions by selecting type, amount, description, category, and date.
2. **View Financial Analytics**: Get a breakdown of spending habits, trends, and AI-powered insights. *Aka: How much money you’ve wasted.*
3. **Monitor Your No-Spend Streak**: See how long you've gone without unnecessary expenses. *Spoiler alert: It won’t be long.*
4. **Print or Download Transactions**: Export transactions in **CSV** or **JSON** format. *So you can cry over them later.*
5. **Plan Ahead with Predictions**: View projected spending based on trends. *Basically, a sneak peek into your future regrets.*

OopsBudgeter is your all-in-one finance tracker, **making sure you face your financial mistakes head-on! 🚀😂**

---
### Disclaimer: About FakeAI Insights

FakeAI is not a real artificial intelligence but rather a collection of predictive algorithms and calculations based on past data. It won’t pass the Turing test, but it will still judge your spending habits mercilessly 😉

---

Thanks for checking out OopsBudgeter! We appreciate your time and hope this app helps you (or at least makes you laugh while realizing where all your money went). – The OopsApps Team 💀
