# Travel Sphere

Travel Sphere is a social travel platform designed to help travelers discover destinations, share travel experiences, connect with other travelers, and maintain their travel information in one place.

## Overview

Planning and documenting travel often requires users to switch between multiple platforms for destination discovery, travel posts, social connections, and travel information. Travel Sphere brings these core activities together in a single platform.

The project follows a client-server architecture:

```text
React Frontend
      |
      | HTTP / REST API
      v
FastAPI Backend
      |
      | SQLAlchemy / Database Layer
      v
PostgreSQL Database
```

The frontend is responsible for the user interface and user interactions. The FastAPI backend exposes API endpoints, handles validation, authentication, and application logic, and communicates with the database through SQLAlchemy.

## Features

### MVP Features

- User registration, login, and logout
- User profile creation, viewing, and updating
- Create, view, and delete travel posts
- Follow and unfollow travelers
- Personalized feed containing posts from followed travelers
- Search and view destination information

### Planned / Future Features

- Trip management
- Likes, comments, and saved interactions
- Travel alerts
- Notifications
- Additional destination/location and map integration
- Administrative user and content management
- Reports and analytics

> Future functionality is represented separately in the project DFD so that it is not confused with the current MVP scope.

## System Architecture

### Frontend

The frontend provides the application's pages, forms, navigation, and user interactions. It communicates with the backend through REST API requests and receives data as API responses, typically in JSON format.

### Backend

The backend is built using **FastAPI**. It provides the API endpoints used by the frontend and is responsible for:

- Request validation
- Authentication and authorization
- Business logic
- CRUD operations
- Communication with the database
- Returning appropriate API responses

### Database

The project uses **PostgreSQL** for persistent data storage. The database is accessed from the backend through **SQLAlchemy**.

The main data stores represented in the system design are:

| Data Store | Purpose |
|---|---|
| D1 – Users | User account and profile information |
| D2 – Posts | Travel post information |
| D3 – Follows | Relationships between travelers |
| D4 – Destinations | Destination information |
| D5 – Trips (Future) | Planned trip information |
| D6 – Interactions (Future) | Likes, comments, saves, etc. |
| D7 – Alerts (Future) | Travel alert information |
| D8 – Notifications (Future) | Notification information |

## How Frontend and Backend Communicate

When a user performs an action, the frontend sends an HTTP request to the appropriate FastAPI endpoint.

For example, creating a travel post follows this flow:

```text
User
  |
  v
React Frontend
  |
  | POST request + post data
  v
FastAPI API Endpoint
  |
  v
Validation / Business Logic
  |
  v
SQLAlchemy
  |
  v
PostgreSQL
  |
  | Stored post / result
  v
FastAPI
  |
  | JSON response
  v
React Frontend
  |
  v
Updated UI
```

Similarly, retrieving posts generally follows:

```text
React Frontend
      |
      | GET request
      v
FastAPI
      |
      v
SQLAlchemy
      |
      v
PostgreSQL
      |
      v
FastAPI JSON Response
      |
      v
React Frontend
```

## Main Backend Modules

The system is organized around the following functional areas:

1. **User Management** – registration, authentication, and logout/session handling
2. **Profile Management** – creating, viewing, and updating profiles
3. **Post Management** – creating, viewing, and deleting travel posts
4. **Follow Management** – following, unfollowing, and viewing follower/following relationships
5. **Feed Management** – retrieving posts from followed travelers
6. **Destination Management** – searching destinations and viewing destination details
7. **Trip Management** – planned/future trip functionality
8. **Interaction Management** – planned/future likes, comments, saves, etc.
9. **Alert Management** – planned/future travel alerts
10. **Notification Management** – planned/future notifications

## DFD Structure

The project uses Data Flow Diagrams (DFDs) to describe how information moves through the system.

- **Level 0 – Context Diagram:** Represents Travel Sphere as a single system and shows its interaction with external entities such as the Traveler/User, Administrator, and Map/Location Service.
- **Level 1 DFD:** Decomposes the system into major management processes and their associated data stores.
- **Level 2 DFD:** Further decomposes Level 1 processes into smaller subprocesses.

The DFD distinguishes current MVP functionality from future/planned functionality.

## External Entities

### Traveler / User

The primary user of Travel Sphere. The traveler can register, log in, manage a profile, create and view posts, follow other travelers, view a personalized feed, and search for destinations.

### Administrator

Responsible for administrative activities such as user management, content moderation, report management, alerts, destination management, and viewing system reports and analytics.

### Map / Location Service

An external service used for location-related functionality such as place searches, geocoding, map data, and location details.

## Project Structure

A typical project structure is:

```text
Travel-Sphere/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── .env
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── README.md
└── ...
```

> The exact directory structure may change as development progresses. Update this section when major architectural changes are introduced.

## API Communication

The frontend uses an API client to communicate with the FastAPI backend.

Typical REST operations follow these HTTP methods:

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data or perform an action |
| PUT / PATCH | Update data |
| DELETE | Delete data |

For example, post-related APIs may conceptually use:

```text
POST   /api/posts
GET    /api/posts
DELETE /api/posts/{id}
```

The exact endpoint paths should match the implemented FastAPI routes.

## Development Workflow

The project is developed collaboratively using Git and separate branches for feature development.

A typical workflow is:

```text
Create / switch to feature branch
          |
          v
Implement feature
          |
          v
Test locally
          |
          v
Commit changes
          |
          v
Push branch
          |
          v
Review / merge
```

Frontend and backend work should be coordinated around the API contract so that both sides agree on:

- Endpoint URL
- HTTP method
- Request body
- Response format
- Authentication requirements
- Error responses

## Technologies

| Layer | Technology |
|---|---|
| Frontend | React / JavaScript |
| Backend | FastAPI / Python |
| ORM / Database Layer | SQLAlchemy |
| Database | PostgreSQL |
| API Style | REST |
| Data Format | JSON |
| Version Control | Git / GitHub |

## Project Status

Travel Sphere is being developed incrementally, with the MVP focusing on the core social-travel functionality. Additional trip, interaction, alert, notification, and administrative capabilities are planned as future extensions.

## Team

Travel Sphere is a collaborative academic software engineering project.

## License

This project is developed for academic/project purposes.
