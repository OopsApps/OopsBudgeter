# OopsBudgeter

OopsBudgeter is a personal finance management app designed to help users track their income and expenses. Built with **Next.js**, **React**, and **Tailwind CSS**, the app is **PWA** (Progressive Web App)-enabled and can be easily self-hosted with Docker. 

*(**Why made it?** Because who doesn't want a budget app that makes them realize how broke they are? 💸😂)*

### Demo version
###### Please use it for test purposes **only**, check the UI, features and abilities given to the web app or pwa. The PIN code is 696969
[budget.oopsapps.tech](https://budget.oopsapps.tech/)

##### A Simple Roadmap for this Project: [Featurebase](https://oopsapps.featurebase.app/)

## Features

- **💰 Track income and expenses**: Easily manage transactions with details like amount, description, category, and date.
- **📊 Advanced Analytics Dashboard**: Gain insights into your financial trends with detailed graphs and FakeAI-powered insights. *Yes, we graphically display your bad decisions!*
- **🤖 FakeAI-Powered Insights**: Automated spending analysis and financial recommendations (like, "Stop buying useless stuff!").
- **🔥 No-Spend Streaks**: Tracks how many consecutive days you've avoided spending. *Good luck breaking your record past a week!* 😂
- **📱 PWA Support**: Works offline, and you can install it as a native app. *Now you can check your tragic finances even without internet!*
- **🔐 JWT-based authentication**: Secure your app with token-based authentication. *Hackers want your money? Joke’s on them, you don’t have any!*
- **💱 Customizable Currency**: Supports all ISO 4217 currencies. *Yes, even Monopoly money... but don’t ask why.*
- **🔢 Passcode Protection**: Add a passcode to protect access to the app and API. *As if your bank account isn’t already protecting itself.*
- **🎨 Responsive UI**: Built using Tailwind CSS for a clean and modern design.
- **🐋 Docker support**: Easily deploy with Docker.
- **⬇️ Data Export**: Download transactions in **CSV** or **JSON** format or print them to a **PDF** format. *Because your financial misery should be well-documented!*

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOopsApps%2FOopsBudgeter%2F&env=NEXT_PUBLIC_CURRENCY,PASSCODE,JWT_SECRET,DATABASE_URL&project-name=oopsbudgeter&repository-name=oopsbudgeter&redirect-url=https%3A%2F%2Fgithub.com%2FOopsApps%2FOopsBudgeter&production-deploy-hook=Github)

### **Install and Run via Docker**

#### via Docker hub image
```bash
docker run -d \
  -p 3030:3000 \
  -e PASSCODE=12345 \
  -e NEXT_PUBLIC_CURRENCY=USD \
  -e JWT_SECRET=your-secure-jwt-secret \
  -e DATABASE_URL=your-postgresql-url \
  iconical/oopsbudgeter:latest
```

#### via Building Docker Image
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

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `NEXT_PUBLIC_CURRENCY` | Currency code for transactions | No | `USD` | `EUR` |
| `PASSCODE` | 6-digit PIN code for accessing the application | Yes | - | `123456` |
| `JWT_SECRET` | Secret key for JWT authentication | Yes | - | `your-secure-jwt-secret - you can generate a 32-digit token here https://tools.iconical.dev/token-generator?length=32` |
| `DATABASE_URL` | PostgreSQL database connection URL. | Yes | - | `your-postgresql-url - you can create a free database on neon.tech or sth idk *shrug*` |

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

If you need support or have any questions about using the app, feel free to contact us at [help@oopsapps.tech](mailto:help@oopsapps.tech) or open an issue in the [GitHub Issues page](https://github.com/OopsApps/OopsBudgeter/issues).

## Support our Project

<a href="https://www.buymeacoffee.com/iconical"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a strawberry&emoji=🍓&slug=iconical&button_colour=BD5FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" /></a>

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

> [!NOTE]  
> **Currency Handling in OopsBudgeter 💰**  
>
> OopsBudgeter **stores all transactions in USD by default** for consistency across different currency selections.  
>
> - When you select a currency (e.g., **EUR**), the app **converts displayed amounts** using the latest exchange rate.  
> - Example: If **1 USD = 0.92 EUR**, then a **$100 transaction** is shown as **€92** in the UI.  
> - **New transactions follow the same rule**:  
>   - If you enter **€92**, it will be **saved as 100 USD** in the database.  
>   - If you switch to another currency later, the value will adjust accordingly.  
>
> 🔥 **This ensures your transactions remain globally consistent while allowing you to switch currencies anytime!** 🌍💰

---
### Disclaimer: About FakeAI Insights

FakeAI is not a real artificial intelligence but rather a collection of predictive algorithms and calculations based on past data. It won’t pass the Turing test, but it will still judge your spending habits mercilessly 😉

---

Thanks for checking out OopsBudgeter! We appreciate your time and hope this app helps you (or at least makes you laugh while realizing where all your money went). – The OopsApps Team 💀
