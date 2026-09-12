# User Stories

## Overview

This document defines the Version 1 user stories for Photography Booking System.

The system has two primary actors:

- Visitor / Client
- Admin / Photographer

Version 1 focuses on the public booking workflow and basic admin management.

---

# 1. Visitor / Client User Stories

## 1.1 Browse the Website

As a visitor,  
I want to view the photography business website,  
so that I can understand the services offered.

### Acceptance Criteria

- The homepage is accessible without authentication.
- The website works on mobile and desktop.
- Navigation to Portfolio, Packages, Booking, and Contact is available.

---

## 1.2 View Portfolio

As a visitor,  
I want to view photography portfolio items,  
so that I can evaluate the photographer's work.

### Acceptance Criteria

- Only published portfolio items are displayed.
- Each item shows an image and title.
- Optional information such as description, location, or photography type may be shown.
- Unpublished portfolio items are not visible publicly.

---

## 1.3 View Photography Packages

As a visitor,  
I want to view available photography packages,  
so that I can compare services before submitting a booking.

### Acceptance Criteria

- Only active packages are displayed.
- Each package shows its name.
- Each package shows its price.
- Each package shows its description.
- Duration and included services are displayed when available.
- Inactive packages are not visible publicly.

---

## 1.4 Start a Booking

As a visitor,  
I want to select a photography package and submit a booking request,  
so that I can request photography services.

### Acceptance Criteria

The booking form allows the visitor to provide:

- Name
- WhatsApp / phone number
- Email, optional
- Package
- Booking date
- Booking time
- Location
- Additional notes

---

## 1.5 Submit a Valid Booking

As a visitor,  
I want my booking request to be saved,  
so that the photographer can review my request.

### Acceptance Criteria

- Required fields are validated.
- Invalid submissions show clear errors.
- A valid booking is stored in the database.
- New bookings receive the `NEW` status.
- The visitor receives a successful submission message.

---

## 1.6 Receive Validation Feedback

As a visitor,  
I want to know when information in the booking form is invalid,  
so that I can correct it before submitting.

### Acceptance Criteria

Examples of invalid submissions include:

- Missing name
- Missing phone number
- Missing package
- Missing booking date
- Missing booking time
- Missing location

The form should provide meaningful error messages.

---

## 1.7 Contact the Photographer

As a visitor,  
I want to contact the photographer through WhatsApp,  
so that I can ask questions before or after submitting a booking.

### Acceptance Criteria

- A WhatsApp contact action is available.
- The action opens the configured photographer WhatsApp contact.

---

# 2. Admin / Photographer User Stories

## 2.1 Admin Login

As an admin,  
I want to log in securely,  
so that I can access the management dashboard.

### Acceptance Criteria

- Login requires email and password.
- Invalid credentials are rejected.
- Successful login creates an authenticated session.
- Only admin users may access the admin dashboard.

---

## 2.2 Protected Admin Area

As an admin,  
I want admin pages to be protected,  
so that unauthorized users cannot access business data.

### Acceptance Criteria

- Unauthenticated users cannot access protected admin pages.
- Unauthorized users cannot access admin APIs.
- Admin authorization is checked on the server.

---

## 2.3 View Dashboard

As an admin,  
I want to view a dashboard summary,  
so that I can quickly understand booking activity.

### Acceptance Criteria

The dashboard shows at least:

- Total bookings
- New bookings
- Confirmed bookings
- Upcoming bookings

The dashboard may also show recent booking requests.

---

# 3. Booking Management User Stories

## 3.1 View Booking List

As an admin,  
I want to view all booking requests,  
so that I can manage incoming clients.

### Acceptance Criteria

The list should include useful information such as:

- Client name
- Package
- Booking date
- Booking time
- Location
- Status

---

## 3.2 View Booking Detail

As an admin,  
I want to view complete booking information,  
so that I can understand the client's request.

### Acceptance Criteria

The booking detail should include:

- Client name
- Phone / WhatsApp
- Email when available
- Selected package
- Booking date
- Booking time
- Location
- Additional notes
- Booking status
- Submission date

---

## 3.3 Contact Client

As an admin,  
I want easy access to the client's contact information,  
so that I can follow up on the booking.

### Acceptance Criteria

- Client phone number is visible.
- A WhatsApp contact action may be provided.
- Email is visible when the client submitted one.

---

## 3.4 Confirm Booking

As an admin,  
I want to change a booking from `NEW` to `CONFIRMED`,  
so that I can mark an accepted booking.

### Acceptance Criteria

- Admin can update the booking status.
- The updated status is stored in the database.
- The new status appears in the booking list and detail page.

---

## 3.5 Complete Booking

As an admin,  
I want to mark a confirmed booking as completed,  
so that finished photography jobs can be tracked.

### Acceptance Criteria

- Admin can change status to `COMPLETED`.
- The change persists in the database.

---

## 3.6 Cancel Booking

As an admin,  
I want to mark a booking as cancelled,  
so that cancelled requests are clearly identified.

### Acceptance Criteria

- Admin can change status to `CANCELLED`.
- The booking remains stored for historical reference.

---

# 4. Package Management User Stories

## 4.1 View Packages

As an admin,  
I want to view all photography packages,  
so that I can manage the services offered.

### Acceptance Criteria

The admin package list displays:

- Package name
- Price
- Active status
- Display order
- Available actions

---

## 4.2 Create Package

As an admin,  
I want to create a photography package,  
so that I can publish new service offerings.

### Acceptance Criteria

Admin can provide:

- Name
- Slug
- Description
- Price
- Duration
- Included services
- Optional image
- Active status
- Display order

The new package is stored in the database.

---

## 4.3 Edit Package

As an admin,  
I want to edit an existing package,  
so that service information remains accurate.

### Acceptance Criteria

- Existing package data can be updated.
- Changes persist in the database.
- Public pages display the updated content.

---

## 4.4 Activate or Deactivate Package

As an admin,  
I want to control whether a package appears publicly,  
so that unavailable services can be temporarily hidden.

### Acceptance Criteria

- Active packages are visible publicly.
- Inactive packages are hidden publicly.
- Inactive packages remain available in the admin panel.

---

## 4.5 Delete Package

As an admin,  
I want to delete a package that is no longer needed,  
so that the package list remains manageable.

### Acceptance Criteria

- Admin can request package deletion.
- A confirmation should be shown before deletion.
- The system must avoid creating invalid booking data.

Implementation details related to packages already referenced by bookings will be determined during database design.

---

# 5. Portfolio Management User Stories

## 5.1 View Portfolio Items

As an admin,  
I want to view all portfolio items,  
so that I can manage the work displayed on the public website.

### Acceptance Criteria

The admin portfolio list should show:

- Image
- Title
- Published status
- Display order
- Available actions

---

## 5.2 Create Portfolio Item

As an admin,  
I want to add a portfolio item,  
so that I can showcase new photography work.

### Acceptance Criteria

Admin can provide:

- Title
- Slug
- Description
- Image
- Optional location
- Optional photography type
- Published status
- Display order

The item is stored in the database.

---

## 5.3 Edit Portfolio Item

As an admin,  
I want to edit portfolio information,  
so that public content remains accurate.

### Acceptance Criteria

- Existing portfolio information can be updated.
- Changes persist in the database.

---

## 5.4 Publish or Unpublish Portfolio Item

As an admin,  
I want to control whether a portfolio item appears publicly,  
so that I can prepare content before publishing it.

### Acceptance Criteria

- Published items are visible publicly.
- Unpublished items are hidden publicly.
- Both remain visible inside the admin panel.

---

## 5.5 Delete Portfolio Item

As an admin,  
I want to remove a portfolio item,  
so that outdated content is no longer displayed.

### Acceptance Criteria

- Admin can delete a portfolio item.
- A confirmation should be shown before deletion.
- The item no longer appears publicly after deletion.

---

# 6. Session User Stories

## 6.1 Admin Logout

As an admin,  
I want to log out,  
so that my admin session can be safely ended.

### Acceptance Criteria

- A logout action is available.
- The active session is ended.
- The user is redirected away from protected admin pages.

---

# 7. Version 1 Priority

User stories are prioritized as follows.

## Must Have

- Public homepage
- Portfolio
- Packages
- Booking submission
- Booking validation
- Admin login
- Protected admin area
- Dashboard
- Booking list
- Booking detail
- Booking status update
- Package CRUD
- Portfolio CRUD
- Logout
- Responsive interface

## Should Have

- WhatsApp shortcuts
- Recent bookings dashboard
- Portfolio display ordering
- Package display ordering
- Image uploads
- Good empty and loading states

## Could Have

- Extra dashboard visualizations
- Additional homepage sections
- More advanced animations

## Not in Version 1

- Payment gateway
- Availability calendar
- Client accounts
- Automatic notifications
- Private galleries
- Revenue reporting
- Multi-photographer support