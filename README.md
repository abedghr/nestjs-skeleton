# NestJS Glow App Backend

## Description

This project is a NestJS template with common modules and a user module.

## Table of Contents

- [NestJS Glow App Backend](#nestjs-glow-app-backend)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
    - [Overview](#overview)
    - [Directories](#directories)

## Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   yarn install

## Usage

Before running the project, make sure to create a `.env` file by copying the `.env-example` file and filling in the required environment variables.

With this addition, users will understand how to set up their environment variables and run the project in different modes.

To run the project, you can use one of the following commands:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Project Structure

### Overview

This project follows a typical NestJS structure with additional directories for common modules, user modules, languages, and the main application.


### Directories

- **common:** Contains common modules used throughout the application.
- **modules:** Contains user-specific modules.
- **languages:** Directory for language files.
- **app:** Main application directory.

```bash
src/
│
├── common/ # Common modules used throughout the application
│ ├── auth/
│ ├── aws/
│ ├── configs/
│ ├── database/
│ ├── debugger/
│ ├── doc/
│ ├── error/
│ ├── file/
│ ├── helper/
│ ├── message/
│ ├── pagination/
│ ├── request/
│ ├── response/
│ └── common.module.ts
│
├── modules/ # User Specific modules.
│ └── user/
│
├── languages/ # Directory for language files
│
└── app/ # Main application directory
```
