
# PHP/MySQL Deployment Instructions

## Prerequisites
- Apache/Nginx web server
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Composer

## Installation Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install LAMP stack
sudo apt install apache2 mysql-server php php-mysql php-json php-mbstring composer -y

# Enable Apache modules
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. Database Setup
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE youthnet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'youthnet_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON youthnet_db.* TO 'youthnet_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Deploy PHP Application
```bash
# Navigate to web directory
cd /var/www/html

# Create directory for API
sudo mkdir youthnet-api
sudo chown $USER:$USER youthnet-api
cd youthnet-api

# Copy all files from server-php directory to this location
# Then set up environment and dependencies:

# Create .env file
cp .env.example .env
nano .env
```

Update .env with your database credentials:
```
DB_HOST=localhost
DB_NAME=youthnet_db
DB_USER=youthnet_user
DB_PASS=secure_password_here
JWT_SECRET=your_secure_jwt_secret_here
ENVIRONMENT=production
```

```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Import database schema
mysql -u youthnet_user -p youthnet_db < database/schema.sql

# Set permissions
sudo chown -R www-data:www-data /var/www/html/youthnet-api
sudo chmod -R 755 /var/www/html/youthnet-api
sudo chmod 600 /var/www/html/youthnet-api/.env
```

### 4. Apache Configuration
Create virtual host configuration:
```bash
sudo nano /etc/apache2/sites-available/youthnet-api.conf
```

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/youthnet-api
    ServerName your-domain.com
    
    <Directory /var/www/html/youthnet-api>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/youthnet-api_error.log
    CustomLog ${APACHE_LOG_DIR}/youthnet-api_access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite youthnet-api.conf
sudo systemctl reload apache2
```

### 5. Test the API
```bash
# Test health endpoint
curl http://your-server-ip/youthnet-api/health

# Test authentication
curl -X POST http://your-server-ip/youthnet-api/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@youthnet.in","password":"admin123"}'
```

## Frontend Configuration
Update `src/config/auth.ts` with your server URL:
```typescript
php: {
  apiUrl: 'http://your-server-ip/youthnet-api'
}
```

## Security Notes
1. Change all default passwords
2. Use HTTPS in production
3. Configure firewall properly
4. Regular security updates
5. Monitor logs for suspicious activity

## Troubleshooting
- Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`
- Verify PHP configuration: `php -v`
- Test database connection: `mysql -u youthnet_user -p youthnet_db`
- Check file permissions: `ls -la /var/www/html/youthnet-api`
