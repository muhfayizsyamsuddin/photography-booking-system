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
IN PROGRESS
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

Improve day-to-day photography business operations after Version 1 has been validated.

Planned features:

## Scheduling

- Availability calendar
- Block unavailable dates
- Block unavailable time slots
- Booking conflict prevention
- Reschedule workflow

## Payment Tracking

- Deposit amount
- Payment status
- Upload payment proof

Payment statuses:

- UNPAID
- PARTIALLY_PAID
- PAID

## Client Management

- Client database
- Client booking history
- Internal admin notes
- Search clients

## Package Improvements

- Package add-ons
- Additional pricing options

## Portfolio Improvements

- Portfolio categories
- Category filtering

## Testimonials

- Testimonial management
- Public testimonial section

## Admin Improvements

- Search bookings
- Filter bookings
- Calendar view
- Better dashboard statistics

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