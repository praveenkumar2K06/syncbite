Create a completely new restaurant management portal for SyncBite from scratch.

This portal will be used by individual restaurant and stall owners on campus to manage their food items, combos, prices, availability, and basic orders.

The primary users are small restaurant owners and stall operators. Many of them may use low-end Android phones, older laptops, or slow internet connections. Therefore, the interface must be extremely lightweight, fast, simple, and mobile-friendly.

IMPORTANT DESIGN PRINCIPLE:
Make the portal stupidly simple to use. A restaurant owner should understand what to do without training.

Do not design a complicated enterprise dashboard.
Do not use unnecessary charts, animations, gradients, large illustrations, or decorative graphics.
Keep the graphical load very low.

BRAND AND VISUAL STYLE

Use the existing SyncBite brand identity, but create a more professional and functional visual language than the student-facing application.

Visual direction:

- Clean
- Professional
- Practical
- Minimal
- Mobile-first
- High readability
- Fast-loading
- Low graphical complexity

Use a simple color palette:

- Deep navy for primary navigation and text
- White or very light gray for backgrounds
- Green as the primary action color
- Yellow or orange only for warnings and availability indicators
- Red only for destructive actions or unavailable items

Avoid excessive rounded cards, glassmorphism, gradients, shadows, illustrations, and decorative backgrounds.

Use simple icons and standard UI patterns.

PLATFORM STRUCTURE

Create a responsive dashboard with the following main sections:

1. Dashboard
2. Menu / Items
3. Add Item
4. Combos
5. Orders
6. Restaurant Settings

On mobile, use a bottom navigation bar or a simple hamburger menu.

On desktop, use a narrow left sidebar with clear labels and icons.

Keep navigation limited to the most important actions.

==================================================

1. LOGIN / RESTAURANT ACCESS

Create a simple restaurant login screen.

Include:

- SyncBite logo
- Restaurant name or outlet identifier
- Google login or approved restaurant authentication method
- Clear primary action
- Minimal supporting text

Do not make the login screen visually complex.

================================================== 2. DASHBOARD

Create a simple dashboard that immediately answers:

- Is my restaurant open or closed?
- How many orders are pending?
- How many menu items are currently available?
- What do I need to do next?

Top section:

- Restaurant name
- Current open/closed status
- Large toggle:
  “Accepting Orders” / “Not Accepting Orders”

Summary section:
Use only 3 or 4 lightweight summary blocks:

- Pending Orders
- Today's Orders
- Available Items
- Unavailable Items

Below the summary, show a “Quick Actions” section:

- Add New Item
- Manage Menu
- Create Combo
- View Orders

Add a small “Recent Orders” section with only essential information:

- Order number
- Time
- Number of items
- Status

Do not use complex graphs or analytics.

================================================== 3. MENU / ITEMS MANAGEMENT

This is the most important section.

Create a simple menu management screen where restaurant owners can:

- View all food items
- Add new food items
- Edit item details
- Change prices
- Mark items as available or unavailable
- Delete items
- Search items
- Filter by category

Each item should be displayed in a lightweight list rather than a heavy graphical card.

Each row should include:

- Item name
- Category
- Price
- Availability toggle
- Edit button
- More actions menu

Do not require food images.
Images should be optional, not mandatory.

Example list:

Paneer Roll
₹80
Available

Veg Fried Rice
₹100
Available

Chicken Combo
₹180
Unavailable

Use a simple status indicator:

- Green = Available
- Gray or red = Unavailable

Add a prominent button:
“+ Add Item”

On mobile:

- Use full-width list rows.
- Make edit and availability controls easy to tap.
- Avoid tables that require horizontal scrolling.

================================================== 4. ADD / EDIT ITEM SCREEN

Create a very simple form.

Fields:

- Item Name
- Category
- Description (optional)
- Price
- Discounted Price (optional)
- Food Type: Vegetarian / Non-Vegetarian / Egg
- Available for Ordering: Yes / No
- Image (optional)

Primary button:
“Save Item”

Secondary action:
“Cancel”

Form requirements:

- Use large readable labels.
- Keep one field per row on mobile.
- Show clear validation messages.
- Do not hide important options inside complicated menus.
- Allow restaurant owners to edit prices quickly.
- Preserve entered data if validation fails.

After saving, show a simple confirmation toast:
“Item saved successfully.”

================================================== 5. COMBOS MANAGEMENT

Create a dedicated Combos section.

Restaurant owners should be able to:

- View existing combos
- Create a new combo
- Edit combo details
- Change combo price
- Enable or disable a combo
- Delete a combo

Each combo should include:

- Combo name
- Included items
- Combo price
- Availability status
- Edit action

Example:
“Student Lunch Combo”
Includes:

- Veg Rice
- Dal
- Curd

Price: ₹120

Add a prominent button:
“+ Create Combo”

================================================== 6. CREATE / EDIT COMBO SCREEN

Create a simple form with:

- Combo Name
- Description (optional)
- Select Items
- Combo Price
- Available for Ordering
- Optional Image

Allow owners to select multiple existing menu items using checkboxes or a simple searchable selection list.

Show the selected items clearly.

Primary button:
“Save Combo”

================================================== 7. ORDERS SCREEN

Create a very simple order management screen.

Restaurant owners should be able to see:

- New orders
- Preparing orders
- Ready orders
- Completed orders
- Cancelled orders

Use simple status tabs or filters.

Each order row should show:

- Order ID
- Time
- Customer name or masked identifier
- Number of items
- Total amount
- Current status

When opening an order, show:

- Complete item list
- Quantity
- Total price
- Special instructions, if any
- Order status controls

Primary actions:

- Accept Order
- Mark as Preparing
- Mark as Ready
- Mark as Completed

Use large buttons and clear status colors.

Avoid real-time animations or complicated live dashboards.

================================================== 8. RESTAURANT SETTINGS

Create a simple settings page with:

- Restaurant Name
- Contact Number
- Opening Time
- Closing Time
- Restaurant Open/Closed Status
- Account Information

Include a clear “Save Changes” button.

Do not expose technical settings to restaurant owners.

================================================== 9. MOBILE-FIRST DESIGN

The entire portal must work exceptionally well on mobile devices.

Mobile requirements:

- Minimum tap target: approximately 44px.
- Use large buttons.
- Use readable font sizes.
- Avoid dense tables.
- Avoid horizontal scrolling.
- Keep forms vertically stacked.
- Use sticky bottom navigation where useful.
- Keep important actions visible.
- Make the “Add Item” button easy to find.
- Ensure toggles are simple and obvious.

Desktop requirements:

- Use a compact sidebar.
- Keep content width reasonable.
- Do not stretch everything across a huge screen.
- Maintain the same simple workflow as mobile.

================================================== 10. LOW-END DEVICE AND PERFORMANCE REQUIREMENTS

This is extremely important.

Design for:

- Low-end Android phones
- Older desktop computers
- Slow campus internet
- Small screens
- Limited RAM

Therefore:

- Use minimal images.
- Do not use background videos.
- Do not use heavy animations.
- Avoid large illustrations.
- Avoid unnecessary shadows and gradients.
- Use simple SVG or icon-based graphics.
- Prefer lists over image-heavy cards.
- Keep pages visually lightweight.
- Make loading states simple.
- Use skeleton loaders only where necessary.
- Keep interactions instant and predictable.

================================================== 11. UX RULES

Follow these rules throughout the portal:

- Every screen should have one obvious primary action.
- Use plain language.
- Avoid technical terminology.
- Avoid unnecessary confirmation steps.
- Use confirmation dialogs only for destructive actions such as deleting an item.
- Use inline validation.
- Show success and error messages clearly.
- Never make restaurant owners search through multiple pages to change a price.
- Availability should be changeable directly from the item list.
- Editing an item should take as few clicks as possible.
- Keep the most frequently used actions accessible from the dashboard.

================================================== 12. EMPTY STATES AND MESSAGES

Use simple, helpful messages.

Empty menu:
“Your menu is empty. Add your first item to start accepting orders.”

No combos:
“No combos yet. Create a combo to offer bundled meals.”

No orders:
“No orders yet.”

Success:
“Item saved successfully.”
“Price updated successfully.”
“Combo created successfully.”

Error:
“Something went wrong. Please try again.”

==================================================
FINAL DESIGN DIRECTION

The final result should look like a lightweight restaurant operating system built specifically for small campus food businesses.

It should feel:

- Professional but not corporate
- Simple but not unfinished
- Functional but not boring
- Modern but not graphically heavy
- Easy enough for a first-time restaurant owner to understand immediately

Prioritize usability, speed, clarity, and mobile responsiveness over visual decoration.
