# Writing Assistant Application

This is a web application that provides tools for grammar checking, paraphrasing, and text completion using OpenAI's GPT-3.5-turbo model. The application is built with Node.js, Express, Sequelize, Passport for authentication, and EJS for templating.

## Features

- **Google OAuth Authentication:** Secure login using Google OAuth.
- **Grammar Check:** Check and correct grammar in user-provided text.
- **Paraphrasing:** Paraphrase user-provided text.
- **Text Completion:** Complete the user-provided text.
- **Activity Logging:** Log user activities including input and output texts along with timestamps.

## Prerequisites

- Node.js and npm installed
- Google OAuth 2.0 credentials (Client ID and Client Secret)
- OpenAI API Key
- Google Custom Search Engine (CSE) ID and API Key

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/writing-assistant.git
    cd writing-assistant
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```bash
    touch .env
    ```

   Add the following variables to the `.env` file:

    ```env
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    OPENAI_API_KEY=your-openai-api-key
    PORT=3000
   GOOGLE_API_KEY=
   GOOGLE_CSE_ID=
    ```

## Database Setup

The application uses SQLite as the database. Sequelize is used as the ORM for database interactions.

