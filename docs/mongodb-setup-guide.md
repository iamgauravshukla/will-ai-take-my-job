# MongoDB Atlas Cluster Setup Guide

Complete guide to set up a MongoDB Atlas cluster for AI Take Job.

---

## Overview

This guide walks you through:
- Creating a MongoDB Atlas account
- Setting up a free tier cluster (M0)
- Configuring database users and network access
- Connecting your Next.js application
- Security best practices
- Monitoring and backups

---

## 1. Create MongoDB Atlas Account

### Step 1: Sign Up

1. Navigate to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up using:
   - Email and password
   - Google account
   - GitHub account (recommended for developers)
3. Complete email verification

### Step 2: Choose Your Plan

**For Development/Testing:**
- Select **M0 (Free Tier)**
- 512 MB storage
- Shared RAM
- No credit card required
- Perfect for development and small production apps

**For Production:**
- **M10+** (starts at $0.08/hour)
- Dedicated RAM and storage
- Automated backups
- Point-in-time recovery
- Enhanced performance and scalability

---

## 2. Create a New Cluster

### Step 1: Build a Database

1. Click **"Build a Database"** on the Atlas dashboard
2. Choose deployment type: **"Shared"** (for M0 free tier)

### Step 2: Configure Cloud Provider & Region

**Recommended Settings:**
- **Cloud Provider:** AWS (most reliable)
- **Region:** Choose closest to your users
  - US: `us-east-1` (N. Virginia) or `us-west-2` (Oregon)
  - Europe: `eu-west-1` (Ireland) or `eu-central-1` (Frankfurt)
  - Asia: `ap-southeast-1` (Singapore) or `ap-south-1` (Mumbai)

### Step 3: Cluster Tier

- **Free Tier:** M0 Sandbox (512 MB)
- **Name:** Leave as `Cluster0` or customize (e.g., `aitakejob-prod`)

### Step 4: Create Cluster

Click **"Create Cluster"** (takes 3-5 minutes to provision)

---

## 3. Configure Database Access

### Create Database User

1. In Atlas dashboard, click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**

**Configuration:**
```
Authentication Method: Password
Username: aitakejob_db_user
Password: [Generate secure password]
Database User Privileges: Atlas Admin (or Read and write to any database)
```

**Security Best Practices:**
- ✅ Use strong passwords (20+ characters, mixed case, symbols)
- ✅ Generate passwords using a password manager
- ✅ Never commit passwords to Git
- ✅ Use different credentials for production vs development
- ❌ Avoid simple passwords like "password123"

**Save credentials securely** - you'll need them for the connection string.

---

## 4. Configure Network Access

### Add IP Addresses

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**

**Development Setup:**
```
Option 1: Allow Access from Anywhere (easiest for development)
- Click "Allow Access from Anywhere"
- IP: 0.0.0.0/0
- Warning: Less secure, use only for development

Option 2: Add Your Current IP (more secure)
- Click "Add Current IP Address"
- Automatically detects your IP
- Recommended for local development
```

**Production Setup:**
```
Add Specific IPs:
- Your deployment server's IP (Vercel, AWS, etc.)
- Your CI/CD pipeline IPs
- Your office/home static IP for admin access

Example:
- Vercel: Add Vercel's IP ranges (see Vercel docs)
- AWS EC2: Add your instance's Elastic IP
```

**Note:** If you deploy on Vercel, you may need to use "Allow Access from Anywhere" for serverless functions (Vercel uses dynamic IPs).

---

## 5. Get Connection String

### Step 1: Connect to Your Cluster

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button next to your cluster name
3. Choose **"Connect your application"**

### Step 2: Copy Connection String

```
Driver: Node.js
Version: 5.5 or later

Connection String:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 3: Modify Connection String

Replace placeholders:
```
Original:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/...

Modified:
mongodb+srv://aitakejob_db_user:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Optional: Add Database Name**
```
Add database name before query params:
mongodb+srv://aitakejob_db_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aitakejob?retryWrites=true&w=majority
```

---

## 6. Configure Your Application

### Update .env.local

Add the connection string to your environment file:

```bash
# .env.local
MONGODB_URI=mongodb+srv://aitakejob_db_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Production (.env.production):**
```bash
# Use separate credentials for production
MONGODB_URI=mongodb+srv://prod_user:PROD_PASSWORD@prodcluster.xxxxx.mongodb.net/aitakejob_prod?retryWrites=true&w=majority
```

### Test Connection

```bash
# Start development server
npm run dev

# Should see in logs:
# ✅ MongoDB connected successfully
```

If connection fails, check:
- Password is URL-encoded (replace `@` with `%40`, etc.)
- IP address is whitelisted
- Database user exists with correct privileges
- Cluster is not paused (free tier clusters auto-pause after inactivity)

---

## 7. Seed Initial Data

### Seed Baseline Jobs

```bash
npm run seed:jobs
```

Verify in Atlas:
1. Go to **"Database"** → **"Browse Collections"**
2. Select database: `test` (or your database name)
3. Collection: `jobs`
4. Should see ~40 initial job entries

### Generate SEO Content (100+ Jobs)

```bash
npm run generate:seo
```

This runs the Gemini-powered generation script:
- Creates 112 job role definitions
- Generates SEO-optimized content
- Uses upsert (safe to re-run)
- Takes ~15-20 minutes with rate delays

Verify:
- `jobs` collection should have 112+ documents
- Check `seoOptimized: true` field
- Verify rich content in `whatToDo`, `howAiHelps`, `futureOutlook` fields

---

## 8. Security Best Practices

### Connection String Security

✅ **DO:**
- Store in `.env.local` (gitignored)
- Use environment variables on hosting platforms
- Rotate passwords quarterly
- Use different credentials per environment
- Enable MongoDB audit logs (M10+)

❌ **DON'T:**
- Commit `.env.local` to Git
- Share connection strings in Slack/email
- Use same credentials across dev/prod
- Hardcode credentials in source code
- Use weak passwords

### Database User Privileges

**Principle of Least Privilege:**
```
Development: Atlas Admin (full access)
Production App: Read/Write to specific database only
Analytics/Reports: Read-only access
Backup Scripts: Backup-only privileges
```

### Enable Advanced Security (M10+)

- **Encryption at Rest:** Enable in cluster settings
- **TLS/SSL:** Always enabled by default (required)
- **VPC Peering:** Connect via private network (AWS/GCP/Azure)
- **Private Endpoints:** No public internet exposure
- **Database Auditing:** Track all database operations

---

## 9. Monitoring & Performance

### Atlas Monitoring Dashboard

Access via **"Metrics"** tab:
- **Operations:** Read/write operations per second
- **Connections:** Current active connections
- **Network:** Data transferred in/out
- **Storage:** Database size and growth
- **Query Performance:** Slow queries (M10+)

### Key Metrics to Watch

**Free Tier (M0) Limits:**
- Storage: 512 MB max
- Connections: 500 concurrent max
- No connection pooling on shared clusters

**Warning Signs:**
- Storage >80% full → upgrade or clean data
- Connections >400 → optimize connection pooling
- Slow queries >5s → add indexes

### Set Up Alerts

1. Go to **"Alerts"** (left sidebar)
2. Create alert rules:
   - Storage usage >80%
   - Connection count >400
   - Cluster is down
   - Daily backup failed

Configure notification channels:
- Email
- Slack webhook
- PagerDuty (for production)

---

## 10. Backups

### Free Tier (M0)

⚠️ **No automated backups on M0**

Manual backup options:
```bash
# Using mongodump (requires MongoDB tools)
mongodump --uri="mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/aitakejob"

# Using Atlas UI
Database → ... → Export Data → JSON/CSV
```

### Paid Tiers (M10+)

**Continuous Cloud Backup:**
- Automatic snapshots every 6-24 hours
- Retention: 7 days to 1 year
- Point-in-time recovery (hourly)
- One-click restore

**Enable Backups:**
1. Go to cluster configuration
2. Enable **"Continuous Backup"**
3. Set retention policy
4. Test restore quarterly

---

## 11. Scaling & Optimization

### When to Upgrade from M0

Upgrade if you hit:
- **Storage:** >400 MB used
- **Traffic:** >100 req/min sustained
- **Features needed:** Backups, performance insights, VPC
- **Performance:** Queries taking >2s regularly

### Recommended Upgrade Path

```
M0 (Free) → M10 ($0.08/hr) → M20 ($0.20/hr) → M30 ($0.54/hr)
```

### Optimize Before Scaling

**1. Add Indexes:**
```javascript
// Common indexes for this app
db.jobs.createIndex({ role: 1, sector: 1 })
db.jobs.createIndex({ seoOptimized: 1 })
db.reports.createIndex({ userId: 1, createdAt: -1 })
```

**2. Use Projections:**
```javascript
// Fetch only needed fields
Job.find({}, { role: 1, sector: 1, riskLevel: 1 })
```

**3. Enable Connection Pooling:**
```javascript
// Already configured in /src/backend/lib/mongodb.ts
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
})
```

---

## 12. Troubleshooting

### Issue: "MongoServerError: Authentication failed"

**Cause:** Wrong username/password or user doesn't exist

**Fix:**
1. Verify credentials in Atlas → Database Access
2. Check password is URL-encoded in connection string
3. Recreate database user if needed

**URL Encoding Reference:**
```
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
[ → %5B
] → %5D
```

### Issue: "MongoNetworkError: connection timeout"

**Cause:** IP not whitelisted or network issue

**Fix:**
1. Check Atlas → Network Access
2. Add current IP or use 0.0.0.0/0
3. Verify no corporate firewall blocking port 27017
4. Test with curl: `curl -I https://cluster0.xxxxx.mongodb.net`

### Issue: "Connection is being closed"

**Cause:** Connection pool exhausted or Next.js hot reloading

**Fix:**
- In development: Use cached connection in `/src/backend/lib/mongodb.ts`
- Check for connection leaks (unclosed cursors)
- Increase maxPoolSize if needed

### Issue: "Cannot read properties of null"

**Cause:** Database not initialized or collections don't exist

**Fix:**
```bash
# Seed the database
npm run seed:jobs

# Verify in Atlas → Browse Collections
```

### Issue: Free tier cluster paused

**Cause:** No activity for 60+ days (auto-pause)

**Fix:**
1. Go to Atlas dashboard
2. Click **"Resume"** on cluster
3. Wait 2-3 minutes for startup
4. Add a health check or cron job to ping monthly

---

## 13. Production Checklist

Before going live:

### Security
- [ ] Enable IP whitelist with specific production IPs
- [ ] Use strong passwords (20+ characters)
- [ ] Separate credentials for prod/dev/staging
- [ ] Enable encryption at rest (M10+)
- [ ] Set up VPC peering (M10+)
- [ ] Enable audit logs (M10+)

### Performance
- [ ] Add indexes for common queries
- [ ] Enable connection pooling
- [ ] Set appropriate pool size (10-50)
- [ ] Configure read preference if using replicas

### Monitoring
- [ ] Set up alerts (storage, connections, downtime)
- [ ] Configure Slack/email notifications
- [ ] Enable performance insights (M10+)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)

### Backups
- [ ] Enable continuous backups (M10+)
- [ ] Test restore procedure
- [ ] Document recovery process
- [ ] Set retention policy (7-30 days minimum)

### Documentation
- [ ] Document connection details (without passwords)
- [ ] Create runbook for common operations
- [ ] Share access with team (Atlas users)
- [ ] Document emergency procedures

---

## 14. Cost Optimization

### Free Tier Strategy

**Maximize M0 Usage:**
- Keep storage under 512 MB
- Delete old reports periodically
- Use shorter text fields where possible
- Compress JSON data before storage

**Example Cleanup Script:**
```javascript
// Delete reports older than 90 days
const cutoff = new Date()
cutoff.setDate(cutoff.getDate() - 90)
await Report.deleteMany({ createdAt: { $lt: cutoff } })
```

### Paid Tier Cost Reduction

**Right-size your cluster:**
- Start with M10, monitor for 2 weeks
- Scale to M20 only if CPU >70% sustained
- Use autoscaling (M10+)

**Enable disk autoscaling:**
- Prevents emergency upgrades
- Costs less than manual tier upgrades

**Use connection pooling:**
- Reduces connection overhead
- Fewer resources per request

**Archive old data:**
- Move to cheaper storage (S3/GCS)
- Use Data Lake for analytics
- Keep only last 6-12 months in Atlas

---

## 15. Additional Resources

### Official Documentation
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Node.js Driver Docs](https://www.mongodb.com/docs/drivers/node/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### Community
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- [Stack Overflow - mongodb tag](https://stackoverflow.com/questions/tagged/mongodb)

### Tools
- **MongoDB Compass:** Desktop GUI for database management
- **mongodump/mongorestore:** Backup/restore CLI tools
- **mongo shell:** Interactive JavaScript environment

### Support

**Free Tier:** Community forums only  
**M10+:** Email support (business hours)  
**M30+:** 24/7 chat support  
**Enterprise:** Dedicated support team

---

## Quick Reference

### Essential Commands

```bash
# Test connection
npm run dev

# Seed baseline data
npm run seed:jobs

# Generate SEO content
npm run generate:seo

# View logs
npm run build
```

### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Common Atlas URLs

- Dashboard: https://cloud.mongodb.com
- Docs: https://www.mongodb.com/docs/atlas
- Status: https://status.mongodb.com

---

**Need Help?**  
Check the [Project Guide](./project-guide.md) and [Setup Guide](./setup-guide.md) for application-specific configuration.
