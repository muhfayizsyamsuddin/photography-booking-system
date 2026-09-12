# Entity Relationship Diagram

## Overview

This document defines the Version 1 database structure for Photography Booking System.

Version 1 uses four main entities:

- User
- Package
- Portfolio
- Booking

The database should support the public booking flow and basic CMS functionality without adding Version 2 or Version 3 complexity too early.

---

# 1. User

Represents an admin account that can access the management dashboard.

## Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | String / UUID | Yes | Primary key |
| name | String | Yes | Admin display name |
| email | String | Yes | Unique |
| passwordHash | String | Yes | Hashed password |
| role | UserRole | Yes | Default ADMIN |
| createdAt | DateTime | Yes | Created timestamp |
| updatedAt | DateTime | Yes | Updated timestamp |

## UserRole

```text
ADMIN
```
Version 1 only requires one role.

# 2. Package

Represents a photography service package that can be displayed publicly and selected during booking.

## Fields

| Field            | Type              | Required | Notes                    |
| ---------------- | ----------------- | -------: | ------------------------ |
| id               | String / UUID     |      Yes | Primary key              |
| name             | String            |      Yes | Package name             |
| slug             | String            |      Yes | Unique public identifier |
| description      | Text              |      Yes | Package description      |
| price            | Decimal / Integer |      Yes | Package price            |
| duration         | String            |       No | Example: 2 hours         |
| includedServices | Text              |       No | Package inclusions       |
| imageUrl         | String            |       No | Package image            |
| isActive         | Boolean           |      Yes | Public visibility        |
| displayOrder     | Integer           |      Yes | Sorting                  |
| createdAt        | DateTime          |      Yes | Created timestamp        |
| updatedAt        | DateTime          |      Yes | Updated timestamp        |

## Notes

- Only isActive = true packages are displayed publicly.
- slug must be unique.
- displayOrder controls public ordering.
- Price should be stored as a numeric database type rather than formatted text.

# 3. Portfolio

Represents photography work displayed on the public portfolio page.

## Fields

| Field           | Type          | Required | Notes                     |
| --------------- | ------------- | -------: | ------------------------- |
| id              | String / UUID |      Yes | Primary key               |
| title           | String        |      Yes | Portfolio title           |
| slug            | String        |      Yes | Unique identifier         |
| description     | Text          |       No | Description               |
| imageUrl        | String        |      Yes | Main image                |
| location        | String        |       No | Shooting location         |
| photographyType | String        |       No | Wedding, graduation, etc. |
| isPublished     | Boolean       |      Yes | Public visibility         |
| displayOrder    | Integer       |      Yes | Sorting                   |
| createdAt       | DateTime      |      Yes | Created timestamp         |
| updatedAt       | DateTime      |      Yes | Updated timestamp         |

## Notes

- Only published portfolio items appear on public pages.
- Version 1 uses one main image per portfolio item.
- Multi-image galleries can be introduced later if needed.
- slug must be unique.

# 4. Booking

Represents a booking request submitted by a client.

## Fields

| Field       | Type          | Required | Notes                |
| ----------- | ------------- | -------: | -------------------- |
| id          | String / UUID |      Yes | Primary key          |
| clientName  | String        |      Yes | Client name          |
| phone       | String        |      Yes | WhatsApp / phone     |
| email       | String        |       No | Client email         |
| bookingDate | Date          |      Yes | Requested date       |
| bookingTime | String / Time |      Yes | Requested time       |
| location    | String        |      Yes | Shooting location    |
| notes       | Text          |       No | Additional request   |
| status      | BookingStatus |      Yes | Default NEW          |
| packageId   | String / UUID |      Yes | Package relation     |
| createdAt   | DateTime      |      Yes | Submission timestamp |
| updatedAt   | DateTime      |      Yes | Updated timestamp    |

# 5. BookingStatus

- NEW
- CONFIRMED
- COMPLETED
- CANCELLED

## Status Meaning

- NEW

Booking request has been submitted and has not yet been reviewed.

- CONFIRMED

Photographer has accepted the request.

- COMPLETED

Photography service has been completed.

- CANCELLED

Booking has been cancelled.

# 6. Relationships

Package → Booking

One package can be referenced by many bookings.

Package
   1
   │
   │
   └─────────────── *
                  Booking

Relationship:

Package 1 : N Booking

A booking must reference one package.

# 7. High-Level ERD

┌─────────────────────┐
│        User         │
├─────────────────────┤
│ id                  │
│ name                │
│ email               │
│ passwordHash        │
│ role                │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘


┌─────────────────────┐
│       Package       │
├─────────────────────┤
│ id                  │
│ name                │
│ slug                │
│ description         │
│ price               │
│ duration            │
│ includedServices    │
│ imageUrl            │
│ isActive            │
│ displayOrder        │
│ createdAt           │
│ updatedAt           │
└──────────┬──────────┘
           │
           │ 1
           │
           │
           │ N
┌──────────▼──────────┐
│       Booking       │
├─────────────────────┤
│ id                  │
│ clientName          │
│ phone               │
│ email               │
│ bookingDate         │
│ bookingTime         │
│ location            │
│ notes               │
│ status              │
│ packageId           │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘


┌─────────────────────┐
│      Portfolio      │
├─────────────────────┤
│ id                  │
│ title               │
│ slug                │
│ description         │
│ imageUrl            │
│ location            │
│ photographyType     │
│ isPublished         │
│ displayOrder        │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘

# 8. Relationship Details

## Package to Booking

Package.id
    ↓
Booking.packageId

A package can have:

0..N bookings

A booking must have:

exactly 1 package

# 9. Package Deletion Strategy

Packages may already be referenced by historical bookings.

Therefore, Version 1 should avoid automatically deleting package records that are still referenced by bookings.

Recommended behavior:

Admin requests package deletion
        ↓
Package has bookings?
        ↓
 ┌──────────────┐
 │              │
Yes             No
 │              │
 ↓              ↓
Prevent       Delete
Deletion      Package

If a package is no longer offered, the preferred action is:

isActive = false

This preserves booking history.

# 10. Portfolio Deletion Strategy

Portfolio items are independent from bookings.

They may be deleted if they are no longer needed.

If external image storage is used:

Portfolio database record
        ↓
Image URL
        ↓
External storage asset

Deleting the database record does not automatically guarantee deletion of the external media asset unless explicitly implemented.

# 11. Data Constraints

Recommended constraints:

## User

email UNIQUE

## Package

slug UNIQUE

## Portfolio

slug UNIQUE

## Booking

packageId NOT NULL
status DEFAULT NEW

# 12. Index Recommendations

Useful indexes may include:

- User.email
- Package.slug
- Package.isActive
- Portfolio.slug
- Portfolio.isPublished
- Booking.packageId
- Booking.status
- Booking.bookingDate
- Booking.createdAt

These indexes can help with common queries.

# 13. Booking Query Examples

Admin dashboard may require queries such as:

- Total bookings
- Bookings WHERE status = NEW
- Bookings WHERE status = CONFIRMED
- Bookings WHERE bookingDate >= today
- Recent bookings ORDER BY createdAt DESC

Public package query:

- Packages
- WHERE isActive = true
- ORDER BY displayOrder ASC

Public portfolio query:

- Portfolio
- WHERE isPublished = true
- ORDER BY displayOrder ASC

# 14. Version 1 Prisma Direction

The Prisma schema will approximately contain:

User
Package
Portfolio
Booking

UserRole
BookingStatus

The actual Prisma implementation will be created during the Database phase.

# 15. Future Database Expansion

Version 2 may introduce entities such as:

- Client
- Payment
- Testimonial
- PortfolioCategory
- PackageAddon
- Availability

Version 3 may introduce:

- ClientAccount
- Gallery
- GalleryImage
- Invoice
- Photographer
- Voucher
- Notification

These should not be added to Version 1 unless required.

# 16. Database Principles

1. Preserve historical booking data.
2. Avoid unnecessary entities in Version 1.
3. Keep booking logic simple.
4. Use relational constraints where appropriate.
5. Store media URLs rather than binary files.
6. Use timestamps for important records.
7. Future features should be introduced through deliberate migrations.