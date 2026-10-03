Redesign the SyncBite Restaurant Portal with an extreme focus on FUNCTIONALITY, SPEED, and SIMPLICITY.

The previous UI is still too much like a traditional admin dashboard. Remove unnecessary visual elements, unnecessary buttons, unnecessary pages, and unnecessary clicks.

This is a restaurant shop-management tool for small campus stall owners. Many users will use low-end Android phones, older laptops, and slow internet.

The product must feel fast enough that a restaurant owner can open it, change a price, mark an item unavailable, or add a new item within seconds.

==================================================
PRIMARY PRODUCT PRINCIPLE

Every common task should require the fewest possible interactions.

The restaurant owner should be able to:

- Mark the shop open or closed in one tap.
- Mark an item unavailable in one tap.
- Change an item price in one direct action.
- Add a new item quickly.
- Edit an existing item without navigating through multiple screens.
- View new orders immediately.

Do not make users open multiple pages for simple actions.

Avoid unnecessary confirmation screens.

Avoid unnecessary modals.

Avoid excessive dropdowns.

Avoid nested menus.

Avoid “Save” buttons for every tiny change when inline auto-save is practical.

==================================================
CORE NAVIGATION

Keep only four primary navigation items:

1. Home
2. Menu
3. Orders
4. Settings

Combos should be managed inside the Menu section instead of having a separate primary navigation item.

Do not create a separate Analytics section.

Do not create a separate Notifications section.

Do not create unnecessary admin features.

Use a narrow sidebar on desktop and a simple bottom navigation or hamburger menu on mobile.

==================================================
DASHBOARD / HOME

Make Home extremely minimal.

The restaurant owner should see only what matters right now.

TOP AREA:

- Restaurant name.
- One large shop status toggle:
  “Accepting Orders”
  or
  “Not Accepting Orders”

This toggle should be the most prominent control on the page.

If the shop is closed, show a short explanation:
“Students cannot place new orders while your shop is closed.”

If the shop is open:
“Your shop is currently accepting orders.”

NEW ORDERS ALERT:
Only show this section when action is required.

Example:
“3 new orders need attention”

Button:
“View Orders”

Do not show analytics cards, revenue metrics, charts, percentages, sales graphs, or unnecessary statistics.

QUICK ACTIONS:
Use only three compact actions:

- Add Item
- Manage Menu
- View Orders

Do not create large colourful cards.

If there are no pending actions, leave the page visually empty and calm.

==================================================
MENU AS THE PRIMARY WORKSPACE

The Menu page should be the most functional page in the entire portal.

The owner should manage items directly from this screen.

TOP:
Title:
“Menu”

A single prominent button:
“+ Add Item”

Below it, add a simple search field.

Use category filters only if necessary.

ITEM LIST:
Display items as compact, clean rows.

Each row should include only:

- Item name.
- Price.
- Availability toggle.
- Edit action.

Example:

Paneer Roll
₹80
[Available toggle] [Edit]

Veg Fried Rice
₹100
[Available toggle] [Edit]

Chicken Roll
₹120
[Unavailable toggle] [Edit]

Do not display images by default.

Do not display long descriptions.

Do not display unnecessary metadata.

Do not use large cards.

Do not require opening a separate item page just to change availability.

==================================================
INLINE EDITING

Make common changes possible directly from the item list.

PRICE EDITING:
When the owner taps the price, allow direct inline editing.

Example:

₹80 → input field → Done

Use automatic save after the price is updated.

Show a small success toast:
“Price updated.”

AVAILABILITY:
The toggle should immediately update the item's availability.

No confirmation modal.

No separate save button.

Show a small status toast:
“Item marked unavailable.”

EDIT:
Only use the Edit action for less frequent changes such as:

- Name.
- Category.
- Description.
- Food type.
- Image.
- Combo configuration.

==================================================
ADD ITEM FLOW

Make adding an item extremely fast.

When the owner taps “+ Add Item”, open a lightweight side panel on desktop or bottom sheet on mobile.

Do not navigate to a complicated full-page form.

Required fields:

- Item Name
- Price

Optional fields:

- Category
- Description
- Food Type
- Image

Availability should default to ON.

The primary action should be:

“Add Item”

The form should have only one primary button.

After adding:

- Close the panel automatically.
- Return the owner to the menu list.
- Place the new item at the top or in its category.
- Show:
  “Item added successfully.”

The entire flow should take less than 10 seconds for a normal item.

==================================================
COMBO MANAGEMENT

Do not create a separate complex combo builder.

Inside the Menu page, add a simple secondary tab:

Items | Combos

The Combos tab should use the same lightweight list design.

Each combo row:

- Combo name.
- Price.
- Availability toggle.
- Edit action.

Creating a combo should use a lightweight panel.

Required fields:

- Combo Name
- Select Items
- Combo Price

Use checkboxes or a searchable item selector.

Do not force users through multiple steps.

==================================================
ORDERS

Orders should be designed for speed and clarity.

Use four simple status tabs:

New
Preparing
Ready
Completed

Show orders in a compact list.

Each order row should contain:

- Order ID.
- Time.
- Number of items.
- Total.
- Status.

When an order is opened, show the order details and one obvious next action.

Examples:

New order:
“Accept Order”

Preparing:
“Mark Ready”

Ready:
“Mark Completed”

Do not show multiple competing action buttons.

The next action should always be visually dominant.

==================================================
SETTINGS

Keep Settings minimal.

Only include:

- Restaurant Name.
- Contact Information.
- Opening Time.
- Closing Time.
- Account / Logout.

Do not include technical settings.

==================================================
BUTTON REDUCTION RULE

Use the fewest buttons possible.

Follow these rules:

- One primary action per screen.
- Use inline controls instead of navigation where practical.
- Use toggles for availability.
- Use direct editing for prices.
- Use automatic saving for simple changes.
- Use a single “Add Item” button.
- Avoid duplicate actions such as “Save”, “Apply”, and “Confirm” for the same task.
- Avoid unnecessary “Back” buttons when a panel can simply close.
- Avoid multiple floating action buttons.
- Avoid decorative buttons that do not perform a useful action.

Every button must have a clear purpose.

==================================================
VISUAL UI DIRECTION

Make the UI look more functional than decorative.

Use:

- White background.
- Soft gray dividers.
- Deep navy typography.
- SyncBite green for primary actions and active states.
- Minimal status colors.
- Compact spacing.
- Clear typography hierarchy.
- Small, consistent corner radii.
- Simple line icons.

Avoid:

- Large cards.
- Excessive rounded containers.
- Gradients.
- Glassmorphism.
- Heavy shadows.
- Illustrations.
- Large food images.
- Excessive badges.
- Complex dashboard widgets.
- Decorative animations.

The interface should look clean even on a low-resolution screen.

==================================================
MOBILE-FIRST FUNCTIONALITY

Design specifically for low-end Android devices.

On mobile:

- Use a single-column layout.
- Keep primary actions reachable with one hand.
- Use large touch targets.
- Avoid horizontal scrolling.
- Use bottom sheets instead of large modals.
- Keep the keyboard-friendly form experience.
- Use sticky action buttons only when necessary.
- Do not overload the screen.

The Menu page should work comfortably on a 360px-wide phone.

==================================================
PERFORMANCE REQUIREMENTS

Prioritize perceived speed.

- No unnecessary animations.
- No background video.
- No heavy images.
- No continuous decorative motion.
- No complex charts.
- No unnecessary loading screens.
- Use lightweight skeleton loaders only when required.
- Load the essential interface first.
- Keep interactions immediate.
- Use optimistic UI updates where safe.
- Keep network-dependent actions minimal.
- Show clear loading or saving feedback only when necessary.

==================================================
UX SUCCESS CRITERIA

The final prototype should satisfy these goals:

- A new restaurant owner understands the dashboard within 30 seconds.
- Marking an item unavailable takes one tap.
- Changing a price takes one direct edit.
- Adding a basic item takes less than 10 seconds.
- Opening a new order and moving it to the next status is obvious.
- The owner never feels lost inside the portal.
- There are no unnecessary dashboards, charts, cards, or settings.
- The interface feels fast, calm, practical, and trustworthy.

FINAL DIRECTION:

Build a lightweight restaurant operating tool, not an analytics dashboard.

The product should feel like a simple control panel where a shop owner can quickly manage food availability, prices, items, combos, and orders.

Prioritize:

1. Speed.
2. Fewer clicks.
3. Direct manipulation.
4. Clear actions.
5. Low graphical load.
6. Mobile usability.

Do not add extra features or visual complexity beyond what is necessary for daily restaurant operations.
