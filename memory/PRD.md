# Macrotides - Product Requirements Document

## Original Problem Statement
Build a legal peptide sale website called Macrotides with nice UI animations and hovers. Sell 10-15 popular peptides with pricing and pictures organized by categories. Include payment checkout with shipping address and email collection. Products are for research purposes only, not human consumption.

## User Choices
- Payment: Stripe
- Products: 10-15 peptides with categories
- Auth: Guest checkout only (no user accounts)
- Notifications: Email confirmation (structure in place)
- Theme: Purple and gold
- Disclaimer: Research purposes only, not for human consumption

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Phosphor Icons
- **Backend**: FastAPI (Python) + MongoDB
- **Payments**: Stripe Checkout (via emergentintegrations library)
- **Styling**: Custom purple/gold luxury theme with Cormorant Garamond + Manrope fonts

## User Personas
1. **Research Scientists**: Need high-purity peptides for lab experiments
2. **Laboratory Managers**: Bulk ordering for research facilities
3. **Academic Researchers**: University studies requiring specific peptides

## Core Requirements (Static)
- [x] Product catalog with categories
- [x] Shopping cart with persistence
- [x] Guest checkout flow
- [x] Stripe payment integration
- [x] Research-only disclaimers
- [x] Responsive design

## What's Been Implemented (January 2026)

### Frontend Components
- ✅ Header with navigation and cart icon
- ✅ Research disclaimer banner (sticky)
- ✅ Hero section with animations
- ✅ Product grid with category filtering
- ✅ Product cards with hover effects and add-to-cart
- ✅ Cart drawer with quantity controls
- ✅ Checkout page with shipping form
- ✅ Success/Cancel pages with status polling
- ✅ About section with features
- ✅ FAQ accordion
- ✅ Footer

### Backend Endpoints
- ✅ GET /api/products - List all peptides
- ✅ GET /api/categories - List categories
- ✅ GET /api/products/{id} - Single product
- ✅ GET /api/products/category/{category} - Filter by category
- ✅ POST /api/checkout/create-session - Stripe checkout
- ✅ GET /api/checkout/status/{session_id} - Payment status
- ✅ POST /api/webhook/stripe - Stripe webhooks
- ✅ GET /api/orders/{order_id} - Order details

### Products Catalog (12 peptides)
1. BPC-157 - Healing & Recovery - $49.99
2. TB-500 - Healing & Recovery - $54.99
3. GHK-Cu - Healing & Recovery - $39.99
4. Ipamorelin - Growth Hormone - $44.99
5. CJC-1295 DAC - Growth Hormone - $64.99
6. Sermorelin - Growth Hormone - $59.99
7. MK-677 - Growth Hormone - $69.99
8. Semax - Cognitive - $49.99
9. Selank - Cognitive - $54.99
10. AOD-9604 - Metabolism - $59.99
11. Tesamorelin - Metabolism - $74.99
12. PT-141 - Research - $44.99

## Prioritized Backlog

### P0 - Critical (Done)
- [x] Core shopping flow
- [x] Stripe payment integration
- [x] Product display with categories

### P1 - High Priority
- [ ] Email order confirmations (Resend integration ready)
- [ ] Admin dashboard for order management
- [ ] Product inventory tracking

### P2 - Medium Priority
- [ ] Order history lookup by email
- [ ] Bulk discount pricing
- [ ] Product reviews/ratings

### P3 - Nice to Have
- [ ] Wishlist functionality
- [ ] Newsletter signup
- [ ] Live chat support

## Next Tasks
1. Configure Resend API for email notifications
2. Set up production Stripe keys for live payments
3. Deploy to Cloudflare Pages (see CLOUDFLARE_DEPLOYMENT.md)
4. Add admin dashboard for order management
5. Implement inventory tracking

## Technical Notes
- Cart persisted to localStorage
- Orders stored in MongoDB with payment status
- Stripe handles all PCI compliance
- Free shipping over $100
