# SJRent - Motor Rental Management System

A comprehensive motor rental management system built with Next.js 15, TypeScript, and shadcn/ui components.

## 🎨 Design System

### Color Palette

- **Navy Blue**: `#0A2540` - Primary brand color
- **Teal**: `#1ABC9C` - Accent color for CTAs and highlights
- **White**: `#FFFFFF` - Background and text
- **Light Gray**: `#F3F4F6` - Secondary backgrounds
- **Dark Gray**: `#1F2A37` - Secondary text

### Typography

- Consistent sans-serif font family throughout
- Consistent weight system for hierarchy

### Spacing

- 8px / 16px / 24px / 32px consistent scale

### Components

- All UI components use shadcn/ui
- Icons from lucide-react
- Consistent rounded corners and shadows

## 🏗️ Project Structure

```
sjrental/
├── app/
│   ├── (customer)/           # Customer-facing pages
│   │   ├── home/             # Landing page
│   │   ├── motors/           # Motor availability
│   │   ├── booking/          # Booking form
│   │   ├── confirmation/     # Booking confirmation
│   │   └── my-bookings/      # Customer dashboard
│   └── (admin)/              # CMS Admin pages
│       └── admin/
│           ├── page.tsx                  # Dashboard
│           ├── availability/             # Motor availability monitoring
│           ├── bookings/                 # Booking management
│           ├── returns/                  # Return & inspection
│           ├── inventory/                # Motor inventory
│           ├── customers/                # Customer management
│           ├── reports/                  # Reports module
│           ├── users/                    # User & role management
│           └── settings/                 # System settings
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── customer-navbar.tsx   # Customer navigation
│   ├── admin-sidebar.tsx     # Admin sidebar menu
│   └── admin-header.tsx      # Admin header bar
└── lib/
    └── utils.ts              # Utility functions
```

## 🚀 Features

### Customer Features

1. **Landing Page** - Hero section, features, featured motors, CTA
2. **Motor Availability** - Browse and filter available motors
3. **Booking Form** - Complete booking with date selection, customer info, additional options
4. **Booking Confirmation** - Confirmation page with booking details
5. **My Bookings** - View active, upcoming, and past bookings

### Admin Features

1. **Dashboard** - Overview with stats, alerts, recent bookings
2. **Motor Availability Monitoring** - Real-time fleet status
3. **Booking Management** - List view, calendar view, staff assignment
4. **Return & Inspection** - Checklist, damage reporting, photos
5. **Motor Inventory** - CRUD operations, maintenance tracking
6. **Customer Management** - Customer database, analytics
7. **Reports Module** - Generate PDF/Excel reports
8. **User & Role Management** - Permissions matrix, role-based access
9. **System Settings** - Company info, operation hours, payments, notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod
- **Date Handling**: date-fns

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Routes

### Customer Routes

- `/home` - Landing page
- `/motors` - Motor availability
- `/booking` - Booking form
- `/confirmation` - Booking confirmation
- `/my-bookings` - Customer dashboard

### Admin Routes

- `/admin` - Dashboard
- `/admin/availability` - Motor availability
- `/admin/bookings` - Booking management
- `/admin/returns` - Return & inspection
- `/admin/inventory` - Motor inventory
- `/admin/customers` - Customer management
- `/admin/reports` - Reports
- `/admin/users` - User & role management
- `/admin/settings` - System settings

## 🎨 Component Usage

All components follow shadcn/ui patterns:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Usage
<Button style={{ backgroundColor: '#1ABC9C' }}>
  Click Me
</Button>

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

<Badge style={{ backgroundColor: '#1ABC9C' }}>
  Active
</Badge>
```

## 📝 Notes

- The design system is locked and consistent across all pages
- Navigation layouts are fixed (top navbar for customer, left sidebar for admin)
- All components use shadcn/ui without custom modifications
- Color palette and spacing system remain unchanged throughout

## 🔐 Default Access

Admin credentials will be managed through the User & Role Management module.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js and shadcn/ui
