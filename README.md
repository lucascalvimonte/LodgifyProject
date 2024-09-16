# Lodgify Junior Automation QA Challenge

## Overview

This project contains automated tests designed for the **Lodgify Junior Automation QA Challenge**. The objective is to validate key functionalities in **ClickUp** through a series of test scenarios, both via the web application and the ClickUp API.

## Test Scenarios Covered

### 1. Create Space via API

- Adds a new space to a workspace via API.
- Logs into the web application.
- Verifies in the UI that the space has been created.

### 2. Create Task via Web Application

- Creates a test task inside a folder within the space created in Scenario 1.
- Using API to verify that the task was created correctly.

### 3. Create Task via API

- Creates a test task directly via the API.
- Logs into the web application.
- Verifies through the UI that the task has been created.

## Pre-requisites

- You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
- Clone the repository to your local environment.
- Install dependencies using the command:

```bash
npm install
```

## Cypress Environment Configuration

To execute the tests locally, you will need to configure a few environment variables. Create a cypress.env.json file in the root of the project with the following structure:

```json
{
  "email": "your-email@example.com",
  "password": "your-password",
  "apiToken": "your-api-token"
}
```

Replace the placeholders with your actual ClickUp credentials and API token. You can find your API token by navigating to [ClickUp API Authentication](https://clickup.com/api/developer-portal/authentication/#personal-token).

## Running the Tests

Once you have set up the environment, you can run the Cypress tests using the following command:

```bash
npx cypress open
```

This will open the Cypress Test Runner where you can select the test file to run.

Alternatively, you can run the tests headlessly:

```bash
npx cypress run
```

## Test Structure

Test File: The main test file is located in the cypress/e2e directory and named validate_space_and_task_creation.cy.js.
Commands: The reusable Cypress commands (e.g., for logging in, creating tasks, verifying tasks via API) are defined in cypress/support/commands.js.

## Additional Notes

The tests validate both the UI functionality and the API responses for creating spaces and tasks in ClickUp.
For Scenario 2, a combination of UI interaction and API validation is used to ensure the task is created successfully.
The framework is modular and scalable, allowing for easy addition of more test cases in the future.

## Reporting & Screenshots

Cypress automatically generates reports for each test run, and screenshots are captured for failed test cases.
