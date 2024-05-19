# Doclinker

Doclinker is a microservice-based application that provides user management and email services. This guide will help you run the project locally in development mode using Docker Compose.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js and npm
- Docker and Docker Compose

### Installation

Follow these steps to install dependencies for each service:

1. **Install dependencies for common library**

   ```bash
   cd ./common && npm install
   ```

2. **Install dependencies for user services**

   ```bash
   cd ./users && npm install
   ```

3. **Install dependencies for mail services**
   ```bash
   cd ./mail && npm install
   ```

### Setup Environment

Create a `.env` file in the `./users` directory with the following variables:

```env
JWT_KEY=4830b7cb6aa1fe107f173122a1f1a9d43257ee3e6eb95afc480e801ca68d6562
MONGO_URI=mongodb://doclinker:doclinker@users-db:27017/users?authSource=admin
AMQP_URL=amqp://doclinker:doclinker@amqp:5672

BASE_URL=http://localhost:8000/
```

### Running the Application

Use Docker Compose to build and run the services. Ensure you are in the project root directory when running these commands.

#### Start the Application

To start the application in development mode:

```bash
docker compose -f ./docker-compose.dev.yaml up --build -d
```

#### Stop the Application

To stop the application:

```bash
docker compose -f ./docker-compose.dev.yaml down
```

### Project Structure

The project is organized as follows:

```
.
├── common/         # Common utilities and configurations
├── users/          # User service
├── mail/           # Mail service
├── docker-compose.dev.yaml  # Docker Compose configuration for development
├── docker-compose.prod.yaml  # Docker Compose configuration for production
└── README.md       # This file
```

### Contributing

If you wish to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.
