Redesign the SyncBite Restaurant Portal to look like a mature, established business management application.

The current interface feels too branded, too colourful, too playful, and visually cheap. Remove that direction completely.

The goal is to create software that feels reliable, professional, practical, and long-lasting—similar to well-designed legacy POS, inventory, accounting, or enterprise management software, but with a cleaner modern interface.

This is not a consumer-facing food app.

It is operational software used daily by restaurant and stall owners.

==================================================
CORE DESIGN DIRECTION

Make the application feel:

- Established.
- Trustworthy.
- Functional.
- Quietly professional.
- Familiar.
- Efficient.
- Calm.
- Durable.

Avoid making it look like a trendy SaaS startup.

Avoid excessive branding.

Avoid loud colours.

Avoid playful illustrations.

Avoid oversized typography.

Avoid decorative stickers.

Avoid gradients.

Avoid glassmorphism.

Avoid excessive rounded cards.

Avoid unnecessary animations.

Avoid colourful dashboard widgets.

The design should communicate reliability before personality.

==================================================
BRAND USAGE

Keep SyncBite branding extremely subtle.

Do not place the logo everywhere.

Use the SyncBite logo only in:

- Login screen.
- Sidebar header or top-left application identity.
- Optional small footer.

Do not use large brand slogans, decorative brand patterns, or food-themed graphics.

The portal should feel like professional software powered by SyncBite, not like a marketing website.

Use the brand colour only as an accent:

- Primary buttons.
- Active navigation state.
- Toggles.
- Important links.

Do not use green as the entire background or as a dominant visual colour.

==================================================
VISUAL STYLE

Use a restrained enterprise-style interface.

Colour palette:

- Background: #F5F6F7 or a similar neutral gray.
- Surfaces: White.
- Primary text: Dark charcoal or navy.
- Secondary text: Muted gray.
- Borders: Light gray.
- Primary accent: A controlled SyncBite green.
- Success: Muted green.
- Warning: Muted amber.
- Error: Muted red.

Use mostly neutral colours.

Typography:

- Use a highly readable sans-serif font.
- Prefer Inter, IBM Plex Sans, or a similar professional UI font.
- Avoid oversized display fonts.
- Avoid handwritten fonts.
- Avoid decorative typography.
- Keep headings compact and functional.

==================================================
LAYOUT

Create a conventional application layout.

DESKTOP:

- Fixed narrow left sidebar.
- Simple top header.
- Main content area with comfortable spacing.
- Maximum readable content width.
- Consistent alignment throughout.

MOBILE:

- Compact top bar.
- Simple menu drawer or bottom navigation.
- Single-column layouts.
- No unnecessary visual elements.

The application should look familiar to someone who has used business software before.

==================================================
SIDEBAR

Create a simple vertical navigation sidebar.

Top:
Small SyncBite logo and text:
“Restaurant Portal”

Navigation:

- Home
- Menu
- Orders
- Settings

Bottom:

- Restaurant name.
- Account menu.
- Logout.

Use simple monochrome line icons.

Active navigation should be indicated by:

- A subtle background tint.
- Accent colour on the icon or text.
- A small left border if appropriate.

Do not use large colourful navigation blocks.

==================================================
HOME / DASHBOARD

The dashboard should be extremely restrained.

Do not create a statistics-heavy dashboard.

The purpose of Home is simply to provide operational status and shortcuts.

Top:
Restaurant name.

Main status panel:
“Order Status”

Show:
“Accepting Orders”

With one clear toggle.

Supporting text:
“Students can place orders while your restaurant is open.”

Below that, show only relevant actions.

Use a compact action list:

- Manage Menu
- Add Item
- View Orders

Do not use large cards.

Do not show revenue.

Do not show graphs.

Do not show sales analytics.

Do not show multiple statistics.

If there are pending orders, show one compact alert row:
“3 new orders require attention”

Action:
“View Orders”

If there are no pending actions, keep the dashboard mostly empty.

==================================================
MENU PAGE

This should be the primary workspace.

Create a professional item-management interface inspired by inventory or POS software.

Header:
Menu

Supporting text:
“Manage items, prices, and availability.”

Primary action:
“Add Item”

Use a compact toolbar:

- Search.
- Category filter.
- Optional availability filter.

ITEM LIST

Use a clean table-like list on desktop and stacked rows on mobile.

Columns on desktop:

- Item Name
- Category
- Price
- Availability
- Actions

Rows should be compact and aligned.

Example:

Paneer Roll | Snacks | ₹80 | Available | Edit
Veg Fried Rice | Main Course | ₹100 | Available | Edit
Chicken Roll | Snacks | ₹120 | Unavailable | Edit

On mobile, convert rows into compact vertical list items without requiring horizontal scrolling.

Do not use large food cards.

Do not require images.

Do not display unnecessary metadata.

==================================================
DIRECT ACTIONS

Prioritize direct manipulation.

Availability:

- Toggle directly from the menu list.
- No confirmation dialog.
- Update immediately.

Price:

- Allow inline editing when clicked.
- Save automatically after completion.
- Show a small confirmation message.

Item editing:

- Use a simple side panel on desktop.
- Use a bottom sheet or full-screen form on mobile.

Do not force unnecessary page navigation.

==================================================
ADD ITEM FLOW

Create a fast, professional form.

Required:

- Item Name
- Price

Optional:

- Category
- Description
- Food Type
- Image

Default availability:
ON.

Use one clear primary button:
“Add Item”

After successful submission:

- Close the panel.
- Return to the item list.
- Show a subtle toast:
  “Item added successfully.”

No celebratory animation.

No unnecessary confirmation page.

==================================================
COMBOS

Keep Combos inside the Menu section.

Use a secondary tab:

Items | Combos

Combos should follow the same visual system as items.

Each combo row should contain:

- Combo Name.
- Included Items.
- Price.
- Availability.
- Edit.

Creating a combo should use a simple side panel or bottom sheet.

Required fields:

- Combo Name.
- Select Items.
- Combo Price.

Keep the workflow short.

==================================================
ORDERS

Create a practical order-management screen similar to a lightweight POS system.

Use simple status tabs:

New
Preparing
Ready
Completed

Display orders in a compact list.

Each order should show:

- Order ID.
- Time.
- Number of Items.
- Total.
- Status.

When opening an order:

- Show order details.
- Show item quantities.
- Show total amount.
- Show one primary next action.

Examples:
New → Accept Order
Preparing → Mark Ready
Ready → Mark Completed

Avoid multiple competing buttons.

Use muted status colours.

==================================================
SETTINGS

Create a conventional settings page.

Sections:

- Restaurant Information.
- Operating Hours.
- Account.

Use simple labels, inputs, dividers, and grouped rows.

Do not use decorative cards.

Do not expose technical configuration.

==================================================
COMPONENT DESIGN

Use a consistent enterprise-style component system:

- Compact buttons.
- Subtle borders.
- Small corner radius.
- Simple input fields.
- Standard switches.
- Compact dropdowns.
- Clear tables.
- Consistent spacing.
- Minimal shadows.

Avoid:

- Excessively rounded cards.
- Huge buttons.
- Floating decorative elements.
- Oversized empty-state illustrations.
- Bright gradients.
- Excessive badges.

Buttons should look like business software controls, not marketing CTAs.

==================================================
LOW-END DEVICE PERFORMANCE

This portal must work well on low-end Android devices and older laptops.

Prioritize:

- Minimal CSS complexity.
- Minimal images.
- No video.
- No continuous animation.
- No heavy graphics.
- No unnecessary charts.
- Fast initial rendering.
- Lightweight icons.
- Simple transitions only where useful.

The interface should remain usable on a slow connection.

==================================================
UX PRINCIPLES

The software should be understandable without training.

Rules:

- Use plain language.
- Keep one primary action per context.
- Avoid unnecessary clicks.
- Avoid unnecessary modals.
- Avoid duplicate save and confirm actions.
- Allow direct editing wherever practical.
- Use clear feedback after changes.
- Never hide important actions behind complicated menus.
- Keep the most common tasks immediately accessible.

==================================================
FINAL VISUAL TARGET

Imagine a trusted restaurant management application that has existed for several years and has been refined through real operational use.

It should feel closer to:

- A professional POS system.
- A lightweight inventory management tool.
- A reliable business operations portal.

It should NOT feel like:

- A colourful food delivery app.
- A trendy startup landing page.
- A playful consumer dashboard.
- A marketing website.

The final design should be quiet, mature, functional, and polished.

SyncBite branding should be present, but understated.

The product should earn trust through clarity, consistency, and reliability—not through visual decoration.
