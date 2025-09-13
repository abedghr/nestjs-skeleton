# NestJS Skeleton

## Description

This project is a NestJS template with common modules

## Table of Contents

- [NestJS Skeleton](#nestjs-skeleton)
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

This project follows a typical NestJS structure with additional directories for common modules, user and business requirements modules, languages, and the main application.


### Directories

- **app:** Main application directory.
- **common:** Contains common modules used throughout the application.
- **modules:** Contains business logic required modules.
- **languages:** Directory for language files.
- **configs:** Directory for configuration files.
- **migrations:** Directory for migrations files.
- **router:** Directory for routes.
- **worker:** Directory for workers and jobs.

```bash
ci/
│
src/
│
├── app/ # Common modules used throughout the application
├── common/ # Common modules used throughout the application
│ ├── database/
│ ├── doc/
│ ├── file/
│ ├── helper/
│ ├── message/
│ ├── pagination/
│ ├── redis/
│ ├── request/
│ ├── response/
│ └── common.module.ts
│
├── configs/
├── languages/
├── migrations/
├── modules/
│ ├── auth/
│ ├── aws/
│ ├── configs/
│ ├── policy/
│ ├── role/
│ ├── role/
│
├── router/
├── worker/
```
