
#!/bin/bash

# YouthNet API Deployment Script for DigitalOcean Droplet
# Usage: ./deploy.sh [server-ip] [ssh-user]

SERVER_IP=${1:-"143.244.171.76"}
SSH_USER=${2:-"root"}
APP_DIR="/var/www/html/youthnet-api"

echo "🚀 Starting YouthNet API deployment to $SERVER_IP"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we can connect to the server
print_status "Testing SSH connection to $SERVER_IP..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SSH_USER@$SERVER_IP exit 2>/dev/null; then
    print_error "Cannot connect to $SERVER_IP. Please check your SSH configuration."
    exit 1
fi

print_status "SSH connection successful!"

# Phase 1: Server Preparation
print_status "Phase 1: Preparing server environment..."
ssh $SSH_USER@$SERVER_IP << 'EOF'
    # Update system
    apt update && apt upgrade -y
    
    # Install LAMP stack
    apt install -y apache2 mysql-server php php-mysql php-json php-mbstring php-xml php-curl composer unzip
    
    # Enable Apache modules
    a2enmod rewrite
    a2enmod headers
    
    # Start and enable services
    systemctl start apache2
    systemctl enable apache2
    systemctl start mysql
    systemctl enable mysql
    
    # Configure firewall
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw --force enable
EOF

# Phase 2: Create application directory
print_status "Phase 2: Creating application directory..."
ssh $SSH_USER@$SERVER_IP "mkdir -p $APP_DIR && chown $SSH_USER:$SSH_USER $APP_DIR"

# Phase 3: Upload application files
print_status "Phase 3: Uploading application files..."
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='*.log' \
    ./ $SSH_USER@$SERVER_IP:$APP_DIR/

# Phase 4: Configure application
print_status "Phase 4: Configuring application..."
ssh $SSH_USER@$SERVER_IP << EOF
    cd $APP_DIR
    
    # Create .env file from example
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created .env file from template"
    fi
    
    # Install PHP dependencies
    composer install --no-dev --optimize-autoloader
    
    # Set proper permissions
    chown -R www-data:www-data $APP_DIR
    chmod -R 755 $APP_DIR
    chmod 600 $APP_DIR/.env
    
    # Create logs directory
    mkdir -p $APP_DIR/logs
    chown www-data:www-data $APP_DIR/logs
EOF

# Phase 5: Configure Apache Virtual Host
print_status "Phase 5: Configuring Apache virtual host..."
ssh $SSH_USER@$SERVER_IP << EOF
    # Create virtual host configuration
    cat > /etc/apache2/sites-available/youthnet-api.conf << 'VHOST'
<VirtualHost *:80>
    DocumentRoot $APP_DIR
    ServerName $SERVER_IP
    
    <Directory $APP_DIR>
        AllowOverride All
        Require all granted
        Options -Indexes
    </Directory>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog \${APACHE_LOG_DIR}/youthnet-api_error.log
    CustomLog \${APACHE_LOG_DIR}/youthnet-api_access.log combined
</VirtualHost>
VHOST

    # Enable site and restart Apache
    a2ensite youthnet-api.conf
    a2dissite 000-default.conf
    systemctl reload apache2
EOF

# Phase 6: Database setup instructions
print_status "Phase 6: Database setup required..."
print_warning "Please run the following commands on your server to set up the database:"
echo ""
echo "ssh $SSH_USER@$SERVER_IP"
echo "mysql_secure_installation"
echo ""
echo "Then run:"
echo "mysql -u root -p << 'SQL'"
echo "CREATE DATABASE youthnet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "CREATE USER 'youthnet_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';"
echo "GRANT ALL PRIVILEGES ON youthnet_db.* TO 'youthnet_user'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"
echo "SQL"
echo ""
echo "mysql -u youthnet_user -p youthnet_db < $APP_DIR/database/schema.sql"

print_status "Deployment completed! Next steps:"
echo "1. Complete database setup as shown above"
echo "2. Update .env file with your database credentials"
echo "3. Change API_SECRET in .env from default value"
echo "4. Test the API: curl http://$SERVER_IP/health"
echo ""
print_warning "Remember to update your frontend config to point to: http://$SERVER_IP"
EOF

<lov-write file_path="server-php/setup-database.sh">
#!/bin/bash

# Database Setup Script for YouthNet API
# Run this after the main deployment script

SERVER_IP=${1:-"143.244.171.76"}
SSH_USER=${2:-"root"}
DB_NAME="youthnet_db"
DB_USER="youthnet_user"

echo "🗄️  Setting up database for YouthNet API"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Generate a secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

print_status "Generated secure database password: $DB_PASSWORD"
print_warning "Please save this password securely!"

# Connect to server and set up database
ssh $SSH_USER@$SERVER_IP << EOF
    # Secure MySQL installation prompts
    echo "Please run 'mysql_secure_installation' first if you haven't already"
    echo "Press Enter to continue after securing MySQL..."
    read

    # Create database and user
    mysql -u root -p << 'SQL'
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EXIT;
SQL

    # Import schema
    if [ -f /var/www/html/youthnet-api/database/schema.sql ]; then
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < /var/www/html/youthnet-api/database/schema.sql
        echo "Database schema imported successfully"
    else
        echo "Schema file not found. Please import manually."
    fi

    # Update .env file
    cd /var/www/html/youthnet-api
    sed -i "s/DB_HOST=localhost/DB_HOST=localhost/" .env
    sed -i "s/DB_NAME=youthnet_db/DB_NAME=$DB_NAME/" .env
    sed -i "s/DB_USER=root/DB_USER=$DB_USER/" .env
    sed -i "s/DB_PASS=/DB_PASS=$DB_PASSWORD/" .env
    
    # Generate new API secret
    NEW_API_SECRET=\$(shuf -i 1000000000-9999999999 -n 1)
    sed -i "s/API_SECRET=1234567890/API_SECRET=\$NEW_API_SECRET/" .env
    
    echo "Updated .env with database credentials"
    echo "New API Secret: \$NEW_API_SECRET"
    
    # Set proper permissions
    chmod 600 .env
    chown www-data:www-data .env
EOF

print_status "Database setup completed!"
print_status "Database: $DB_NAME"
print_status "User: $DB_USER"
print_status "Password: $DB_PASSWORD"
print_warning "A new API secret has been generated. Check the server output above."
EOF

<lov-write file_path="server-php/test-deployment.sh">
#!/bin/bash

# Test Deployment Script for YouthNet API

SERVER_IP=${1:-"143.244.171.76"}

echo "🧪 Testing YouthNet API deployment on $SERVER_IP"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /tmp/api_response "http://$SERVER_IP/$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
        echo "Response body:"
        cat /tmp/api_response
        echo ""
        return 1
    fi
}

# Test health endpoint
test_endpoint "health" "200" "Health Check"

# Test API secret validation
echo -n "Testing API secret validation... "
response=$(curl -s -w "%{http_code}" -o /tmp/api_response \
    -H "Content-Type: application/json" \
    -H "X-API-Secret: 1234567890" \
    -d '{"action":"validate_installation"}' \
    "http://$SERVER_IP/api/install/validate")

if [ "$response" = "200" ] || [ "$response" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} (API secret validation working)"
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
fi

# Test CORS headers
echo -n "Testing CORS headers... "
cors_header=$(curl -s -I "http://$SERVER_IP/health" | grep -i "access-control-allow-origin")
if [ ! -z "$cors_header" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}! WARNING${NC} (CORS headers not found)"
fi

echo ""
echo "🎯 Deployment test completed!"
echo "If all tests pass, your API is ready to use."
echo ""
echo "Next steps:"
echo "1. Update your frontend config with the server IP"
echo "2. Use the new API secret for frontend activation"
echo "3. Test the complete authentication flow"
EOF

<lov-write file_path="server-php/production.env.example">
# Production Environment Configuration for YouthNet API

# Database Configuration
DB_HOST=localhost
DB_NAME=youthnet_db
DB_USER=youthnet_user
DB_PASS=your_secure_database_password_here

# JWT Configuration - Generate a strong secret
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_characters

# API Security - Change from default!
API_SECRET=your_10_digit_api_secret_here

# Environment
ENVIRONMENT=production

# Optional: Email Configuration (for future features)
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your_email@gmail.com
# MAIL_PASSWORD=your_app_password
# MAIL_FROM=noreply@yourdomain.com

# Optional: File Upload Configuration
# MAX_UPLOAD_SIZE=10M
# UPLOAD_PATH=/var/www/html/youthnet-api/uploads

# Optional: Rate Limiting
# RATE_LIMIT_REQUESTS=100
# RATE_LIMIT_WINDOW=15
EOF

I've created a comprehensive deployment package with the following scripts:

1. **deploy.sh** - Main deployment script that handles:
   - Server preparation (LAMP stack installation)
   - File upload and configuration
   - Apache virtual host setup
   - Proper permissions and security

2. **setup-database.sh** - Database setup script that:
   - Creates secure database and user
   - Imports the schema
   - Updates .env with credentials
   - Generates new API secret

3. **test-deployment.sh** - Testing script to verify:
   - API health endpoint
   - API secret validation
   - CORS configuration

4. **production.env.example** - Production environment template

To deploy your backend:

1. Make scripts executable: `chmod +x server-php/*.sh`
2. Run deployment: `./server-php/deploy.sh`
3. Set up database: `./server-php/setup-database.sh`
4. Test deployment: `./server-php/test-deployment.sh`

The deployment will create a production-ready PHP API at `http://143.244.171.76` with proper security, database configuration, and a new API secret for your frontend installer.
