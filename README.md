# Community Reporter

A community issue reporting platform where users can report problems with images and locations, upvote reports, and track their resolution status.

## 🚀 Quick Start

### Prerequisites

-   PHP 8.2+
-   MySQL
-   Node.js & NPM
-   Composer

### Installation

1. **Clone and Install Dependencies**

```bash
composer install
npm install
```

2. **Configure Environment**

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials:

```
DB_DATABASE=community_reporter
DB_USERNAME=root
DB_PASSWORD=your_password
```

3. **Setup Database**

```bash
php artisan migrate
php artisan db:seed --class=DemoSeeder
php artisan storage:link
```

4. **Start Development Servers**

```bash
# Terminal 1 - Laravel Backend
php artisan serve

# Terminal 2 - Vite Frontend
npm run dev
```

5. **Access Application**

-   Frontend: http://localhost:8000
-   Login: `admin@example.com` / `password`

## 📋 Features

### Core Functionality

-   ✅ User authentication (Laravel Breeze + Sanctum)
-   ✅ Create reports with title, description, category
-   ✅ Upload multiple images per report (1-10 images)
-   ✅ Geolocation support (latitude/longitude)
-   ✅ Upvote system (one vote per user per report)
-   ✅ Comment on reports
-   ✅ Filter reports by status and category
-   ✅ Search reports by text
-   ✅ Sort by newest/oldest/most voted
-   ✅ Admin status management
-   ✅ Activity logging (audit trail)
-   ✅ Authorization (owner or admin)

### Report Status Flow

```
pending → assessed → in_progress → resolved
                                 ↓
                              rejected
```

## 🗄️ Database Schema

### Tables

-   **users** - User accounts with roles (user/admin)
-   **profiles** - Extended user info (phone, address)
-   **reports** - Issue reports with status and location
-   **report_images** - Multiple images per report
-   **report_votes** - Upvotes (unique per user per report)
-   **comments** - Report discussions
-   **activities** - Audit log for all actions

### Key Relationships

```
User
  ├── has one Profile
  ├── has many Reports
  ├── has many Votes
  └── has many Comments

Report
  ├── belongs to User
  ├── has many Images
  ├── has many Votes
  └── has many Comments
```

## 🔌 API Endpoints

### Public Endpoints

```http
GET  /api/reports              # List all reports
GET  /api/reports/{id}         # Get single report details
```

### Authenticated Endpoints

Requires `Authorization: Bearer {token}` header

```http
POST   /api/reports                  # Create new report
DELETE /api/reports/{id}             # Delete report (owner/admin)
POST   /api/reports/{id}/vote        # Toggle upvote
POST   /api/reports/{id}/comments    # Add comment
DELETE /api/comments/{id}            # Delete comment (owner/admin)
```

### Admin Only Endpoints

```http
PATCH /api/reports/{id}/status  # Update report status
```

## 📝 API Usage Examples

### Authentication

```bash
# Register
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@example.com","password":"password","password_confirmation":"password"}'

# Login (returns token)
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Create Report

```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Broken Street Light" \
  -F "description=The light is not working" \
  -F "category=Infrastructure" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=Main St, New York" \
  -F "images[]=@image1.jpg" \
  -F "images[]=@image2.jpg"
```

### List Reports with Filters

```bash
# Filter by status
curl "http://localhost:8000/api/reports?status=pending"

# Search
curl "http://localhost:8000/api/reports?search=street"

# Sort by most voted
curl "http://localhost:8000/api/reports?sort=most_voted"
```

### Vote on Report

```bash
curl -X POST http://localhost:8000/api/reports/1/vote \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Comment

```bash
curl -X POST http://localhost:8000/api/reports/1/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body":"I noticed this issue too!"}'
```

### Update Status (Admin)

```bash
curl -X PATCH http://localhost:8000/api/reports/1/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

## 👥 Test Accounts

The `DemoSeeder` creates these accounts:

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@example.com | password |
| User  | john@example.com  | password |
| User  | jane@example.com  | password |

**Sample Data Included:**

-   3 reports with different statuses
-   Vote relationships
-   Comment examples

## 🛠️ Technology Stack

### Backend

-   **Framework:** Laravel 11
-   **Authentication:** Laravel Sanctum
-   **Database:** MySQL
-   **Storage:** Local filesystem (public disk)

### Frontend

-   **Framework:** React 18 with TypeScript
-   **Routing:** Inertia.js
-   **Styling:** Tailwind CSS 3
-   **Build Tool:** Vite

### Key Packages

-   Laravel Breeze (authentication scaffolding)
-   Headless UI (accessible components)
-   Tailwind Forms (form styling)

## 📂 Project Structure

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── ReportController.php       # CRUD operations
│   │   ├── ReportVoteController.php   # Voting logic
│   │   └── CommentController.php      # Comment management
│   └── Requests/
│       ├── StoreReportRequest.php
│       ├── UpdateReportStatusRequest.php
│       └── StoreCommentRequest.php
└── Models/
    ├── User.php
    ├── Profile.php
    ├── Report.php                     # Scopes: byStatus, byCategory, search
    ├── ReportImage.php
    ├── ReportVote.php
    ├── Comment.php
    └── Activity.php                   # Activity::log() method

database/
├── migrations/                        # All table schemas
└── seeders/
    └── DemoSeeder.php                # Test data

resources/
├── js/
│   ├── Pages/Auth/
│   │   ├── Login.tsx                 # Modern login page
│   │   └── Register.tsx              # Registration page
│   └── Layouts/
│       └── GuestLayout.tsx           # Split-screen auth layout
└── css/
    └── app.css                       # Tailwind + custom styles

routes/
├── web.php                           # Web routes (redirects to login)
└── api.php                           # API endpoints
```

## 🔒 Security Features

-   ✅ Password hashing (bcrypt)
-   ✅ Sanctum token authentication
-   ✅ Authorization checks (owner/admin)
-   ✅ Input validation (Form Requests)
-   ✅ File upload validation (type, size, count)
-   ✅ Unique constraints (prevent duplicate votes)
-   ✅ SQL injection prevention (Eloquent ORM)
-   ✅ XSS prevention (JSON responses)
-   ✅ CSRF protection (web routes)

## 🧪 Testing

### Database Console

```bash
php artisan tinker
```

```php
// Check reports
Report::withCount('votes')->get();

// Find user
User::where('email', 'admin@example.com')->first();

// Recent activities
Activity::latest()->take(5)->get();
```

### Reset Database

```bash
php artisan migrate:fresh --seed
```

## 🎨 Frontend Pages

-   `/` - Redirects to login
-   `/login` - Beautiful split-screen login page
-   `/register` - Registration with validation
-   `/dashboard` - User dashboard (after authentication)

The authentication pages feature:

-   Modern gradient design (indigo → purple → pink)
-   Responsive layout
-   Loading states
-   Form validation
-   Clean typography

## 📊 Models & Key Methods

### User Model

```php
$user->isAdmin()              // Check if admin
$user->reports                // User's reports
$user->votes                  // User's votes
```

### Report Model

```php
Report::byStatus('pending')   // Filter by status
Report::byCategory('Roads')   // Filter by category
Report::search('pothole')     // Search text

$report->votesCount()         // Get vote count
$report->hasVotedBy($userId)  // Check if user voted
```

### Activity Model

```php
Activity::log('report_created', Report::class, $reportId, ['title' => '...']);
```

## 🚧 Next Development Steps

### Frontend Development

1. Create report list page with filters
2. Build report detail page with image carousel
3. Add map integration (Google Maps/Leaflet)
4. Implement geolocation picker
5. Create admin dashboard

### Advanced Features

1. Email notifications on status changes
2. Real-time updates (Laravel Echo)
3. Image optimization/thumbnails
4. PDF export of reports
5. Analytics dashboard
6. Mobile app (React Native)

## 🐛 Troubleshooting

### Database Issues

```bash
# Check connection
php artisan migrate:status

# Reset database
php artisan migrate:fresh --seed
```

### Storage Issues

```bash
# Recreate storage link
php artisan storage:link
```

### Cache Issues

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 📄 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
