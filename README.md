# Vacation Booking API

## Description

The Vacation Booking API is a Node.js application that allows users to manage properties and reservations. Users can create, read, update, and delete properties and reservations. The API supports filtering, sorting, and paging for properties. The authentication is handled using JWT (JSON Web Tokens).

## Features

- CRUD operations for Users, Properties and Reservations
- Filtering and sorting for properties based on capacity and price
- Pagination for property listing
- Authentication using JWT
- Input validation using express-validator
- Error handaling

## Database diagram

<img src="https://github.com/PaulaB03/VacationBookingAPI/blob/main/bd.jpg">

## Flow Chart

<img src="https://github.com/PaulaB03/VacationBookingAPI/blob/main/flowchart.jpg">

## Setup

### 1. Clone the repository

```
git clone https://github.com/PaulaB03/VacationBookingAPI
cd https://github.com/PaulaB03/VacationBookingAPI
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a new *env* file in the root of the project and configure the environment variables based on your connection

```
DB_NAME=bookingapp
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost
JWT_SECRET=yourjwtsecret
```

### 4. Start the application

```
node app.js
```

The application will run on *http://localhost:3000*
