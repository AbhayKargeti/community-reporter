# Community Reporter - Setup Guide

A Laravel + React + TypeScript community reporting system with role-based access control.

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 5.7+ or MariaDB
- Git

## 🚀 Quick Setup (New Machine)

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd community-reporter
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=community_reporter
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Run Migrations and Seeders

```bash
# Create database tables and seed demo data
php artisan migrate:fresh --seed
```

This will create:
- 3 roles: `admin`, `staff`, `citizen`
- 17 permissions
- 5 demo users (see credentials below)
- 5 sample reports with votes, comments, and activities

### 6. Storage Link

```bash
# Create symbolic link for file storage
php artisan storage:link
```

### 7. Start Development Servers

```bash
# Terminal 1: Start Laravel development server
php artisan serve

# Terminal 2: Start Vite development server
npm run dev
```

Visit: `http://localhost:8000`

## 👥 Demo User Credentials

| Role    | Email                     | Password   |
|---------|---------------------------|------------|
| Admin   | admin@example.com         | password   |
| Staff   | staff@example.com         | password   |
| Staff   | john.staff@example.com    | password   |
| Citizen | john@example.com          | password   |
| Citizen | jane@example.com          | password   |

## 📁 Project Structure

```
community-reporter/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Admin/
│   │       │   └── AdminReportController.php
│   │       └── Api/
│   │           ├── ReportController.php
│   │           ├── ReportVoteController.php
│   │           └── CommentController.php
│   └── Models/
│       ├── User.php
│       ├── Report.php
│       ├── Comment.php
│       ├── ReportVote.php
│       └── Activity.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── RolesAndPermissionsSeeder.php
│       └── DemoReportsSeeder.php
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Auth/
│       │   │   ├── Login.tsx
│       │   │   └── Register.tsx
│       │   ├── Admin/
│       │   │   └── Reports/
│       │   │       └── Index.tsx
│       │   └── Dashboard.tsx
│       └── Layouts/
│           └── AuthenticatedLayout.tsx
└── routes/
    ├── web.php
    └── api.php
```

## 🔑 Key Features

- **Authentication**: Laravel Breeze with React + TypeScript
- **Roles & Permissions**: Spatie Laravel Permission package
- **Admin Dashboard**: Comprehensive report management with filters, sorting, and bulk actions
- **API**: RESTful API with Sanctum authentication
- **Report Management**: Create, vote, comment, and track community issues
- **Activity Logging**: Complete audit trail of all actions

## 🛠️ Common Commands

```bash
# Clear all caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migration with seed
php artisan migrate:fresh --seed

# Run tests
php artisan test

# Build assets for production
npm run build

# Format code
npm run lint
```

## 🌐 Deployment

### Production Build

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables (Production)

Make sure to update these in your `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Set strong app key
APP_KEY=base64:your-generated-key

# Production database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-strong-password

# Queue configuration (recommended)
QUEUE_CONNECTION=database
```

## 🔒 Security Notes

1. **Change default passwords** for all demo users in production
2. **Never commit** `.env` file to git
3. **Set strong** `APP_KEY` using `php artisan key:generate`
4. **Enable** HTTPS in production
5. **Configure** CORS properly in `config/cors.php`
6. **Set** proper file permissions on storage and bootstrap/cache directories

## 📦 Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite
- **Database**: MySQL
- **Authentication**: Laravel Breeze + Sanctum
- **Permissions**: Spatie Laravel Permission

## 🐛 Troubleshooting

### MySQL Key Length Error
If you encounter "Specified key was too long" error:
```php
// Already configured in AppServiceProvider.php
Schema::defaultStringLength(191);
```

### Permission Denied on Storage
```bash
chmod -R 775 storage bootstrap/cache
```

### Node Module Issues
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Clear All Cache
```bash
php artisan optimize:clear
composer dump-autoload
```

## 📝 Development Workflow

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add: description of changes"
   ```

3. Push to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 📄 License

This project is open-sourced software licensed under the MIT license.
