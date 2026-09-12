# User Flow

## Overview

This document describes the main Version 1 user flows for Photography Booking System.

There are two primary flows:

- Visitor / Client Flow
- Admin / Photographer Flow

Version 1 focuses on the simplest usable booking process.

---

# 1. Visitor / Client Flow

## 1.1 Main Website Flow

```text
Visitor opens website
        ↓
      Home
        ↓
 ┌───────────────┬────────────────┬───────────────┐
 ↓               ↓                ↓               ↓
Portfolio      Packages         Booking         Contact
```
The visitor can browse freely without authentication.

# 2. Home Page Flow

Home
 ↓
Hero
 ↓
Short Introduction
 ↓
Featured Portfolio
 ↓
Featured Packages
 ↓
Booking CTA
 ↓
Contact / WhatsApp CTA
 ↓
Footer

Primary actions:

- View Portfolio
- View Packages
- Book Now
- Contact via WhatsApp

# 3. Portfolio Flow

Visitor
  ↓
Portfolio Page
  ↓
View Published Portfolio Items
  ↓
View Image + Project Information
  ↓
Interested in Service
  ↓
View Packages / Book Now

Only published portfolio items are visible publicly.

Unpublished items remain accessible only in the admin area.

# 4. Package Flow

Visitor
  ↓
Packages Page
  ↓
View Active Packages
  ↓
Compare Package Information
  ↓
Choose Package
  ↓
Book Now
  ↓
Booking Form

Package information may include:

- Name
- Description
- Price
- Duration
- Included services
- Image

Only active packages are shown publicly.

# 5. Booking Flow

## 5.1 Booking Submission

Visitor
  ↓
Booking Page
  ↓
Select Package
  ↓
Enter Client Information
  ↓
Enter Booking Date
  ↓
Enter Booking Time
  ↓
Enter Location
  ↓
Enter Additional Notes
  ↓
Submit Form

Required information:

- Name
- Phone / WhatsApp
- Package
- Date
- Time
- Location

Optional information:

- Email
- Additional notes

## 5.2 Booking Validation

Submit Booking
     ↓
Server Validation
     ↓
 ┌───────────────┐
 │ Data Valid?   │
 └───────┬───────┘
         │
   ┌─────┴─────┐
   │           │
  No          Yes
   │           │
   ↓           ↓
Show Error   Create Booking
               ↓
          Status = NEW
               ↓
         Store in Database
               ↓
         Success Message

If validation fails:

- The booking is not stored.
- The visitor receives a meaningful validation message.

# 6. Booking Confirmation Model

Version 1 does not automatically guarantee schedule availability.

The booking submitted by the client is a request.

Client submits request
        ↓
Status = NEW
        ↓
Photographer reviews request
        ↓
Photographer contacts client
        ↓
Booking accepted?
     ┌───────┴───────┐
     ↓               ↓
    Yes              No
     ↓               ↓
CONFIRMED        CANCELLED

Schedule conflict checking will be introduced in a later version.

# 7. WhatsApp Flow

Visitors may contact the photographer directly.

Visitor
  ↓
Click WhatsApp CTA
  ↓
Open WhatsApp
  ↓
Start Conversation

WhatsApp may be used for:

- Questions
- Booking clarification
- Location discussion
- Confirmation
- Payment discussion

Version 1 does not automatically synchronize WhatsApp conversations with the system.

# 8. Admin Authentication Flow

Admin
  ↓
/admin/login
  ↓
Enter Email + Password
  ↓
Submit Credentials
  ↓
Validate Credentials
  ↓
 ┌───────────────────┐
 │ Credentials Valid?│
 └─────────┬─────────┘
           │
     ┌─────┴─────┐
     │           │
    No          Yes
     │           │
     ↓           ↓
Show Error   Check ADMIN Role
                 ↓
          Create Session
                 ↓
          Admin Dashboard

If the user is not authenticated:

Protected Admin Page
        ↓
Authentication Check
        ↓
No Valid Session
        ↓
Redirect to Login

# 9. Admin Dashboard Flow

Admin Login
    ↓
Dashboard
    ↓
 ┌──────────────┬──────────────┬──────────────┐
 ↓              ↓              ↓              ↓
Bookings      Packages       Portfolio       Logout

Dashboard summary includes:

- Total bookings
- New bookings
- Confirmed bookings
- Upcoming bookings
- Recent bookings

# 10. Admin Booking Management Flow

## 10.1 Booking List

Admin
  ↓
Booking List
  ↓
View Incoming Bookings
  ↓
Select Booking
  ↓
Booking Detail

The list may display:

- Client
- Package
- Date
- Time
- Location
- Status

## 10.2 Booking Detail

Booking Detail
      ↓
View Client Information
      ↓
View Selected Package
      ↓
View Date / Time / Location
      ↓
View Additional Notes
      ↓
Contact Client
      ↓
Update Status

## 10.3 Status Flow

The normal booking lifecycle is:

NEW
 ↓
CONFIRMED
 ↓
COMPLETED

A booking may also become:

NEW
 ↓
CANCELLED

or:

CONFIRMED
 ↓
CANCELLED

Version 1 supported statuses:

NEW
CONFIRMED
COMPLETED
CANCELLED

Bookings should remain stored even when cancelled.

# 11. Package Management Flow

## 11.1 View Packages

Admin
  ↓
Packages
  ↓
Package List

Admin may then:

- Create Package
- Edit Package
- Activate / Deactivate Package
- Delete Package

## 11.2 Create Package

Packages
   ↓
New Package
   ↓
Enter Package Information
   ↓
Validate
   ↓
Save
   ↓
Package List

If the package is active:

Saved Package
    ↓
Active = true
    ↓
Visible on Public Website

If inactive:

Saved Package
    ↓
Active = false
    ↓
Hidden from Public Website

## 11.3 Edit Package

Package List
    ↓
Select Edit
    ↓
Edit Information
    ↓
Save Changes
    ↓
Database Updated
    ↓
Public Website Updated

## 11.4 Delete Package

Package List
    ↓
Delete
    ↓
Confirmation
    ↓
Check Data Constraints
    ↓
Delete if Allowed

A package referenced by existing bookings must not create invalid booking history.

The exact database behavior will be defined in erd.md.

# 12. Portfolio Management Flow

## 12.1 Portfolio List

Admin
  ↓
Portfolio
  ↓
Portfolio List

Admin may:

- Create
- Edit
- Publish / Unpublish
- Delete

## 12.2 Create Portfolio Item

Portfolio
   ↓
New Portfolio Item
   ↓
Enter Information
   ↓
Upload / Select Image
   ↓
Validate
   ↓
Save

If published:

Published = true
      ↓
Visible Publicly

If unpublished:

Published = false
      ↓
Admin Only

## 12.3 Edit Portfolio Item

Portfolio List
      ↓
Edit
      ↓
Update Information
      ↓
Save
      ↓
Public Content Updated

## 12.4 Delete Portfolio Item

Portfolio List
      ↓
Delete
      ↓
Confirmation
      ↓
Delete Record
      ↓
Remove from Public Website

Media asset cleanup will depend on the image storage implementation.

# 13. Admin Logout Flow

Admin
  ↓
Logout
  ↓
Destroy Session
  ↓
Redirect to Login / Public Website

After logout, protected admin routes must no longer be accessible.

# 14. Complete Version 1 Business Flow

Photographer creates packages and portfolio
                    ↓
             Public Website
                    ↓
             Visitor arrives
                    ↓
       Views Portfolio + Packages
                    ↓
            Submits Booking
                    ↓
              Status = NEW
                    ↓
          Admin sees Booking
                    ↓
        Admin contacts Client
                    ↓
         Booking confirmed
                    ↓
          Status = CONFIRMED
                    ↓
        Photography job occurs
                    ↓
          Status = COMPLETED

# 15. Version 2 Expansion

Future operational flow may add:

Booking
  ↓
Availability Check
  ↓
Deposit
  ↓
Payment Verification
  ↓
Confirmation
  ↓
Reminder
  ↓
Photography Session

These flows are intentionally excluded from Version 1.

# 16. Flow Principles

Version 1 must follow these principles:

1. A booking submission is a request, not an automatic confirmation.
2. The photographer controls booking approval.
3. WhatsApp remains available for direct communication.
4. Booking history should remain stored.
5. Public users do not need accounts.
6. Admin functionality must remain protected.
7. Version 1 should prioritize a simple and reliable workflow.