Redesign the SyncBite Restaurant Portal UI from scratch.

The previous version feels too much like a traditional admin dashboard: too many statistics, too much information, too many cards, and not enough visual personality.

Create a cleaner, calmer, more modern interface that restaurant and stall owners can use comfortably on low-end Android phones and older laptops.

The dashboard should not feel like an analytics product.

It should feel like a simple daily workspace for managing a restaurant menu.

==================================================
CORE DESIGN PRINCIPLE

The restaurant owner should open the dashboard and immediately understand:

1. Is my shop accepting orders?
2. Do I need to do anything important?
3. Where can I manage my menu?

That is enough.

Do not fill the dashboard with analytics, charts, revenue metrics, order graphs, percentages, or unnecessary statistics.

The primary purpose of this portal is menu management.

Prioritize clarity and ease of use over information density.

==================================================
VISUAL DIRECTION

Create a professional but friendly UI.

The design should feel inspired by modern Indian SaaS products and lightweight business tools, but retain a subtle SyncBite personality.

Use:

- Clean white and warm off-white backgrounds.
- Deep navy text.
- SyncBite green for primary actions.
- Very limited use of yellow, orange, or red for status messages.
- Simple borders instead of heavy shadows.
- Small or medium corner radii.
- Clear typography.
- Generous spacing.
- Simple icons.

Avoid:

- Giant dashboard cards.
- Excessive rounded containers.
- Glassmorphism.
- Gradients.
- Decorative illustrations.
- Large food photography.
- Complex charts.
- Excessive badges.
- Dense tables.
- Too many colors.
- Heavy animations.

The interface should look lightweight even before it loads.

==================================================
LAYOUT SYSTEM

Use a consistent application shell.

DESKTOP:

- Narrow left sidebar.
- Main content area with a maximum readable width.
- Top bar with restaurant name and profile/settings access.

MOBILE:

- Simple top bar.
- Hamburger menu or bottom navigation.
- Full-width content.
- Sticky primary action where appropriate.

The navigation should contain only:

- Home
- Menu
- Combos
- Orders
- Settings

Do not create unnecessary sections.

==================================================
DASHBOARD REDESIGN

Make the dashboard intentionally minimal.

Do not display a grid of statistics.

Instead, create the following layout:

TOP BAR:

- Restaurant name.
- Small “Open” or “Closed” status.
- Profile/settings icon.

WELCOME AREA:
Display:

“Good morning, [Restaurant Name]”

Small supporting text:

“Manage your menu and keep your shop ready for orders.”

SHOP STATUS SECTION:
Create one clean, prominent section:

“Accepting Orders”

A large toggle or switch.

Supporting text:

“Students can place orders when your shop is open.”

Use green when active and neutral gray when inactive.

QUICK ACTIONS:
Show only three simple actions as compact buttons or list items:

- Add Item
- Manage Menu
- Create Combo

Do not use large colourful cards.

RECENT ACTIVITY:
Only show this section if there are relevant recent actions.

Examples:

- “Paneer Roll price updated.”
- “Student Lunch Combo created.”
- “Veg Fried Rice marked unavailable.”

If there is nothing important to show, hide the section entirely.

OPTIONAL ORDER ALERT:
If new orders exist, show one simple notification banner:

“You have 3 new orders waiting.”

Button:
“View Orders”

Do not show order counts, revenue summaries, or charts by default.

==================================================
MENU PAGE

Make the Menu page the strongest and most polished part of the product.

The owner should be able to manage everything from one screen.

TOP:
Title:
“Your Menu”

Supporting text:
“Add, edit, and manage the items students can order.”

Primary button:
“+ Add Item”

SEARCH AND FILTER:
Use a simple search field.

Add a lightweight category filter.

ITEM LIST:
Use a clean vertical list.

Each item row should contain:

- Item name.
- Category or small description.
- Price.
- Availability toggle.
- Edit icon or button.

Example:

Paneer Roll
Snacks · ₹80
Available

Veg Fried Rice
Main Course · ₹100
Available

Chicken Combo
Combo · ₹180
Unavailable

Do not use large cards with images.

Do not use unnecessary item metadata.

The availability toggle should be directly accessible without opening the item.

On mobile:

- Each row should fit naturally within the screen.
- Keep edit and toggle controls easy to tap.
- Avoid horizontal scrolling.
- Use a bottom sheet or simple page for editing.

==================================================
ADD ITEM / EDIT ITEM UI

Make the form feel simple and approachable.

Use a single-column form with clear labels.

Fields:

Item Name
Category
Price
Description (Optional)
Food Type
Available for Ordering

Optional:
Image Upload

Do not make images mandatory.

Use clear input fields with subtle borders.

Use a sticky bottom action area on mobile:

Cancel
Save Item

The Save Item button should be visually dominant.

Avoid multi-step forms.

Avoid complicated dropdowns where a simple selection is enough.

==================================================
COMBOS PAGE

Keep Combos visually consistent with Menu.

Title:
“Combos”

Supporting text:
“Create meal combinations using your existing items.”

Primary button:
“+ Create Combo”

Display combos as simple list rows.

Each row:

- Combo name.
- Included item count.
- Price.
- Availability.
- Edit action.

Example:

Student Lunch Combo
3 items · ₹120
Available

Do not create complex bundle builders.

When creating a combo, use a simple searchable list with checkboxes for selecting existing menu items.

==================================================
ORDERS PAGE

Keep this page functional and uncluttered.

Use simple status tabs:

New
Preparing
Ready
Completed

Show orders as lightweight list rows.

Each row:

- Order ID.
- Time.
- Number of items.
- Total.
- Status.

Do not show graphs or analytics.

When an order is opened, display the details clearly with large status action buttons.

==================================================
SETTINGS PAGE

Keep settings minimal.

Sections:

Restaurant Information

- Restaurant Name
- Contact Number

Operating Hours

- Opening Time
- Closing Time

Account

- Profile
- Logout

Use simple grouped rows instead of large cards.

==================================================
MICRO-INTERACTIONS

Keep interactions subtle and professional.

Use:

- Small hover states.
- Smooth button transitions.
- Clear toggle animations.
- Lightweight success toasts.
- Simple loading indicators.

Avoid playful jokes inside the restaurant portal.

This portal is for daily business operations, so it should feel reliable and calm.

==================================================
LOW-END DEVICE PERFORMANCE

Design specifically for:

- Low-end Android devices.
- Older laptops.
- Slow internet connections.
- Limited RAM.
- Small screens.

Therefore:

- Avoid heavy images.
- Avoid animations that run continuously.
- Avoid video or parallax.
- Avoid complex charts.
- Avoid large background assets.
- Use simple icons.
- Prefer CSS shapes and borders.
- Keep lists lightweight.
- Use fast-loading layouts.
- Avoid unnecessary modal windows.
- Keep interactions responsive.

==================================================
IMPORTANT UI IMPROVEMENT

Do not make every section look like a card.

Use a combination of:

- Plain page sections.
- Dividers.
- Compact list rows.
- Buttons.
- Input fields.
- Status indicators.

Cards should only be used when they genuinely improve grouping or usability.

The dashboard should have plenty of empty space.

The visual hierarchy should come from typography, spacing, and alignment rather than boxes and colours.

==================================================
FINAL EXPERIENCE

The final portal should feel like:

“A simple shop management app that anyone can understand in 30 seconds.”

It should not feel like:

- An enterprise ERP.
- A financial analytics dashboard.
- A complicated restaurant POS.
- A colourful consumer food delivery app.

It should feel:

- Professional.
- Calm.
- Lightweight.
- Modern.
- Trustworthy.
- Extremely easy to use.

Focus on improving the actual UI quality, spacing, typography, navigation, and interaction design rather than adding more features or more information.
