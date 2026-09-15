# Roadmap

## Overview

Photography Booking System will be developed incrementally.

The goal is to keep the first version small, usable, and deployable, then add operational and advanced features only after the core workflow is stable.

---

# Version 1 — MVP

## Goal

Build the minimum usable system for photographers to showcase services and receive booking requests.

## Phase 0 — Planning

Deliverables:

- Vision document
- Requirements
- Roadmap
- User stories
- User flow
- Sitemap
- ERD
- Wireframes
- README

Status:

```text
COMPLETED
```

## Phase 1 — Project Foundation

Tasks:

- Initialize Next.js project
- Configure TypeScript
- Configure Tailwind CSS
- Configure ESLint
- Define project structure
- Configure environment variables
- Install required dependencies
- Configure PostgreSQL
- Configure Prisma
- Create initial database migration
- Prepare seed structure

Expected result:

- Application runs locally
- Database connection works
- Prisma migration works

Status:

```text
COMPLETED
```

## Phase 2 — Database

Implement the Version 1 data model.

Entities:

- User
- Package
- Portfolio
- Booking

Enums:

- UserRole
- BookingStatus

Tasks:

- Define Prisma schema
- Create migrations
- Create admin seed
- Verify relationships
- Verify CRUD using Prisma

Expected result:

Database structure is stable for Version 1

Status:

```text
COMPLETED
```

## Phase 3 — Admin Authentication

Tasks:

- Admin login page
- Credentials authentication
- Password hashing
- JWT/session configuration
- Admin authorization
- Protect admin routes
- Logout
- Seed initial admin account

Expected result:

Only authenticated ADMIN users can access /admin

Status:

```text
COMPLETED
```

## Phase 4 — Public Website

Build the initial public-facing interface.

Pages:

- Home
- Portfolio
- Packages
- Booking
- Contact

Tasks:

- Navbar
- Hero section
- Introduction
- Featured portfolio
- Featured packages
- CTA sections
- Footer
- WhatsApp action
- Responsive layout

Expected result:

Visitors can browse the photography business website on mobile and desktop

Status:

```text
COMPLETED
```

## Phase 5 — Booking Flow

Tasks:

- Booking form
- Package selection
- Booking date
- Booking time
- Location
- Client information
- Additional notes
- Server-side validation
- Store booking in PostgreSQL
- Default status = NEW
- Success state
- Error handling

Expected result:

Visitor
→ submit booking
→ booking stored
→ admin can access booking data

Important limitation:

Version 1 does not automatically check schedule conflicts.

Booking requests still require manual confirmation.

Status:

```text
COMPLETED
```

## Phase 6 — Admin Booking Management

Tasks:

- Admin dashboard
- Booking statistics
- Recent bookings
- Booking list
- Booking detail
- Booking status badges
- Update booking status
- Client contact actions
- Upcoming bookings display

Supported statuses:

- NEW
- CONFIRMED
- COMPLETED
- CANCELLED

Expected result:

Photographer can manage the full booking workflow from the admin dashboard

Status:

```text
COMPLETED
```

## Phase 7 — Package CMS

Tasks:

- Package list
- Create package
- Edit package
- Delete package
- Activate/deactivate package
- Display ordering
- Optional package image

Expected result:

Admin can manage packages without modifying source code

Status:

```text
COMPLETED
```

## Phase 8 — Portfolio CMS

Tasks:

- Portfolio list
- Create portfolio item
- Edit portfolio item
- Delete portfolio item
- Publish/unpublish
- Display ordering
- Image upload
- Optional location
- Optional photography type

Expected result:

Admin can manage public portfolio content from the CMS

Status:

```text
COMPLETED
```

## Phase 9 — Polish

Tasks:

- Loading states
- Empty states
- Error states
- Form feedback
- Toast notifications
- Confirmation dialogs
- Responsive testing
- Mobile admin improvements
- Accessibility basics
- UI consistency
- Basic SEO metadata
- Sitemap
- Robots configuration

Expected result:

Version 1 feels complete and ready for real usage

Status:

```text
COMPLETED
```

## Phase 10 — Deployment

Tasks:

- Production database
- Production environment variables
- Build verification
- Database migration
- Admin seed
- Deploy application
- Configure domain/subdomain
- Configure image storage
- Test production booking flow
- Test production admin flow

Expected result:

Photography Booking System V1 is live

# Version 1 Completion Criteria

Version 1 is complete when:

- Public website is live.
- Portfolio is managed from admin.
- Packages are managed from admin.
- Visitors can submit booking requests.
- Booking requests are stored correctly.
- Admin can view booking details.
- Admin can update booking status.
- Authentication and authorization work.
- Mobile and desktop layouts work.
- Production environment is stable.

# Version 2 — Operational

## Goal

Improve day-to-day photography business operations after Version 1 has been validated in real usage.

Version 2 focuses on scheduling, booking operations, payment tracking, and client management.

---

## Phase 11 — Scheduling & Availability

Status:

```text
PLANNED
```
Tasks:

- Availability calendar
- Admin can block unavailable dates
- Admin can block unavailable time slots
- Prevent booking requests on unavailable dates
- Prevent booking conflicts with existing confirmed bookings
- Display available booking slots to visitors
- Reschedule existing bookings
- Revalidate availability when a booking is rescheduled

Expected result:

Booking schedules can be managed without manually checking for conflicts.

## Phase 12 — Booking Search & Filtering

Status:

PLANNED

Tasks:

- Search bookings by client name
- Search bookings by phone or email
- Filter bookings by status
- Filter bookings by package
- Filter bookings by booking date
- Filter upcoming and past bookings
- Add pagination when booking volume increases

Expected result:

Admin can quickly find and manage bookings as booking volume grows.

## Phase 13 — Payment Tracking

Status:

PLANNED

Tasks:

- Deposit amount
- Total payment amount
- Payment status
- Upload payment proof
- Display payment information on booking detail
- Allow admin to update payment status manually

Payment statuses:

- UNPAID
- PARTIALLY_PAID
- PAID

Expected result:

Admin can track client payments without relying on a separate spreadsheet.

Important limitation:

Version 2 does not include an automatic payment gateway or automatic payment verification.

## Phase 14 — Client Management

Status:

PLANNED

Tasks:

- Client database
- Client contact information
- Client booking history
- Internal admin notes
- Search clients
- Link bookings belonging to the same client

Expected result:

Admin can manage repeat clients and view their booking history.

## Phase 15 — Admin Dashboard Improvements

Status:

PLANNED

Tasks:

- Calendar view
- Upcoming sessions
- Booking statistics by status
- Payment status overview
- Booking totals by selected period
- Quick access to bookings requiring attention

Expected result:

The dashboard provides useful operational information for daily business activity.

## Phase 16 — Package Improvements

Status:

PLANNED

Tasks:

- Package add-ons
- Additional pricing options
- Enable or disable add-ons
- Display optional add-ons during booking where appropriate

Expected result:

Photography packages support more flexible service offerings.

## Phase 17 — Portfolio Improvements

Status:

PLANNED

Tasks:

- Portfolio categories
- Category filtering
- Improved portfolio organization

Expected result:

Visitors can browse photography work by category.

## Phase 18 — Testimonials

Status:

PLANNED

Tasks:

- Testimonial management
- Publish or unpublish testimonials
- Public testimonial section

Expected result:

Client feedback can be managed from the CMS and displayed publicly.

## Version 2 Completion Criteria

Version 2 is complete when:

- Admin can manage photographer availability.
- Visitors cannot submit booking requests for unavailable or conflicting slots.
- Existing bookings can be rescheduled.
- Admin can search and filter bookings efficiently.
- Admin can manually track deposits and payment status.
- Client booking history can be viewed from the admin system.
- The dashboard provides useful operational information.
- Version 1 public and admin workflows continue to work without regression.

# Version 3 — Advanced

## Goal

Introduce automation, client self-service, and business analytics.

Possible features:

## Payments

- Payment gateway
- Automatic payment verification
- Automatic invoice generation

## Notifications

- WhatsApp reminders
- Email reminders
- Booking confirmation notifications

## Client Portal
- Client account
- Client login
- Booking history
- Booking detail
- Invoice access

## Photo Delivery

- Private client gallery
- Secure gallery access
- Photo download
- Delivery status

## Team Management

- Multiple photographers
- Assign photographer to booking
- Photographer availability
- Team scheduling

## Reports

- Revenue reports
- Booking trends
- Popular packages
- Monthly performance
- Client analytics

## Marketing

- Promo codes
- Vouchers
- Campaign tracking

# Development Principles

During development:

1. Version 1 scope must remain small.
2. Version 2 or Version 3 features should not be added to Version 1 unless they become critical.
3. Each phase should be completed and tested before moving forward.
4. Database changes should be intentional and documented.
5. The main booking workflow must remain the highest priority.
6. Features should solve real workflow problems rather than only increase feature count.

# High-Level Roadmap

Planning
   ↓
Foundation
   ↓
Database
   ↓
Authentication
   ↓
Public Website
   ↓
Booking
   ↓
Admin Booking Management
   ↓
Package CMS
   ↓
Portfolio CMS
   ↓
Polish
   ↓
Deployment
   ↓
V1 COMPLETE
   ↓
Real User Feedback
   ↓
V2 Operational Features
   ↓
V3 Advanced Features