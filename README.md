# Wink Identity Web – Next.js Starter Kit

Next.js starter kit for integrating the **Wink Identity Web SDK** into web applications. This project provides a reference implementation for launching identity verification flows such as face capture and liveness authentication within a Next.js (App Router) environment.

---

## Features

-   Wink Identity Web SDK integration
-   Face capture & liveness checks
-   Built with Next.js 13+ (App Router) and **TypeScript**
-   Reusable `WinkAuthProvider` and `useWinkAuth()` hook
-   Internal API routes for session and user (no external backend required)
-   Lightweight & customizable UI with Tailwind CSS
-   Sample verification journey with profile display

---

## Project Structure

```
wink-identity-web-next-js-starter-kit/
├── app/
│   ├── api/wink/          (session + user API routes)
│   ├── callback/          (cancel URL handler)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── WinkAuthProvider.tsx
├── lib/
│   └── winkAuth.ts
├── types/
│   └── wink.ts
├── public/
│   └── silent-check-sso.html
├── .env.example
├── package.json
└── README.md
```

---

## Prerequisites

-   Node.js (v18+ recommended)
-   Wink Identity API Credentials
-   Verification workflow configured
-   SDK access enabled

Contact Wink Identity support using the channels listed in the [Wink Developer Hub](https://docs.wink.cloud/) if credentials are required.

---

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/wink-cloud/wink-identity-web-next-js-starter-kit.git
    cd wink-identity-web-next-js-starter-kit
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure environment variables**

    Copy `.env.example` to `.env.local` and set your Wink credentials. The client secret is **never** used in the frontend.

    ```bash
    cp .env.example .env.local
    # Edit .env.local with your credentials
    ```

4.  **Start the development server**

    ```bash
    npm run dev
    ```

    The app will be available at:

    ```
    http://localhost:3000
    ```

---

## Configuration Options

Refer to the [wink-identity-sdk](https://www.npmjs.com/package/wink-identity-sdk) package and the [Wink Developer Hub](https://docs.wink.cloud/) for details.

### Environment Variables

| Variable | Purpose | Client / Server |
|----------|---------|-----------------|
| `NEXT_PUBLIC_WINK_CLIENT_ID` | Wink client ID | Client (safe) |
| `NEXT_PUBLIC_WINK_REALM` | Wink realm | Client (safe) |
| `NEXT_PUBLIC_WINK_BASE_URL` | Wink API base (staging/production) | Client (safe) |
| `NEXT_PUBLIC_WINK_AUTH_URL` | Wink Auth base (staging/production) | Client (safe) |
| `WINK_IDENTITY_BASE_URL` | Wink API base for server-side calls | **Server only** |
| `WINK_IDENTITY_CLIENT_ID` | Client ID for API routes | **Server only** |
| `WINK_IDENTITY_SECRET` | Client secret for API routes | **Server only** (never exposed) |

The starter uses internal Next.js API routes. No external backend is required. Session creation and user profile verification are handled server-side via `/api/wink/session` and `/api/wink/user`.

---

## Integration Flow

This starter uses the official npm-first integration approach:

-   **`winkInit()`** – SDK initialization and silent SSO check
-   **`winkLogin()`** – Authentication (session obtained from internal API route before calling)
-   **`winkLogout()` / OIDC logout** – Sign out with standards-based OIDC end-session URL
-   **User profile** – Fetched via internal API route (`GET /api/wink/user`) after authentication
-   **Session** – Created via internal API route (`GET /api/wink/session`) before login

---

## User Profile Demonstration

After successful authentication, the UI displays the profile returned by the internal API route, including:

-   `firstName`
-   `lastName`
-   `email`
-   `contactNo`
-   `winkTag`
-   `winkToken`
-   `expiryTime`

---

## Testing Flow

1.  Launch the application with `npm run dev`
2.  Click **Login with Wink**
3.  Complete the Wink authentication flow
4.  Confirm the `Status` is `authenticated`
5.  Confirm the **Authenticated User Profile** panel is rendered
6.  Click **Refresh Profile** to re-fetch profile data
7.  Click **Logout** to clear local session and sign out

> **Logout note:** Wink supports browser-local SSO. If the token/session is still valid, a new sign-in can be restored quickly after logout. This is expected behavior in OAuth/SSO flows.

---

## Before Going Live

-   Use **production** Wink API and Auth URLs (replace staging endpoints)
-   Ensure `.env.local` and secrets are never committed; use your hosting env config
-   Run `npm run build` and test the production build with `npm run start`
-   Run `npm run typecheck` to validate TypeScript types
-   Run `npm run lint` to check code quality

---

## Deployment

Can be deployed on any Next.js-supported hosting:

-   Vercel
-   Netlify
-   AWS (Amplify, etc.)

Build command:

```bash
npm run build
```

Start command:

```bash
npm run start
```

---

## License

Internal / Partner Use – Wink Identity

---

## Support

For integration help, contact Wink Identity support using the channels listed in the [Wink Developer Hub](https://docs.wink.cloud/).
