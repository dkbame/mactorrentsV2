# MacTorrents Deployment Guide

## 🚀 Quick Deploy to Netlify

### Prerequisites
- GitHub account
- Netlify account
- Your domain name

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial MacTorrents commit"
   git remote add origin https://github.com/yourusername/mactorrents.git
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repo
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Environment Variables**
   In Netlify Dashboard → Site Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   TRACKER_ANNOUNCE_URL=https://yourdomain.com/api/announce
   ```

4. **Custom Domain**
   - Netlify Dashboard → Domain Settings
   - Add your domain (e.g., `mactorrents.com`)
   - Update DNS records as instructed

### Your Tracker URLs Will Be:
- **Announce:** `https://yourdomain.com/api/announce`
- **Scrape:** `https://yourdomain.com/api/scrape`
- **Stats:** `https://yourdomain.com/api/stats`

---

## 🏗️ Production VPS Deployment

### For High-Performance BitTorrent Tracking

### Prerequisites
- VPS with Ubuntu 20.04+ (DigitalOcean/Linode/Vultr)
- Domain name pointing to your VPS IP
- Basic server management knowledge

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx and Certbot
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 2. Clone and Configure

```bash
# Clone your repo
git clone https://github.com/yourusername/mactorrents.git
cd mactorrents

# Create environment file
cp .env.example .env.production
# Edit with your production values
nano .env.production
```

### 3. SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 4. Deploy

```bash
# Build and start
docker-compose --env-file .env.production up -d

# Check status
docker-compose ps
docker-compose logs -f mactorrents
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/mactorrents`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # BitTorrent tracker optimizations
    location /api/announce {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mactorrents /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Environment Variables for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App Settings
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=MacTorrents
NEXT_PUBLIC_SITE_DESCRIPTION=Free macOS Apps and Games Distribution Platform

# Tracker
TRACKER_ANNOUNCE_URL=https://yourdomain.com/api/announce
```

---

## 📊 Monitoring & Maintenance

### Health Checks
- **Application:** `https://yourdomain.com/api/stats`
- **Database:** Monitor Supabase dashboard
- **Server:** `docker-compose ps`

### Log Monitoring
```bash
# Application logs
docker-compose logs -f mactorrents

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎯 Recommended Approach

1. **Start with Netlify** for quick deployment and testing
2. **Monitor usage** and performance
3. **Migrate to VPS** when you need:
   - Higher performance
   - More control
   - Better BitTorrent tracker capabilities
   - Custom configurations

Both options will give you a fully functional MacTorrents platform with your own domain!
