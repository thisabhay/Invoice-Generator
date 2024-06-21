# Invoice-Generator
Sure, here's a more concise README file suitable for GitHub:

# Invoice Generator

A web application to generate and manage invoices. Users can register, login, and create invoices with customer details and product information.

## Features

- User Registration and Authentication
- Generate Invoices with Customer and Product Details
- View and Manage Invoices
- User Dashboard

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript)
- JWT (JSON Web Token)
- bcrypt.js

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/invoice-generator.git
    ```

2. Navigate to the project directory:
    ```bash
    cd invoice-generator
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory with the following content:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/invoiceDB
    JWT_SECRET=your_secret_key_here
    ```

5. Start the server:
    ```bash
    npm start
    ```
    Or, if using nodemon:
    ```bash
    npm run dev
    ```

6. Open your browser and navigate to `http://localhost:3000`
