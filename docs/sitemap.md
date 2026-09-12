# Sitemap

## Overview

This document defines the Version 1 route structure for Photography Booking System.

The application is divided into:

- Public Website
- Admin Panel
- API Routes

---

# 1. Public Routes

```text
/
├── /portfolio
├── /packages
├── /booking
└── /contact
```

## 1.1 Home

Route:

/

Main sections:

- Navbar
- Hero
- Short Introduction
- Featured Portfolio
- Featured Packages
- Booking CTA
- WhatsApp / Contact CTA
- Footer

Primary actions:

- View Portfolio
- View Packages
- Book Now
- Contact via WhatsApp

## 1.2 Portfolio

Route:

/portfolio

Purpose:

Display published photography portfolio items.

Content may include:

- Image
- Title
- Description
- Location
- Photography type

Only published items are visible publicly.

## 1.3 Packages

Route:

/packages

Purpose:

Display active photography packages.

Each package may contain:

- Name
- Description
- Price
- Duration
- Included services
- Image

Primary action:

Book Now

## 1.4 Booking

Route:

/booking

Purpose:

Allow visitors to submit a photography booking request.

Form fields:

- Name
- WhatsApp / Phone
- Email, optional
- Package
- Booking Date
- Booking Time
- Location
- Additional Notes

After successful submission:

Booking Created
↓
Status = NEW
↓
Success Message

## 1.5 Contact

Route:

/contact

Purpose:

Provide direct contact information.

May include:

- WhatsApp
- Email
- Social media
- Business information

Primary action:

Contact via WhatsApp

# 2. Public Navigation

Desktop navigation:

- Home
- Portfolio
- Packages
- Booking
- Contact

Primary CTA:

Book Now

Mobile navigation should contain the same destinations.

# 3. Admin Routes
/admin
├── /admin/login
├── /admin/dashboard
├── /admin/bookings
│   └── /admin/bookings/[id]
├── /admin/packages
│   ├── /admin/packages/new
│   └── /admin/packages/[id]/edit
└── /admin/portfolio
    ├── /admin/portfolio/new
    └── /admin/portfolio/[id]/edit

# 4. Admin Authentication

Login

Route:

/admin/login

Purpose:

Authenticate photographer/admin using:

- Email
- Password

Authenticated ADMIN users should be redirected to:

/admin/dashboard

# 5. Dashboard

Route:

/admin/dashboard

Purpose:

Display booking overview.

Dashboard data:

- Total bookings
- New bookings
- Confirmed bookings
- Upcoming bookings
- Recent booking requests

Navigation should provide access to:

- Dashboard
- Bookings
- Packages
- Portfolio
- View Website
- Logout

# 6. Booking Management

## 6.1 Booking List

Route:

/admin/bookings

Displays:

- Client
- Package
- Booking date
- Time
- Location
- Status

Actions:

- View detail

## 6.2 Booking Detail

Route:

/admin/bookings/[id]

Displays:

- Client information
- WhatsApp / phone
- Email
- Selected package
- Booking date
- Booking time
- Location
- Notes
- Status
- Created date

Actions:

- Contact client
- Update status

Version 1 booking statuses:

- NEW
- CONFIRMED
- COMPLETED
- CANCELLED

# 7. Package Management

## 7.1 Package List

Route:

/admin/packages

Actions:

- Create
- Edit
- Activate / deactivate
- Delete

## 7.2 Create Package

Route:

/admin/packages/new

## 7.3 Edit Package

Route:

/admin/packages/[id]/edit

# 8. Portfolio Management

## 8.1 Portfolio List

Route:

/admin/portfolio

Actions:

- Create
- Edit
- Publish / unpublish
- Delete

## 8.2 Create Portfolio Item

Route:

/admin/portfolio/new

## 8.3 Edit Portfolio Item

Route:

/admin/portfolio/[id]/edit

# 9. API Route Structure

The exact implementation may change during development, but Version 1 should approximately follow:

/api
├── /auth
├── /bookings
├── /packages
├── /portfolio
└── /admin
    ├── /bookings
    ├── /packages
    └── /portfolio

Authentication routes may use the authentication library's own route structure.

# 10. Public and Admin Separation

## 10.1 Public routes:

/
 /portfolio
 /packages
 /booking
 /contact

## 10.2 Admin routes:

/admin/*

Rules:

1. Public routes do not require authentication.
2. Admin routes require an authenticated ADMIN user.
3. Admin APIs require server-side authorization.
4. Public users must not access admin functionality.

# 11. SEO Routes

Version 1 should include:

/sitemap.xml
/robots.txt

These routes support basic search engine indexing.

Admin routes should not be indexed.

# 12. Version 1 Sitemap

Photography Booking System

Public
│
├── Home
│   └── /
│
├── Portfolio
│   └── /portfolio
│
├── Packages
│   └── /packages
│
├── Booking
│   └── /booking
│
└── Contact
    └── /contact


Admin
│
├── Login
│   └── /admin/login
│
├── Dashboard
│   └── /admin/dashboard
│
├── Bookings
│   ├── /admin/bookings
│   └── /admin/bookings/[id]
│
├── Packages
│   ├── /admin/packages
│   ├── /admin/packages/new
│   └── /admin/packages/[id]/edit
│
└── Portfolio
    ├── /admin/portfolio
    ├── /admin/portfolio/new
    └── /admin/portfolio/[id]/edit

# 13. Future Routes

Possible Version 2 / Version 3 additions:

/admin/calendar
/admin/clients
/admin/testimonials
/admin/payments
/admin/reports

/client/login
/client/bookings
/client/gallery

These routes are not part of Version 1.