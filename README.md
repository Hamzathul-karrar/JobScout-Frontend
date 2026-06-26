# JobScout 

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://jobscout-app.netlify.app/)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-blue.svg)](https://github.com/Hamzathul-karrar/JobScout-Backend)

JobScout is a React-based frontend application built with Vite that helps users find job opportunities. It provides a platform to search for jobs, explore various job portals, and manage user authentication.

## Features

- **Job Search**: Integrated job search functionality.
- **Job Portals Directory**: A curated list of various job portals for easy access.
- **User Authentication**: Secure Login, Registration, and Logout capabilities.
- **Protected Routes**: Ensuring only authenticated users can access specific features.
- **Skeleton Loaders**: Enhanced user experience with loading skeletons during data fetching and component lazy loading.


## Technologies Used

- **React 19**: Frontend UI library.
- **Vite**: Next Generation Frontend Tooling for fast builds and HMR.
- **React Router DOM**: Declarative routing for React applications.
- **React Hot Toast**: Notifications and toasts.
- **ESLint**: Linter for code quality.

## Project Structure

- `src/components/`: Contains all the React components (Home, Login, Register, JobPortals, SearchJobGoogle, etc.).
- `src/contexts/`: React context providers (e.g., `AuthContext` for authentication state).
- `src/hooks/`: Custom React hooks.
- `src/Skeletons/`: Skeleton loading components for better UI feedback.
- `src/utils/`: Utility functions and helpers.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hamzathul-karrar/JobScout-Frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd JobScout-Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

