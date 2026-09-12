# Photography Booking System

A web-based booking and client management system for freelance photographers and mobile photography businesses.

The application allows photographers to showcase their portfolio, publish service packages, receive booking requests, and manage bookings through an admin dashboard.

---

## Overview

Many freelance photographers manage client bookings through WhatsApp, Instagram, or other chat applications.

This often causes booking information to become scattered and difficult to manage.

Photography Booking System provides a centralized platform where clients can:

- View photography portfolios.
- View available photography packages.
- Submit booking requests.
- Provide booking date, time, location, and additional requirements.
- Contact the photographer through WhatsApp.

Photographers can use the admin dashboard to:

- View incoming bookings.
- View booking details.
- Update booking status.
- Manage service packages.
- Manage portfolio content.

---

## Project Status

Current status:

```text
Version 1 — Planning / Development
```
Development is divided into multiple phases.

See:

docs/roadmap.md

for the complete roadmap.

## Version 1 Scope

Version 1 focuses on the minimum usable booking workflow.

### Public Website

- Home
- Portfolio
- Photography Packages
- Booking Form
- Contact
- WhatsApp CTA

### Admin Panel

- Admin Login
- Dashboard
- Booking Management
- Package Management
- Portfolio Management
- Logout

## Booking Workflow

Visitor
  ↓
View Portfolio
  ↓
View Packages
  ↓
Submit Booking Request
  ↓
Booking Stored
  ↓
Status = NEW
  ↓
Photographer Reviews Booking
  ↓
Client Contacted
  ↓
CONFIRMED / CANCELLED
  ↓
Photography Session
  ↓
COMPLETED

A booking submitted in Version 1 is a request.

The system does not automatically guarantee photographer availability.

## Booking Status

NEW
CONFIRMED
COMPLETED
CANCELLED

## Planned Technology Stack

### Frontend
Next.js
React
TypeScript
Tailwind CSS

### Backend

Next.js Server Components / Route Handlers
TypeScript

### Database

PostgreSQL
Prisma ORM

### Authentication

Credentials authentication
JWT / Session
Password hashing

### Validation

Zod

### Media

Cloudinary or similar external media storage

### Deployment

Deployment infrastructure will be defined during the deployment phase.

## Main Data Models

Version 1 contains:

- User
- Package
- Portfolio
- Booking

Enums:

- UserRole
- BookingStatus

See:

docs/erd.md

for the complete data design.

## Route Structure

### Public

/
/portfolio
/packages
/booking
/contact

### Admin

/admin/login
/admin/dashboard

/admin/bookings
/admin/bookings/[id]

/admin/packages
/admin/packages/new
/admin/packages/[id]/edit

/admin/portfolio
/admin/portfolio/new
/admin/portfolio/[id]/edit

### SEO routes:

/sitemap.xml
/robots.txt

## Project Documentation

Documentation is available inside:

docs/

Current documents:

docs/
├── vision.md
├── requirements.md
├── roadmap.md
├── user-stories.md
├── user-flow.md
├── sitemap.md
├── erd.md
└── wireframes.md

### Documentation Purpose

vision.md

Defines the product vision, problem, solution, and target users.

requirements.md

Defines Version 1 functional, technical, and security requirements.

roadmap.md

Defines the development phases and future versions.

user-stories.md

Defines requirements from the perspective of visitors and administrators.

user-flow.md

Defines the main booking and administration workflows.

sitemap.md

Defines public, admin, and API route structure.

erd.md

Defines the Version 1 database design.

wireframes.md

Defines the initial page and dashboard layout structure.

## Development Roadmap

Version 1 development phases:

Phase 0 — Planning
Phase 1 — Project Foundation
Phase 2 — Database
Phase 3 — Admin Authentication
Phase 4 — Public Website
Phase 5 — Booking Flow
Phase 6 — Admin Booking Management
Phase 7 — Package CMS
Phase 8 — Portfolio CMS
Phase 9 — Polish
Phase 10 — Deployment

After Version 1 is deployed:

Real User Feedback
        ↓
Version 2 — Operational
        ↓
Version 3 — Advanced

### Version 2 Planned Features

Possible operational improvements:

- Availability calendar
- Schedule conflict prevention
- Deposit tracking
- Payment proof upload
- Client database
- Booking search and filters
- Testimonials
- Portfolio categories
- Package add-ons
- Rescheduling

### Version 3 Planned Features

Possible advanced features:

- Payment gateway
- Automatic invoices
- WhatsApp / email reminders
- Client accounts
- Booking history
- Private photo galleries
- Photo delivery
- Multi-photographer support
- Revenue reports
- Booking analytics
- Promo codes and vouchers

### Version 1 Out of Scope

The following features are intentionally excluded from Version 1:

- Payment gateway
- Automatic payment verification
- Invoice generation
- Availability calendar
- Automatic schedule conflict prevention
- Automatic WhatsApp notifications
- Client accounts
- Private galleries
- Financial reporting
- Multi-photographer management
- Advanced analytics

Keeping these features outside Version 1 prevents unnecessary scope expansion.

## Responsive Design

The application should support:

- Mobile
- Tablet
- Desktop

Mobile usability is important because clients are expected to access the booking system primarily through smartphones.

## Security Principles

Version 1 should follow basic security practices:

- Password hashing
- Protected admin routes
- Server-side authorization
- Input validation
- Environment variables for secrets
- No secrets committed to Git
- Restricted admin APIs

## Repository Structure

The final structure will evolve during implementation.

Initial structure:

photography-booking-system/
├── docs/
│   ├── vision.md
│   ├── requirements.md
│   ├── roadmap.md
│   ├── user-stories.md
│   ├── user-flow.md
│   ├── sitemap.md
│   ├── erd.md
│   └── wireframes.md
│
├── README.md
└── .gitignore

After application initialization, the repository will also contain the Next.js application source code.

## Development Principles

The project follows several principles:

1. Build the minimum usable version first.
2. Avoid adding Version 2 or Version 3 features prematurely.
3. Complete and test one development phase before moving to the next.
4. Keep the main booking workflow simple.
5. Preserve booking history.
6. Prioritize real business needs over feature quantity.
7. Keep the system maintainable and expandable.

## Purpose

This project is designed as both:

- A real-world booking system that can be used by a freelance photography business.
- A portfolio and freelance product that can later be adapted for other photographers.

The goal is not only to demonstrate technical skills, but to create a system that can solve an actual business workflow.

## Author

Developed by Muh. Fayiz Syamsuddin.