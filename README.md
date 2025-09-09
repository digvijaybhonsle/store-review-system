# Store Review System

A full-stack web application for managing stores, users, and reviews. Users can submit reviews, store owners can manage their stores, and admins can oversee the entire system.  

---

## Features

### Admin Dashboard
- View all stores, users, and ratings.  
- Add new users and stores.  
- Filter users by name or role.  

### User Dashboard
- Submit ratings and reviews for stores (normal users only).  
- View all submitted reviews.  

### Owner Dashboard
- Add and manage owned stores.  
- View reviews submitted on their stores.  

### Stores Page
- Browse all stores with average ratings and user reviews.  
- Filter by store name or rating.  

---

## Required Fields

### User
| Field     | Type   | Description                           |
|-----------|--------|---------------------------------------|
| name      | string | Full name of the user                 |
| email     | string | Email address (unique)               |
| password  | string | Account password                      |
| address   | string | User address                          |
| role      | string | `user`, `admin`, or `store_owner`    |

### Store
| Field     | Type   | Description                               |
|-----------|--------|-------------------------------------------|
| name      | string | Store name                                |
| email     | string | Store contact email                       |
| address   | string | Store address                             |
| owner_id  | string | Reference to owner (optional for admin)  |

### Review / Rating
| Field      | Type   | Description                                |
|------------|--------|--------------------------------------------|
| store_id   | string | ID of the store being reviewed             |
| rating     | number | Rating between 1-5                         |
| review     | string | Text of the review (optional)              |
| user_id    | string | Reference to user submitting review        |

---

## Installation of Frontend

1. Clone the repository:  
   ```bash
   git clone <repo-url>
    ```

2. Directory
    ```
    cd Backend
    ```

3. Install Dependencies:
    ```bash
    npm install
    ```

4. Run the Frontend:
    ```bash
    npm run dev
    ```

## Installation of Backend

1. Directory
    ```bash
    cd Frontend
    ```
    
2. Install Dependencies:
    ```bash
    npm install
    ```

3. Run the Frontend:
    ```bash
    npm start
    ```
