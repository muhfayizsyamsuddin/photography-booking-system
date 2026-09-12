# Wireframes

## Overview

This document defines the initial Version 1 layout structure for Photography Booking System.

The wireframes focus on:

- Public website
- Booking flow
- Admin dashboard
- Booking management
- Package management
- Portfolio management

These wireframes describe structure and information hierarchy, not final visual styling.

---

# 1. Public Navbar

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ LOGO       Home  Portfolio  Packages  Booking  Contact       │
│                                              [ Book Now ]    │
└──────────────────────────────────────────────────────────────┘
Mobile:

┌─────────────────────────────────────┐
│ LOGO                         [ ☰ ]  │
└─────────────────────────────────────┘

Expanded mobile menu:

┌─────────────────────────────────────┐
│ Home                                │
│ Portfolio                           │
│ Packages                            │
│ Booking                             │
│ Contact                             │
│                                     │
│ [ Book Now ]                        │
└─────────────────────────────────────┘
```

# 2. Home Page

Route:

/

Layout:

┌──────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ HERO                                                         │
│                                                              │
│ Capture Your Moments                                         │
│ With Professional Photography                                │
│                                                              │
│ Short supporting description                                │
│                                                              │
│ [ Book a Session ]   [ View Portfolio ]                      │
│                                            [ HERO IMAGE ]    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ABOUT / INTRODUCTION                                         │
│                                                              │
│ Short explanation about the photographer / business          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ FEATURED PORTFOLIO                                           │
│                                                              │
│ [ Image ] [ Image ] [ Image ]                                │
│                                                              │
│                 [ View All Portfolio ]                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ FEATURED PACKAGES                                            │
│                                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│ │ Package A   │ │ Package B   │ │ Package C   │              │
│ │ Price       │ │ Price       │ │ Price       │              │
│ │ Details     │ │ Details     │ │ Details     │              │
│ │ [Book Now]  │ │ [Book Now]  │ │ [Book Now]  │              │
│ └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ BOOKING CTA                                                  │
│                                                              │
│ Ready to book your photography session?                      │
│                                                              │
│ [ Book Now ]                                                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ CONTACT / WHATSAPP CTA                                       │
│                                                              │
│ Need to ask something first?                                 │
│ [ Chat on WhatsApp ]                                         │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

# 3. Portfolio Page

Route:

/portfolio

Layout:

┌──────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├──────────────────────────────────────────────────────────────┤
│ PAGE HEADER                                                  │
│                                                              │
│ Portfolio                                                    │
│ Selected photography work                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ PORTFOLIO GRID                                               │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │    IMAGE     │ │    IMAGE     │ │    IMAGE     │           │
│ │ Title        │ │ Title        │ │ Title        │           │
│ │ Type         │ │ Type         │ │ Type         │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │    IMAGE     │ │    IMAGE     │ │    IMAGE     │           │
│ │ Title        │ │ Title        │ │ Title        │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ BOOKING CTA                                                  │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Version 1 does not require portfolio filtering.

# 4. Packages Page

Route:

/packages

Layout:

┌──────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├──────────────────────────────────────────────────────────────┤
│ PAGE HEADER                                                  │
│                                                              │
│ Photography Packages                                         │
│ Choose the package that fits your needs                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ PACKAGE CARDS                                                │
│                                                              │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│ │ IMAGE           │ │ IMAGE           │ │ IMAGE           │  │
│ │                 │ │                 │ │                 │  │
│ │ Package Name    │ │ Package Name    │ │ Package Name    │  │
│ │ Rp xxx.xxx      │ │ Rp xxx.xxx      │ │ Rp xxx.xxx      │  │
│ │                 │ │                 │ │                 │  │
│ │ Duration        │ │ Duration        │ │ Duration        │  │
│ │ Includes        │ │ Includes        │ │ Includes        │  │
│ │                 │ │                 │ │                 │  │
│ │ [ Book Now ]    │ │ [ Book Now ]    │ │ [ Book Now ]    │  │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

# 5. Booking Page

Route:

/booking

Desktop:

┌──────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ BOOK A PHOTOGRAPHY SESSION                                   │
│                                                              │
│ ┌──────────────────────────────┐  ┌────────────────────────┐  │
│ │ BOOKING FORM                 │  │ BOOKING INFORMATION    │  │
│ │                              │  │                        │  │
│ │ Name                         │  │ How booking works      │  │
│ │ [________________________]   │  │                        │  │
│ │                              │  │ 1. Submit request      │  │
│ │ WhatsApp / Phone             │  │ 2. Photographer       │  │
│ │ [________________________]   │  │    reviews request    │  │
│ │                              │  │ 3. Confirmation via   │  │
│ │ Email                        │  │    WhatsApp            │  │
│ │ [________________________]   │  │                        │  │
│ │                              │  │ Booking is not         │  │
│ │ Package                      │  │ automatically          │  │
│ │ [ Select Package       ▼ ]   │  │ confirmed.             │  │
│ │                              │  │                        │  │
│ │ Date                         │  └────────────────────────┘  │
│ │ [________________________]   │                              │
│ │                              │                              │
│ │ Time                         │                              │
│ │ [________________________]   │                              │
│ │                              │                              │
│ │ Location                     │                              │
│ │ [________________________]   │                              │
│ │                              │                              │
│ │ Notes                        │                              │
│ │ [                        ]   │                              │
│ │ [                        ]   │                              │
│ │                              │                              │
│ │ [ Submit Booking ]           │                              │
│ └──────────────────────────────┘                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Mobile:

┌───────────────────────────────┐
│ Booking                       │
│                               │
│ Booking information           │
│                               │
│ Name                          │
│ [_________________________]   │
│                               │
│ Phone                         │
│ [_________________________]   │
│                               │
│ Package                       │
│ [ Select                ▼ ]   │
│                               │
│ Date                          │
│ [_________________________]   │
│                               │
│ Time                          │
│ [_________________________]   │
│                               │
│ Location                      │
│ [_________________________]   │
│                               │
│ Notes                         │
│ [                       ]     │
│                               │
│ [ Submit Booking ]            │
└───────────────────────────────┘

# 6. Booking Success State

After successful submission:

┌───────────────────────────────────────────┐
│ ✓ Booking Request Received                │
│                                           │
│ Your request has been submitted.          │
│ The photographer will review your         │
│ booking and contact you for confirmation. │
│                                           │
│ [ Contact via WhatsApp ]                  │
│ [ Back to Home ]                          │
└───────────────────────────────────────────┘

Important:

The wording should make it clear that the booking is still a request.

# 7. Contact Page

Route:

/contact

Layout:

┌──────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├──────────────────────────────────────────────────────────────┤
│ CONTACT                                                      │
│                                                              │
│ Have questions before booking?                               │
│                                                              │
│ WhatsApp                                                     │
│ Phone                                                        │
│ Email                                                        │
│ Social Media                                                 │
│                                                              │
│ [ Chat on WhatsApp ]                                         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

No public contact form is required in Version 1.

# 8. Admin Login

Route:

/admin/login

Layout:

┌──────────────────────────────────────────────┐
│                                              │
│              ADMIN LOGIN                     │
│                                              │
│ Email                                        │
│ [________________________________]           │
│                                              │
│ Password                                     │
│ [________________________________]           │
│                                              │
│ [ Sign In ]                                  │
│                                              │
└──────────────────────────────────────────────┘

# 9. Admin Layout

Desktop:

┌──────────────────┬───────────────────────────────────────────┐
│ SIDEBAR          │ TOPBAR                                    │
│                  ├───────────────────────────────────────────┤
│ Dashboard        │                                           │
│ Bookings         │ PAGE CONTENT                              │
│ Packages         │                                           │
│ Portfolio        │                                           │
│                  │                                           │
│ View Website     │                                           │
│                  │                                           │
│ Logout           │                                           │
│                  │                                           │
└──────────────────┴───────────────────────────────────────────┘

Mobile:

┌─────────────────────────────────────┐
│ Admin                       [ ☰ ]   │
├─────────────────────────────────────┤
│                                     │
│ PAGE CONTENT                        │
│                                     │
└─────────────────────────────────────┘

The sidebar becomes a drawer or mobile menu.

# 10. Admin Dashboard

Route:

/admin/dashboard

Layout:

┌──────────────────────────────────────────────────────────────┐
│ Dashboard                                                    │
│ Overview of booking activity                                 │
│                                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│ │ Total       │ │ New         │ │ Confirmed   │              │
│ │ Bookings    │ │ Bookings    │ │ Bookings    │              │
│ │     24      │ │      5      │ │      8      │              │
│ └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                              │
│ ┌─────────────┐                                              │
│ │ Upcoming    │                                              │
│ │      4      │                                              │
│ └─────────────┘                                              │
│                                                              │
│ RECENT BOOKINGS                                              │
│                                                              │
│ Client      Package      Date       Status                   │
│ ---------------------------------------------------------    │
│ Client A    Graduation   ...        NEW                      │
│ Client B    Couple       ...        CONFIRMED                │
│                                                              │
│ [ View All Bookings ]                                        │
└──────────────────────────────────────────────────────────────┘

# 11. Admin Booking List

Route:

/admin/bookings

Layout:

┌──────────────────────────────────────────────────────────────┐
│ Bookings                                                     │
│ Manage photography booking requests                          │
│                                                              │
│ Client      Package       Date       Location     Status      │
│ ----------------------------------------------------------   │
│ Client A    Graduation    ...        Makassar     NEW        │
│ Client B    Couple        ...        Gowa         CONFIRMED  │
│ Client C    Event         ...        Makassar     COMPLETED  │
│                                                              │
│                                              [ View ]        │
└──────────────────────────────────────────────────────────────┘

Version 1 does not require advanced search and filtering.

# 12. Admin Booking Detail

Route:

/admin/bookings/[id]

Layout:

┌──────────────────────────────────────────────────────────────┐
│ ← Back to Bookings                                           │
│                                                              │
│ Booking Detail                                               │
│                                                              │
│ ┌───────────────────────────────┐ ┌────────────────────────┐  │
│ │ CLIENT                        │ │ STATUS                 │  │
│ │                               │ │                        │  │
│ │ Name                          │ │ Current: NEW           │  │
│ │ Phone                         │ │                        │  │
│ │ Email                         │ │ [ Select Status   ▼ ] │  │
│ │                               │ │                        │  │
│ │ [ WhatsApp Client ]           │ │ [ Update Status ]     │  │
│ └───────────────────────────────┘ └────────────────────────┘  │
│                                                              │
│ BOOKING INFORMATION                                          │
│                                                              │
│ Package                                                      │
│ Date                                                         │
│ Time                                                         │
│ Location                                                     │
│ Notes                                                        │
│ Submitted At                                                 │
└──────────────────────────────────────────────────────────────┘

# 13. Admin Package List

Route:

/admin/packages

Layout:

┌──────────────────────────────────────────────────────────────┐
│ Packages                                     [ New Package ] │
│                                                              │
│ Name           Price          Active        Order     Actions│
│ ----------------------------------------------------------   │
│ Graduation     Rp xxx.xxx     Yes           1         Edit   │
│ Couple         Rp xxx.xxx     Yes           2         Edit   │
│ Event          Rp xxx.xxx     No            3         Edit   │
└──────────────────────────────────────────────────────────────┘

Actions may include:

- Edit
- Activate / deactivate
- Delete

# 14. Package Form

Routes:

/admin/packages/new
/admin/packages/[id]/edit

Layout:

┌──────────────────────────────────────────────┐
│ Package                                      │
│                                              │
│ Name                                         │
│ [________________________________]           │
│                                              │
│ Slug                                         │
│ [________________________________]           │
│                                              │
│ Description                                  │
│ [                                    ]       │
│                                              │
│ Price                                        │
│ [________________________________]           │
│                                              │
│ Duration                                     │
│ [________________________________]           │
│                                              │
│ Included Services                            │
│ [                                    ]       │
│                                              │
│ Image                                        │
│ [ Upload ]                                   │
│                                              │
│ Display Order                                │
│ [________________________________]           │
│                                              │
│ [✓] Active                                   │
│                                              │
│ [ Save Package ]                             │
└──────────────────────────────────────────────┘

# 15. Admin Portfolio List

Route:

/admin/portfolio

Layout:

┌──────────────────────────────────────────────────────────────┐
│ Portfolio                               [ New Portfolio ]     │
│                                                              │
│ Image       Title          Published       Order     Actions │
│ ----------------------------------------------------------   │
│ [img]       Graduation     Yes             1         Edit    │
│ [img]       Wedding        Yes             2         Edit    │
│ [img]       Couple         No              3         Edit    │
└──────────────────────────────────────────────────────────────┘

# 16. Portfolio Form

Routes:

/admin/portfolio/new
/admin/portfolio/[id]/edit

Layout:

┌──────────────────────────────────────────────┐
│ Portfolio Item                               │
│                                              │
│ Title                                        │
│ [________________________________]           │
│                                              │
│ Slug                                         │
│ [________________________________]           │
│                                              │
│ Description                                  │
│ [                                    ]       │
│                                              │
│ Image                                        │
│ [ Upload ]                                   │
│                                              │
│ Location                                     │
│ [________________________________]           │
│                                              │
│ Photography Type                             │
│ [________________________________]           │
│                                              │
│ Display Order                                │
│ [________________________________]           │
│                                              │
│ [✓] Published                                │
│                                              │
│ [ Save Portfolio ]                           │
└──────────────────────────────────────────────┘

# 17. Empty States

Example booking empty state:

┌──────────────────────────────────────────┐
│ No bookings yet                          │
│                                          │
│ New booking requests will appear here.   │
└──────────────────────────────────────────┘

Package empty state:

┌──────────────────────────────────────────┐
│ No packages yet                          │
│                                          │
│ [ Create First Package ]                 │
└──────────────────────────────────────────┘

Portfolio empty state:

┌──────────────────────────────────────────┐
│ No portfolio items yet                   │
│                                          │
│ [ Add First Portfolio Item ]             │
└──────────────────────────────────────────┘

# 18. Responsive Principles

## Mobile

- Single-column layout.
- Forms use full width.
- Package cards stack vertically.
- Portfolio grid reduces columns.
- Admin sidebar becomes a mobile drawer.
- Tables may become cards or horizontally scroll when necessary.
- Primary actions remain easy to reach.

## Tablet

- Two-column content where appropriate.
- Portfolio and packages may use two-column grids.

## Desktop

- Wider content container.
- Three-column grids where appropriate.
- Admin sidebar remains visible.
- Booking form may use a two-column layout.

# 19. UI Principles

The final interface should feel:

- Professional
- Modern
- Visual
- Photography-focused
- Clean
- Easy to navigate

Photography content should receive strong visual emphasis.

The interface should avoid excessive decorative elements that compete with portfolio images.

# 20. Version 1 Wireframe Scope

Included:

Public
✓ Home
✓ Portfolio
✓ Packages
✓ Booking
✓ Contact

Admin
✓ Login
✓ Dashboard
✓ Booking List
✓ Booking Detail
✓ Package List
✓ Package Form
✓ Portfolio List
✓ Portfolio Form

Excluded from Version 1:

✗ Payment UI
✗ Calendar management
✗ Client portal
✗ Private gallery
✗ Reports
✗ Testimonials CMS
✗ Team management

These can be designed when their corresponding versions are started.