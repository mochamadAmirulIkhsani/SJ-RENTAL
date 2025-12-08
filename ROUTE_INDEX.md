# 🗺️ SJRent Complete Route Index

## 🏠 Customer-Facing Routes

### 1. Home / Landing Page

**Route**: `/home`  
**File**: `app/(customer)/home/page.tsx`  
**Features**:

- Hero section with tagline
- Feature cards (4 items)
- Featured motors (3 items)
- CTA section
- Footer with links

### 2. Motor Availability

**Route**: `/motors`  
**File**: `app/(customer)/motors/page.tsx`  
**Features**:

- Filter panel (search, type, status, price)
- Motor grid (8+ motors)
- Status badges
- Book now buttons

### 3. Booking Form

**Route**: `/booking`  
**File**: `app/(customer)/booking/page.tsx`  
**Features**:

- Motor selection
- Date range picker
- Customer information form
- Pickup location
- Additional options
- Order summary sidebar

### 4. Booking Confirmation

**Route**: `/confirmation`  
**File**: `app/(customer)/confirmation/page.tsx`  
**Features**:

- Success message
- Booking reference
- Complete details
- Payment summary
- Action buttons

### 5. My Bookings

**Route**: `/my-bookings`  
**File**: `app/(customer)/my-bookings/page.tsx`  
**Features**:

- Tabs: Active, Upcoming, Past
- Booking cards
- Detail dialogs
- Extend/cancel options

---

## 🔧 Admin CMS Routes

### 1. Dashboard

**Route**: `/admin`  
**File**: `app/(admin)/admin/page.tsx`  
**Features**:

- Stats cards (4 metrics)
- Alerts panel
- Recent bookings table
- Fleet status overview

**Key Stats**:

- Total Motors
- Active Bookings
- Total Customers
- Monthly Revenue

### 2. Motor Availability Monitoring

**Route**: `/admin/availability`  
**File**: `app/(admin)/admin/availability/page.tsx`  
**Features**:

- Fleet summary (Total, Available, Rented, Maintenance)
- Advanced filters
- Motor fleet table
- Status management

**Table Columns**:

- Motor ID, Name, Plate, Type, Status, Location, Actions

### 3. Booking Management

**Route**: `/admin/bookings`  
**File**: `app/(admin)/admin/bookings/page.tsx`  
**Features**:

- Three view modes: List, Calendar, Assignment
- Stats dashboard
- Filter system
- Staff assignment tools

**Actions**:

- Approve/Reject bookings
- Assign staff members
- View booking details
- Export to Excel

### 4. Return & Inspection

**Route**: `/admin/returns`  
**File**: `app/(admin)/admin/returns/page.tsx`  
**Features**:

- Pending returns tracker
- Inspection checklist (10 items)
- Odometer reading
- Damage reporting
- Photo upload
- Inspection history

**Checklist Items**:

- Body, Lights, Signals, Brakes, Tires, Fuel, Mirrors, Seat, Odometer, Engine

### 5. Motor Inventory

**Route**: `/admin/inventory`  
**File**: `app/(admin)/admin/inventory/page.tsx`  
**Features**:

- Three tabs: List, Add New, Maintenance
- CRUD operations
- Advanced filters
- Maintenance tracking

**Motor Fields**:

- Brand, Model, Year, CC, Plate, Color, Type, Daily Rate, Photos

### 6. Customer Management

**Route**: `/admin/customers`  
**File**: `app/(admin)/admin/customers/page.tsx`  
**Features**:

- Customer database
- Search functionality
- Customer profiles
- Activity feed
- Analytics dashboard

**Analytics**:

- Top customers by spending
- Customer growth chart
- VIP customer tracking

### 7. Reports Module

**Route**: `/admin/reports`  
**File**: `app/(admin)/admin/reports/page.tsx`  
**Features**:

- Three tabs: Generate, Scheduled, History
- Report templates
- Custom date ranges
- Format selection (PDF/Excel)

**Report Types**:

- Revenue Report
- Booking Report
- Motor Utilization Report
- Customer Analysis Report

### 8. User & Role Management

**Route**: `/admin/users`  
**File**: `app/(admin)/admin/users/page.tsx`  
**Features**:

- Three tabs: Users, Roles, Permissions
- User CRUD operations
- Role management
- Permissions matrix

**Default Roles**:

- Super Admin (Full access)
- Manager (Operations)
- Staff (Bookings & Returns)
- Viewer (Read-only)

**Permission Modules**:

- Dashboard, Bookings, Motors, Customers, Reports, Settings, Users

### 9. System Settings

**Route**: `/admin/settings`  
**File**: `app/(admin)/admin/settings/page.tsx`  
**Features**:

- Five configuration tabs
- Company information
- Operation hours (7 days)
- Payment settings
- Notification preferences
- System configuration

**Tabs**:

1. **Company Info**: Name, address, logo, contact
2. **Operation Hours**: Schedule, holidays, 24/7 support
3. **Payments**: Methods, pricing, discounts
4. **Notifications**: Email alerts, SMTP settings
5. **System**: Timezone, language, currency, features

---

## 🧭 Navigation Structure

### Customer Navigation (Top Bar)

```
Home | Available Motors | Book Now | My Bookings | [Sign In] [Sign Up]
```

### Admin Navigation (Left Sidebar)

```
Dashboard
Motor Availability
Booking Management
Return & Inspection
Motor Inventory
Customer Management
Reports
User & Role Management
System Settings
[Logout]
```

---

## 🎨 Shared Components

### Customer Components

- `CustomerNavbar` - Top navigation with responsive menu
- Used on all customer pages

### Admin Components

- `AdminSidebar` - Fixed left navigation menu
- `AdminHeader` - Top bar with search & notifications
- Used on all admin pages

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All pages fully responsive across all breakpoints.

---

## 🎯 Quick Access URLs (localhost:3000)

### Customer

```
/home              → Landing page
/motors            → Browse motors
/booking           → Create booking
/confirmation      → Booking success
/my-bookings       → Customer dashboard
```

### Admin

```
/admin             → Dashboard
/admin/availability → Motor monitoring
/admin/bookings    → Manage bookings
/admin/returns     → Inspections
/admin/inventory   → Motor CRUD
/admin/customers   → Customer DB
/admin/reports     → Generate reports
/admin/users       → User management
/admin/settings    → Configuration
```

---

## 🔗 Route Hierarchy

```
sjrental/
├── / (redirects to /home)
├── /home (Customer Landing)
├── /motors (Browse)
├── /booking (Book)
├── /confirmation (Success)
├── /my-bookings (Dashboard)
└── /admin/
    ├── / (Admin Dashboard)
    ├── /availability
    ├── /bookings
    ├── /returns
    ├── /inventory
    ├── /customers
    ├── /reports
    ├── /users
    └── /settings
```

---

**Total Routes**: 14 pages  
**Customer Routes**: 5  
**Admin Routes**: 9  
**Status**: ✅ All functional

_Generated: December 8, 2025_
