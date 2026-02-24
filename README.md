# URL Shortening Service

A modern, full-featured URL shortening application built with Next.js 16, Prisma ORM, and NextAuth for secure user authentication. Create short, shareable links with optional password protection and track click analytics.

## Features

- **URL Shortening**: Convert long URLs into short, easy-to-share links using 6-character codes
- **User Authentication**: Secure user registration and login with email/password via NextAuth
- **Password Protection**: Add optional password protection to your shortened URLs
- **Click Tracking**: Monitor the number of times your shortened URLs are accessed
- **User Dashboard**: View and manage all your shortened URLs in one place
- **URL Deduplication**: Automatically reuse existing short codes for duplicate URLs
- **Material UI**: Modern, responsive user interface using Material-UI components
- **Database Persistence**: MySQL database with Prisma ORM for reliable data storage

## Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router), Material-UI 7
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma 6.19.2 ORM
- **Authentication**: NextAuth 4.24.13
- **Security**: bcryptjs for password hashing
- **Utilities**: nanoid for short code generation
- **Styling**: Emotion (CSS-in-JS)
- **Language**: TypeScript 5.9.3

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── migrations/             # Database migration history
│   └── migration_lock.toml
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Home page (URL shortener)
│   │   ├── dashboard/
│   │   │   └── page.tsx        # User dashboard for managing links
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── register/
│   │   │   └── page.tsx        # Registration page
│   │   ├── [id]/
│   │   │   ├── route.ts        # Short URL redirect endpoint
│   │   │   └── password/
│   │   │       └── page.tsx    # Password verification page
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts    # NextAuth authentication routes
│   │       ├── register/
│   │       │   └── route.ts    # User registration endpoint
│   │       ├── shorten/
│   │       │   └── route.ts    # URL shortening endpoint
│   │       ├── user-links/
│   │       │   └── route.ts    # Get user's shortened links
│   │       └── verify-password/
│   │           └── route.ts    # Password verification endpoint
│   ├── components/
│   │   └── Providers.tsx       # NextAuth session provider
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton
│   └── theme.ts                # Material-UI theme configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── prisma.config.ts            # Prisma configuration
├── next-env.d.ts               # Next.js TypeScript definitions
└── README.md                   # This file
```

## Database Schema

### User Model
- `id`: Unique identifier (auto-incrementing integer)
- `email`: Unique email address
- `password`: Hashed password for authentication
- `urls`: Relation to Url model (one-to-many)

### Url Model
- `id`: Unique identifier (auto-incrementing integer)
- `original`: The full URL being shortened
- `shortCode`: Unique 6-character short code
- `password`: Optional hashed password for protection
- `userId`: Optional reference to User (for authenticated links)
- `createdAt`: Timestamp when the link was created
- `clicks`: Counter for tracking access count

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MySQL 8.0+

### Steps

1. **Clone and install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```
   NETLIFY_DATABASE_URL="mysql://user:password@localhost:3306/url_shortener"
   NEXTAUTH_SECRET="your-random-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Setup the database**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

### Shortening a URL

1. Navigate to the home page
2. Enter your long URL in the input field
3. Optionally add a password to protect the link
4. Click "Shorten URL"
5. Copy the generated short URL

### Password-Protected Links

1. When creating a shortened URL, enter a password in the password field
2. When someone tries to access the protected link, they'll be prompted for the password
3. Only after providing the correct password will they be redirected to the original URL

### User Account Features

1. **Register**: Create an account with email and password
2. **Login**: Access your account to save and manage shortened URLs
3. **Dashboard**: View all your shortened links with:
   - Original URL
   - Short code
   - Number of clicks
   - Creation date
   - Option to delete links

### API Endpoints

#### POST `/api/shorten`
Create a new shortened URL
- **Body**: `{ url: string, password?: string }`
- **Response**: `{ shortUrl: string }`

#### GET `/api/user-links`
Retrieve all shortened URLs for authenticated user
- **Headers**: Requires NextAuth session
- **Response**: Array of URL objects

#### POST `/api/verify-password`
Verify password for protected links
- **Body**: `{ id: number, password: string }`
- **Response**: `{ valid: boolean }`

#### POST `/api/register`
Register a new user account
- **Body**: `{ email: string, password: string }`
- **Response**: User object or error

#### GET `/:id`
Redirect to original URL (with optional password verification)
- **Params**: `id` - short code
- **Response**: Redirect to original URL

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NETLIFY_DATABASE_URL` | MySQL database connection string | `mysql://user:pass@localhost:3306/db` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth encryption | `your-random-key` |
| `NEXTAUTH_URL` | Application URL for authentication | `http://localhost:3000` |

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs (10 salt rounds)
- **Session Management**: Secure session handling with NextAuth
- **URL Validation**: Validates URLs before shortening
- **Optional Password Protection**: URLs can be protected with passwords
- **User Association**: Shortened URLs can be associated with user accounts

## Performance Considerations

- **Short Codes**: Uses nanoid library for generating unique, URL-safe 6-character codes
- **URL Deduplication**: Checks for existing URLs to avoid creating duplicate entries
- **Database Indexing**: Prisma generates optimal indexes for unique fields
- **Click Tracking**: Simple integer counter for efficient analytics

## Known Limitations

- Short codes are randomly generated (not sequential or custom)
- Maximum password length depends on bcryptjs limitations
- Click tracking is basic (no detailed analytics like timestamp, location, etc.)
- No link expiration feature
- No rate limiting on API endpoints

## Future Enhancements

- [ ] Custom short codes selection
- [ ] Link expiration/TTL support
- [ ] Advanced analytics with timestamp and IP tracking
- [ ] QR code generation for shortened URLs
- [ ] Bulk URL shortening
- [ ] API rate limiting and quotas
- [ ] Link preview before redirect
- [ ] Social sharing statistics
- [ ] Email notifications for link creation

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check `NETLIFY_DATABASE_URL` in `.env.local`
- Ensure database user has appropriate permissions

### NextAuth Configuration Issue
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your application URL
- Clear `.next` build folder and rebuild

### URL Validation Fails
- Ensure URLs include protocol (http:// or https://)
- Check for special characters that need encoding
- Use absolute URLs, not relative paths

## Contributing

This project is open for improvements. Feel free to submit issues or pull requests.

## License

ISC

## Author

Created as a modern URL shortening service demonstration.

## Support

For issues or questions, please check the project structure and ensure all environment variables are properly configured.
