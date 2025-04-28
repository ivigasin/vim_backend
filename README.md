
# User Notifications Manager

**User Notifications Manager** is a backend service that:
- Manages user notification preferences.
- Sends notifications based on user preferences via the provided **Notification Service**.

---

## 🚀 Project Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v23 or later)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

---

## ⚙️ Project Execution

In the terminal, you can run the following commands:

- **Development Environment**  
  ```bash
  npm run dev
  ```

- **Build Project**  
  ```bash
  npm run build
  ```

- **Production Environment**  
  ```bash
  npm run start
  ```

- **Docker Execution**  
  (Runs the service together with the Notification Service)
  ```bash
  npm run docker:up
  ```
  or
  ```bash
  docker-compose up --build
  ```

---

## 🛠 Settings

Project container settings are managed through:
- `docker-compose.yml`

---

## ➕ Adding New Notification Endpoints

You can easily add a new notification endpoint by adding configuration variables following this convention:

```env
NOTIFICATION_{servicetype}_ENDPOINT=http://notification-service:5001/send-email
NOTIFICATION_{servicetype}_HTTP_METHOD=POST
NOTIFICATION_{servicetype}_USER_PROPERTY=email
NOTIFICATION_{servicetype}_RATE_LIMIT=5
NOTIFICATION_{servicetype}_TIME_WINDOW_MS=1000
NOTIFICATION_{servicetype}_MAX_RETRIES=5
NOTIFICATION_{servicetype}_INITIAL_BACKOFF_MS=1000
```

Where:
- `{servicetype}` is the type of service (e.g., `EMAIL`, `SMS`, etc.).
- The service endpoint should accept a JSON body in the following format:
  ```json
  {
    "{NOTIFICATION_{servicetype}_USER_PROPERTY}": "+1234567890",
    "message": "Hello via SMS!"
  }
  ```

- The `{servicetype}` must also be enabled and embedded in the user's preferences.

---

## 🧪 Testing

- A `test_requests.sh` script is provided to quickly test most of the main methods in both successful and failure scenarios.
- To run it:
  ```bash
   ./test_requests.sh
  ```

---

## ⚡ Performance and Error Handling

- Rate-limiting and chunking mechanisms are used to manage load across notification services.
- Exponential backoff strategy is used to retry failed notification requests, improving robustness.

---

## 🏗️ Architecture

- **Model-View-Controller (MVC)** approach.
- Uses **Middlewares** for:
  - Authentication
  - Validation
  - Error handling
- RateLiimiting with sliding window
- Exponential Backoff
---

## 👨‍💻 Developed By Igor Vigasin

**User Notifications Manager** was developed using clean architectural principles to ensure maintainability and scalability.
