# Pastebin Lite 🚀
A fast, minimalist full-stack code and text-sharing application.

## Overview
This is my first full-stack application! It allows users to instantly save text or code snippets and generates a unique, shareable URL.

## Tech Stack
- **Frontend:** React.js, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Deployment:** Vercel (Frontend) & Render (Backend)

## Key Features
- **Instant Persistence:** Save data to a cloud database with a single click.
- **Dynamic Routing:** Unique UUIDs generated for every paste for secure sharing.
- **Cross-Origin Communication:** Frontend and Backend hosted on separate platforms interacting via REST API.
- **SPA Stability:** Custom Vercel configuration to handle client-side routing.

## Challenges & Learnings
- **Database Connectivity:** Configured MongoDB Atlas with IP whitelisting and secure connection strings.
- **Environment Variables:** Managed sensitive API keys and URIs across different deployment environments.
- **Routing:** Implemented `vercel.json` rewrites to support deep-linking in a Single Page Application (SPA).

## How to Use
1. Enter your text or code into the editor.
2. Click **Save**.
3. Copy the generated link and share it!
