# Simple E-commerce API

A TypeScript Express.js REST API with MySQL database using Sequelize ORM, implementing repository and service patterns for complete e-commerce functionality including categories, products, and orders.

## Features

- **TypeScript** for type safety
- **Express.js** web framework
- **MySQL** database with **Sequelize ORM**
- **Repository Pattern** for data access layer
- **Service Pattern** for business logic
- **DTO Validation** using class-validator
- **Resource Formatting** for consistent API responses
- **Migration Support** with Sequelize CLI
- **Environment Variables** for configuration
- **Error Handling** middleware
- **Security** middleware (Helmet, CORS)

## Architecture

```
src/
├── config/         # Database and app configuration
├── controllers/    # Request handlers
├── dto/           # Data Transfer Objects with validation
├── middleware/    # Custom middleware
├── migrations/    # Database migrations
├── models/        # Sequelize models
├── repositories/  # Data access layer
├── resources/     # Response formatting
├── routes/        # API routes
├── seeders/       # Database seeders
├── services/      # Business logic layer
├── utils/         # Utility functions
└── server.ts      # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone and setup**:

   ```bash
   # Already in project directory
   npm install
   ```

2. **Configure environment**:

   ```bash
   # Copy environment file
   cp .env.example .env
   ```

3. **Update `.env` file** with your database credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=simple_ecommerce
   NODE_ENV=development
   PORT=3000
   ```

4. **Setup database and seed data**:

   ```bash
   # Complete setup (database, migrations, and sample data)
   npm run db:setup

   # Or step by step:
   npm run db:create    # Create database
   npm run db:migrate   # Run migrations
   npm run db:seed      # Add sample data

   # To remove seeded data
   npm run db:seed:undo
   ```

   **Note**: The `db:setup` script will automatically create your database, run all migrations, and populate it with sample data. This is perfect for getting started quickly!

5. **Running the Application**

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

### Troubleshooting Database Setup

If you encounter issues with database setup:

```bash
# Check if database exists and is accessible
npm run db:migrate:status

# Reset everything and start fresh
npm run db:seed:undo      # Remove sample data
npm run db:migrate:undo   # Rollback migrations (if needed)
npm run db:setup          # Set up everything again
```

## API Endpoints

### Categories

| Method | Endpoint                 | Description                                        |
| ------ | ------------------------ | -------------------------------------------------- |
| GET    | `/api/v1/categories`     | Get all categories (with pagination and filtering) |
| GET    | `/api/v1/categories/:id` | Get category by ID                                 |
| POST   | `/api/v1/categories`     | Create new category                                |
| PUT    | `/api/v1/categories/:id` | Update category                                    |
| DELETE | `/api/v1/categories/:id` | Delete category                                    |

### Products

| Method | Endpoint                                | Description                                      |
| ------ | --------------------------------------- | ------------------------------------------------ |
| GET    | `/api/v1/products`                      | Get all products (with pagination and filtering) |
| GET    | `/api/v1/products/:id`                  | Get product by ID                                |
| POST   | `/api/v1/products`                      | Create new product                               |
| PUT    | `/api/v1/products/:id`                  | Update product                                   |
| DELETE | `/api/v1/products/:id`                  | Delete product                                   |
| GET    | `/api/v1/products/category/:categoryId` | Get products by category                         |

### Orders

| Method | Endpoint                      | Description                                    |
| ------ | ----------------------------- | ---------------------------------------------- |
| GET    | `/api/v1/orders`              | Get all orders (with pagination and filtering) |
| GET    | `/api/v1/orders/:id`          | Get order by ID                                |
| POST   | `/api/v1/orders`              | Create new order                               |
| PUT    | `/api/v1/orders/:id`          | Update order status                            |
| DELETE | `/api/v1/orders/:id`          | Delete order                                   |
| GET    | `/api/v1/orders/user/:userId` | Get orders by user ID                          |

### Query Parameters (GET /categories)

- `search` - Search by name
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - ASC or DESC (default: DESC)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Example Requests

**Create Category:**

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics"}'
```

**Create Product:**

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "categoryId": 1,
    "sku": 12345,
    "description": "Latest iPhone model",
    "price": 999.99,
    "quantity": 50
  }'
```

**Create Order:**

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "products": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

**Get Categories:**

```bash
curl "http://localhost:3000/api/v1/categories?search=elect&page=1&limit=5"
```

**Update Category:**

```bash
curl -X PUT http://localhost:3000/api/v1/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Electronics"}'
```

## Database Schema

### Categories Table

| Column     | Type         | Constraints                                   |
| ---------- | ------------ | --------------------------------------------- |
| id         | INTEGER      | PRIMARY KEY, AUTO_INCREMENT                   |
| name       | VARCHAR(255) | NOT NULL, UNIQUE                              |
| created_at | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE |
| deleted_at | TIMESTAMP    | NULL (for soft deletes)                       |

### Products Table

| Column      | Type          | Constraints                                   |
| ----------- | ------------- | --------------------------------------------- |
| id          | INTEGER       | PRIMARY KEY, AUTO_INCREMENT                   |
| category_id | INTEGER       | FOREIGN KEY (categories.id), NOT NULL         |
| sku         | INTEGER       | NOT NULL, UNIQUE                              |
| name        | VARCHAR(255)  | NOT NULL                                      |
| description | TEXT          | NULL                                          |
| price       | DECIMAL(10,2) | NOT NULL                                      |
| quantity    | INTEGER       | NOT NULL, DEFAULT 0                           |
| created_at  | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at  | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE |
| deleted_at  | TIMESTAMP     | NULL (for soft deletes)                       |

### Orders Table

| Column     | Type          | Constraints                                   |
| ---------- | ------------- | --------------------------------------------- |
| id         | INTEGER       | PRIMARY KEY, AUTO_INCREMENT                   |
| user_id    | INTEGER       | NOT NULL                                      |
| total      | DECIMAL(10,2) | NOT NULL                                      |
| status     | ENUM          | NOT NULL, DEFAULT 'pending'                   |
| created_at | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### Order Details Table

| Column     | Type          | Constraints                                   |
| ---------- | ------------- | --------------------------------------------- |
| id         | INTEGER       | PRIMARY KEY, AUTO_INCREMENT                   |
| order_id   | INTEGER       | FOREIGN KEY (orders.id), NOT NULL             |
| product_id | INTEGER       | FOREIGN KEY (products.id), NOT NULL           |
| quantity   | INTEGER       | NOT NULL, DEFAULT 1                           |
| price      | DECIMAL(10,2) | NOT NULL                                      |
| created_at | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP           |
| updated_at | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE |

## Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server

### Database Setup

- `npm run db:setup` - Complete database setup with sample data
- `npm run db:create` - Create database only
- `npm run db:migrate` - Run migrations
- `npm run db:migrate:undo` - Rollback last migration
- `npm run db:seed` - Add sample data
- `npm run db:seed:undo` - Remove sample data

### Database Utilities

- `npm run db:migrate:status` - Check migration status

## Sample Data

When you run `npm run db:seed`, the following sample data will be added to your database:

### Categories (10 total)

- Electronics
- Clothing & Fashion
- Home & Garden
- Sports & Outdoors
- Books & Education
- Health & Beauty
- Toys & Games
- Automotive
- Food & Beverages
- Office Supplies

### Products (25+ total)

Sample products include:

- **Electronics**: iPhone 15 Pro, Samsung Galaxy S24, MacBook Pro, Sony Headphones, iPad Air
- **Clothing**: Denim Jeans, Cotton T-Shirts, Leather Jacket, Running Shoes
- **Home**: Coffee Maker, Garden Tools, Table Lamp
- **Sports**: Yoga Mat, Basketball, Camping Tent
- And many more across all categories...

### Sample Orders (5 total)

- Various order statuses (pending, delivered, cancelled)
- Different users and order combinations
- Realistic order details and pricing

## Project Structure Details

### Models

- TypeScript classes with Sequelize decorators
- Type-safe database interactions
- Built-in validation

### DTOs (Data Transfer Objects)

- Input validation using class-validator
- Separate DTOs for create/update operations
- Type safety for API requests

### Services

- Business logic layer
- Validation and error handling
- Interaction with repositories

### Repositories

- Data access layer
- Database operations abstraction
- Query building and execution

### Resources

- Response formatting
- Consistent API responses
- Data transformation for client consumption

### Middleware

- Request validation
- Error handling
- Security and logging

## Environment Variables

| Variable      | Description       | Default       |
| ------------- | ----------------- | ------------- |
| `NODE_ENV`    | Environment mode  | development   |
| `PORT`        | Server port       | 3000          |
| `DB_HOST`     | Database host     | localhost     |
| `DB_PORT`     | Database port     | 3306          |
| `DB_USERNAME` | Database username | root          |
| `DB_PASSWORD` | Database password | -             |
| `DB_DATABASE` | Database name     | second_chance |

## Development Notes

- Sequelize sync is disabled (`alter: false`) as requested
- Uses migrations for database schema changes
- Repository pattern for database operations
- Service pattern for business logic
- DTO validation for request validation
- Resource formatting for response consistency

## Health Check

Visit `http://localhost:3000/api/v1/health` to check if the API is running.
