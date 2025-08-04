# MSK Travels - Production Deployment Guide

## 🗄️ Database Setup

### Current Setup (Development)
- **Database**: SQLite (`db.sqlite3`)
- **Location**: `backend/db.sqlite3`
- **Use Case**: Development and testing

### Production Database Options

#### 1. PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE msk_travels_db;
CREATE USER msk_travels_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE msk_travels_db TO msk_travels_user;
\q
```

#### 2. MySQL/MariaDB
```bash
# Install MySQL
sudo apt-get install mysql-server

# Create database and user
sudo mysql -u root -p
CREATE DATABASE msk_travels_db;
CREATE USER 'msk_travels_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON msk_travels_db.* TO 'msk_travels_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🔧 Environment Configuration

### 1. Create Environment File
Create `.env` file in `backend/` directory:

```bash
# Django Settings
SECRET_KEY=your-super-secret-key-here
DEBUG=False

# Database Settings (PostgreSQL)
DB_NAME=msk_travels_db
DB_USER=msk_travels_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# WhatsApp Settings
WHATSAPP_NUMBER=919876543210
```

### 2. Update Production Settings
Edit `backend/msk_travels/settings_production.py`:
```python
ALLOWED_HOSTS = [
    'your-domain.com',
    'www.your-domain.com',
    'your-server-ip',
]

CORS_ALLOWED_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com",
]
```

## 🚀 Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
sudo apt-get install python3 python3-pip python3-venv nginx postgresql postgresql-contrib

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/your-username/travels_webpage.git
cd travels_webpage

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file with your settings
nano .env

# Run migrations
python manage.py migrate --settings=msk_travels.settings_production

# Create superuser
python manage.py createsuperuser --settings=msk_travels.settings_production

# Collect static files
python manage.py collectstatic --settings=msk_travels.settings_production

# Frontend setup
cd ../frontend
npm install
npm run build
```

### 3. Gunicorn Setup
Create `backend/gunicorn.conf.py`:
```python
bind = "127.0.0.1:8000"
workers = 3
timeout = 120
max_requests = 1000
max_requests_jitter = 100
```

Create systemd service `/etc/systemd/system/msk-travels.service`:
```ini
[Unit]
Description=MSK Travels Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/travels_webpage/backend
Environment="PATH=/path/to/travels_webpage/backend/venv/bin"
ExecStart=/path/to/travels_webpage/backend/venv/bin/gunicorn --config gunicorn.conf.py msk_travels.wsgi:application --settings=msk_travels.settings_production
Restart=always

[Install]
WantedBy=multi-user.target
```

### 4. Nginx Configuration
Create `/etc/nginx/sites-available/msk-travels`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend (React)
    location / {
        root /path/to/travels_webpage/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin interface
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files
    location /media/ {
        alias /path/to/travels_webpage/backend/media/;
    }

    # Static files
    location /static/ {
        alias /path/to/travels_webpage/backend/staticfiles/;
    }
}
```

### 5. Start Services
```bash
# Enable and start services
sudo systemctl enable msk-travels
sudo systemctl start msk-travels
sudo systemctl enable nginx
sudo systemctl start nginx

# Enable site
sudo ln -s /etc/nginx/sites-available/msk-travels /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Checklist

- [ ] Change default Django secret key
- [ ] Use strong database passwords
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall (ufw)
- [ ] Set up regular backups
- [ ] Enable automatic security updates
- [ ] Configure log monitoring
- [ ] Set up error tracking (Sentry)

## 📊 Database Management

### Backup Database
```bash
# PostgreSQL
pg_dump msk_travels_db > backup_$(date +%Y%m%d_%H%M%S).sql

# MySQL
mysqldump -u msk_travels_user -p msk_travels_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# PostgreSQL
psql msk_travels_db < backup_file.sql

# MySQL
mysql -u msk_travels_user -p msk_travels_db < backup_file.sql
```

### Monitor Database
```bash
# Check database size
psql -d msk_travels_db -c "SELECT pg_size_pretty(pg_database_size('msk_travels_db'));"

# Check table sizes
psql -d msk_travels_db -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## 🚀 Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_vehicle_type ON vehicles_vehicle(vehicle_type);
CREATE INDEX idx_booking_dates ON bookings_booking(start_date, end_date);
CREATE INDEX idx_user_email ON users_user(email);
```

### Caching (Redis)
```bash
# Install Redis
sudo apt-get install redis-server

# Add to requirements.txt
redis==4.6.0
django-redis==5.3.0
```

### CDN for Static Files
- Use Cloudflare or AWS CloudFront
- Configure static file caching
- Enable image optimization

## 📈 Monitoring

### Health Checks
```bash
# Check application status
curl -f http://localhost:8000/api/health/

# Check database connection
python manage.py dbshell --settings=msk_travels.settings_production
```

### Log Monitoring
```bash
# View application logs
sudo journalctl -u msk-travels -f

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Update dependencies
pip install -r requirements.txt
npm install

# Run migrations
python manage.py migrate --settings=msk_travels.settings_production

# Collect static files
python manage.py collectstatic --settings=msk_travels.settings_production

# Restart services
sudo systemctl restart msk-travels
sudo systemctl reload nginx
```

### Database Maintenance
```bash
# PostgreSQL maintenance
sudo -u postgres vacuumdb msk_travels_db
sudo -u postgres reindexdb msk_travels_db

# MySQL maintenance
mysqlcheck -u msk_travels_user -p --optimize --all-databases
```

This deployment guide ensures your MSK Travels application runs securely and efficiently in production! 🎯 