# Requirements

## 1. Overview

Photography Booking System is a web-based platform for freelance photographers and mobile photography businesses.

The system allows clients to view photography services and submit booking requests, while photographers can manage bookings, service packages, and portfolio content through an admin dashboard.

Version 1 focuses on the minimum features required to support the booking workflow and basic content management.

---

## 2. User Roles

### 2.1 Visitor / Client

A visitor can:

- View the homepage.
- View photography portfolio.
- View photography packages.
- Submit a booking request.
- View contact information.
- Contact the photographer through WhatsApp.

### 2.2 Admin / Photographer

An admin can:

- Log in to the admin panel.
- View dashboard summary.
- View booking list.
- View booking details.
- Update booking status.
- Manage photography packages.
- Manage portfolio items.
- Log out.

---

# 3. Functional Requirements

## 3.1 Public Website

The public website must provide:

- Responsive navigation.
- Homepage.
- Portfolio page.
- Packages page.
- Booking page.
- Contact section or page.
- WhatsApp contact action.
- Responsive layout for mobile, tablet, and desktop.

---

## 3.2 Homepage

The homepage should include:

- Hero section.
- Short introduction.
- Featured portfolio.
- Featured photography packages.
- Booking call-to-action.
- Contact or WhatsApp call-to-action.

The homepage should clearly guide visitors toward viewing packages and submitting a booking request.

---

## 3.3 Portfolio

Visitors must be able to:

- View published portfolio items.
- View portfolio images.
- View basic information about each portfolio item.

Each portfolio item may contain:

- Title.
- Description.
- Image.
- Optional location.
- Optional photography type.
- Display order.
- Published status.

Version 1 does not require advanced filtering or category-based navigation.

---

## 3.4 Photography Packages

Visitors must be able to view available photography packages.

Each package may contain:

- Name.
- Description.
- Price.
- Duration.
- Included services.
- Optional image.
- Active status.
- Display order.

Only active packages should be shown on the public website.

---

## 3.5 Booking

Visitors must be able to submit a booking request.

Required booking information:

- Client name.
- WhatsApp / phone number.
- Photography package.
- Booking date.
- Booking time.
- Location.
- Additional notes.

Optional information:

- Email address.

After a booking is submitted:

1. The data must be validated.
2. The booking must be stored in the database.
3. The initial booking status must be `NEW`.
4. The user must receive a successful submission message.

The system does not automatically confirm booking availability in Version 1.

Booking approval is handled manually by the photographer.

---

## 3.6 Booking Status

Version 1 supports the following booking statuses:

```text
NEW
CONFIRMED
COMPLETED
CANCELLED
```

Status meaning:

- NEW

A new booking request has been submitted and has not yet been reviewed.

- CONFIRMED

The photographer has reviewed and accepted the booking.

- COMPLETED

The photography service has been completed.

- CANCELLED

The booking has been cancelled.

## 4. Admin Requirements

### 4.1 Authentication

The admin panel must require authentication.

Requirements:

- Admin login using email and password.
- Password must be stored securely using hashing.
- Authentication must use a secure session mechanism.
- Unauthenticated users must not access protected admin pages.
- Non-admin users must not access admin functionality.

Version 1 only requires the ADMIN role.

### 4.2 Admin Dashboard

The dashboard should display basic business information.

Minimum statistics:

- Total bookings.
- New bookings.
- Confirmed bookings.
- Upcoming bookings.

The dashboard may also display recent booking requests.

### 4.3 Booking Management

Admin must be able to:

- View all bookings.
- View booking details.
- View client contact information.
- View selected package.
- View booking date and time.
- View location.
- View client notes.
- Update booking status.

Booking records should not be deleted by default from the admin interface in Version 1.

### 4.4 Package Management

Admin must be able to:

- View packages.
- Create a package.
- Edit a package.
- Activate or deactivate a package.
- Delete a package.

Package fields:

- Name.
- Slug.
- Description.
- Price.
- Duration.
- Included services.
- Image URL.
- Active status.
- Display order.

### 4.5 Portfolio Management

Admin must be able to:

- View portfolio items.
- Create a portfolio item.
- Edit a portfolio item.
- Publish or unpublish a portfolio item.
- Delete a portfolio item.

Portfolio fields:

- Title.
- Slug.
- Description.
- Image URL.
- Location.
- Photography type.
- Published status.
- Display order.

## 5. Data Requirements

Version 1 requires the following main entities:

- User
- Package
- Portfolio
- Booking

Possible supporting enums:

- UserRole
- BookingStatus

The detailed structure will be defined in erd.md.

## 6. Validation Requirements

The system must validate user input.

Examples:

- Client name must not be empty.
- Phone number must not be empty.
- A valid package must be selected.
- Booking date must be provided.
- Booking time must be provided.
- Location must not be empty.
- Invalid requests must return meaningful validation errors.

Server-side validation is required.

Client-side validation may also be implemented to improve user experience.

## 7. Media Requirements

Images will be used for:

- Portfolio.
- Photography packages.

Version 1 may use an external media storage provider such as Cloudinary.

Images should not be stored directly as binary data inside PostgreSQL.

The database should store image URLs.

## 8. Responsive Requirements

The public website and admin dashboard must support:

- Mobile.
- Tablet.
- Desktop.

The booking form must be easy to complete on a mobile device because many clients are expected to access the platform through smartphones.

## 9. SEO Requirements

The public website should provide basic SEO support.

Minimum requirements:

- Page title.
- Meta description.
- Semantic HTML.
- Open Graph metadata where appropriate.
- Sitemap.
- Robots configuration.

Advanced SEO tooling is outside Version 1 scope.

## 10. Security Requirements

Version 1 must implement basic security practices:

- Password hashing.
- Protected admin routes.
- Server-side authorization checks.
- Input validation.
- Environment variables for secrets.
- No secrets committed to Git.
- Avoid exposing sensitive data through API responses.

## 11. Version 1 Scope

Version 1 includes:

- Public website.
- Portfolio.
- Photography packages.
- Booking form.
- WhatsApp contact.
- Admin authentication.
- Dashboard.
- Booking management.
- Package management.
- Portfolio management.
- Responsive design.
- Basic SEO.
- Deployment.

## 12. Out of Scope for Version 1

The following features are intentionally excluded:

- Payment gateway.
- Automatic payment verification.
- Invoice generation.
- Automatic WhatsApp notifications.
- Automatic email reminders.
- Availability calendar.
- Automatic booking conflict prevention.
- Client accounts.
- Client booking history.
- Private photo galleries.
- Photo delivery.
- Multi-photographer management.
- Revenue reports.
- Advanced analytics.
- Promo codes.
- Voucher management.
- Testimonials management.
- Package add-ons.
- Rescheduling workflow.

These may be introduced in Version 2 or Version 3.

## 13. Version 1 Success Criteria

Version 1 is considered complete when:

1. Visitors can browse portfolio and packages.
2. Visitors can successfully submit a booking request.
3. Booking data is stored correctly.
4. Admin can log in securely.
5. Admin can view and manage booking status.
6. Admin can manage packages.
7. Admin can manage portfolio content.
8. The website works properly on mobile and desktop.
9. The application is deployed and accessible online.
10. The main booking workflow can be completed without critical errors.
