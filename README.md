# OopsBudgeter

OopsBudgeter is a personal finance management app designed to help users track their income and expenses. Built with **Next.js**, **React**, and **Tailwind CSS**, the app is **PWA** (Progressive Web App)-enabled and can be easily self-hosted with Docker.

## Features

- **Track income and expenses**: Easily manage your transactions with details like amount, description, and date.
- **PWA Support**: Works offline, and you can install it as a native app.
- **JWT-based authentication**: Secure your app with token-based authentication.
- **Customizable Currency**: Supports over 20 currencies.
- **Passcode Protection**: Add a passcode to protect access to the app and api.
- **Responsive**: Built using Tailwind CSS for a clean and modern design.
- **Docker support**: Easily deploy with Docker.

## Methods and Technologies Used

- **Frontend**: 
  - **Next.js** 15, **React** 19
  - **Tailwind CSS** for styling
  - **React Hook Form** for form handling
  - **Zod** for form validation
  - **JWT** for user authentication and security
  - **Next-PWA** for Progressive Web App features

- **Backend**:
  - **Quick.db** for local data storage
  - **JWT-based authentication** for securing the application

- **Deployment**:
  - **Docker** for containerization and easy deployment
  - **GitHub Container Registry (GHCR)** for hosting Docker images

## Installation

### Install and Run via Docker

1. **Clone the repository**:

    ```bash
    git clone https://github.com/OopsApps/budgeter.git
    cd budgeter
    ```

2. **Build the Docker image**:

    ```bash
    docker build -t budgeter .
    ```

3. **Run the Docker container**:

    ```bash
    docker run -p 3000:3000 budgeter
    ```

    The app should now be accessible at `http://localhost:3000`.

### Build from Source

1. **Clone the repository**:

    ```bash
    git clone https://github.com/OopsApps/budgeter.git
    cd budgeter
    ```

2. **Install dependencies**:

    ```bash
    bun install
    ```

3. **Set environment variables** (details below) in a `.env.local` file.

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

Make sure to create a `.env.local` file in the root directory and add the following environment variables:

- **NEXT_PUBLIC_CURRENCY**: Set the default currency for the app (e.g., `USD`, `EUR`, `INR`, etc.)
- **PASSCODE**: Set a custom passcode to protect access to the app, 6 digits.
- **JWT_SECRET**: 32-token secret key used for signing JWT tokens.

Example `.env.local` file:

## Contributing

We welcome contributions! Here’s how you can help:

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement your changes and write tests if necessary.
4. Open a pull request with a description of what you've done and why it's useful.

We appreciate all contributions, whether small or large!

### Issues

If you encounter any issues with the app, please open an issue on the [GitHub Issues page](https://github.com/OopsApps/budgeter/issues).

## Support

If you need support or have any questions about using the app, feel free to contact me at [help@oopsapps.tech](mailto:help@oopsapps.tech) or open an issue in the [GitHub Issues page](https://github.com/OopsApps/budgeter/issues).

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for more details.

---

### A simple workflow of the WApp:

1. **Track Income or Expenses**: You can add a transaction by choosing whether it's an income or an expense, entering the amount, description, and date.
2. **View Balance**: The app will keep track of your balance, and you can see your current balance in the dashboard.
3. **Sort Transactions**: Transactions can be sorted by **amount** or **date** (ascending or descending).
4. **Print or Download Transactions**: You can print your transactions list for offline use with a nice and modern look.
