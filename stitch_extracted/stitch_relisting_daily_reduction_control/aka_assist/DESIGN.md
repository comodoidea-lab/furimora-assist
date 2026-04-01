# Design System Document: The Editorial Assistant

## 1. Overview & Creative North Star
This design system moves beyond the utility of a standard marketplace to create **"The Zen Concierge."** We are not building a chaotic discount bazaar; we are crafting a high-end, automated relisting experience that feels like a quiet, efficient gallery. 

The **Creative North Star** is **Soft Precision**. By combining the bold energy of the primary brand red with the airy, disciplined layout of Japanese editorial design, we create a sense of effortless mastery. We break the "template" look through intentional asymmetry—placing labels in unexpected but balanced positions—and by using high-contrast typography scales that make every listing feel like a curated exhibit rather than a database entry.

---

## 2. Colors & Surface Philosophy
We utilize a sophisticated palette that balances urgency with calm.

### The Palette
*   **Primary:** `primary` (#bb0017) — Used for high-intent actions.
*   **Surface Hierarchy:** 
    *   **Base:** `surface` (#f9f9f9)
    *   **Main Container:** `surface_container_lowest` (#ffffff) for "Crisp White Cards."
    *   **Subtle Recess:** `surface_container` (#eeeeee) for nested details.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or card definition. Boundaries must be defined solely through background color shifts. A card (`surface_container_lowest`) sitting on a background (`surface`) provides all the definition required. If a section needs to feel "tucked in," use `surface_container_low`.

### The "Glass & Gradient" Rule
To elevate the tool from "utility" to "premium," floating navigation bars or modal headers must use **Glassmorphism**. Apply `surface_container_lowest` at 80% opacity with a `backdrop-filter: blur(20px)`. 

For Primary CTAs, do not use a flat fill. Use a subtle **Signature Gradient**:
*   `from: primary (#bb0017)` to `to: primary_container (#ea0020)` at a 135-degree angle. This adds "soul" and depth to the brand's signature red.

---

## 3. Typography
The typography is the backbone of the "Japanese Marketplace" aesthetic. It must feel authoritative yet breathable.

*   **Display & Headlines:** We use **Plus Jakarta Sans**. Its geometric clarity provides a modern, global feel that complements Japanese characters perfectly.
    *   `display-lg`: 3.5rem — Use for "hero" stats (e.g., total items relisted).
    *   `headline-sm`: 1.5rem — Use for listing titles to give them an editorial weight.
*   **Body & Labels:** We use **Inter** for Latin characters and **Noto Sans JP** for Japanese.
    *   `body-md`: 0.875rem — The workhorse for item descriptions.
    *   `label-sm`: 0.6875rem — Used for metadata like "Relisted 2h ago," set in `on_surface_variant` to reduce visual noise.

**Intentional Asymmetry:** Align headline text to the left while floating status badges to the far right within cards to create a dynamic, modern eye-path.

---

## 4. Elevation & Depth
We eschew the "Shadow-Heavy" look of 2010s apps in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." 
    *   Level 0: `surface` (The Floor)
    *   Level 1: `surface_container_low` (Section backgrounds)
    *   Level 2: `surface_container_lowest` (Interactive cards)
*   **Ambient Shadows:** If a card must "float" (like a Draggable Listing), use a tinted shadow: `shadow-color: rgba(187, 0, 23, 0.06)` with a 32px blur. This makes the shadow feel like a natural reflection of the brand red rather than a "dirty" grey.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` (#eabcb7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `full` (9999px). Gradient fill (Primary to Primary Container). White text.
*   **Secondary:** Rounded `full`. Surface `surface_container_high` with `on_surface` text. No border.
*   **State:** On hover, primary buttons should scale to 102% rather than just changing color.

### Status Badges (The "Marketplace Signage")
*   **'出品中' (Active):** `tertiary_container` background with `on_tertiary_container` text.
*   **'売却済み' (Sold):** `surface_dim` background with `on_surface_variant` text.
*   **Shape:** Use `sm` (0.5rem) roundedness to contrast with the `full` roundedness of buttons.

### Listing Cards
*   **Rules:** No dividers. Use `spacing-6` (1.5rem) of vertical white space to separate the item title from the price.
*   **Image Handling:** Photos must have `md` (1.5rem) corner radius. Use a `surface_container` placeholder to ensure no "blank" flashes during loading.

### Automated "Pulse" Indicator
A unique component for this tool. A small, breathing dot using `primary` with a 4px blur, placed next to "Relisting in progress" to signal the "Assistant" is working.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use white space as a structural element. If a screen feels crowded, increase the `spacing-10` between sections.
*   **Do** use `plusJakartaSans` for numbers. Price points should look high-end and sharp.
*   **Do** treat the Japanese text with "Kinbaku" (tightness)—reduce letter-spacing for headers to make them feel impactful.

### Don't:
*   **Don't** use black (#000000). Use `on_surface` (#1a1c1c) for all primary text to keep the "Soft" aesthetic.
*   **Don't** use standard Material Design "Drop Shadows." They are too heavy for the Japanese marketplace aesthetic.
*   **Don't** use 1px dividers to separate list items. Use a `surface_container_low` background on the parent and `surface_container_lowest` on the items with a `spacing-2` gap.

---

## 7. Spacing & Rhythm
All layouts must adhere to a strict **4px/8px grid**, but components should be placed with **Editorial Tension**. Use `spacing-16` (4rem) for top-level page margins to give the content "room to breathe," ensuring the user feels in control, not overwhelmed by data.