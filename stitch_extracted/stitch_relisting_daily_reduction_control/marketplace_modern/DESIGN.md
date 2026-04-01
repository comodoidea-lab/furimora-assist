# Design System Document

## 1. Overview & Creative North Star: "The Curated Marketplace"
This design system moves beyond the utility of standard e-commerce to create a **"Curated Marketplace"** experience. While inspired by the efficiency of Japanese digital standards, the aesthetic philosophy is rooted in **Soft Minimalism** and **Editorial Precision**. 

The "North Star" is to make every item—whether a high-end camera or a vintage tee—feel like a featured gallery piece. We break the "template" look by utilizing intentional asymmetry in product grids, overlapping typographic elements, and a radical departure from traditional "boxed" layouts. By leveraging high-contrast typography scales against vast "Light Gray" breathing room, the UI feels authoritative yet approachable.

---

## 2. Colors & Surface Architecture
The palette is anchored by the iconic Mercari Red, but elevated through a sophisticated layering of neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. 
*   **The Alternative:** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (#f3f4f5) product gallery should sit directly on a `surface` (#f8f9fa) background. The shift in tone creates a clean, sophisticated break that feels "grown-up" compared to rigid outlines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine Washi paper.
*   **Base:** `surface` (#f8f9fa) – The foundation of the page.
*   **Secondary Sections:** `surface-container-low` (#f3f4f5) – Use for sidebar backgrounds.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) – The highest "pop" of white, reserved for product cards and primary content blocks.

### The "Glass & Signature" Rule
To move beyond a "generic" feel, use **Glassmorphism** for floating navigation elements and modals.
*   **Token:** `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
*   **Gradients:** Use a subtle linear gradient on primary CTAs: `primary` (#be0321) to `primary_container` (#e32b36). This adds "visual soul" and depth, preventing the red from feeling flat or aggressive.

---

## 3. Typography: Editorial Authority
We utilize **Noto Sans JP** for its universal readability, but we pair it with **Plus Jakarta Sans** for display moments to inject a modern, high-end editorial energy.

*   **Display & Headlines (Plus Jakarta Sans):** These are the "voice" of the brand. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. The scale difference between a `display-lg` headline and `body-md` text creates the "Signature" look.
*   **Body & Labels (Noto Sans JP / Inter):** `body-md` (0.875rem) is the workhorse. It provides the "Trustworthy" feel essential to Japanese e-commerce. 
*   **The Typographic Hierarchy:** By keeping labels small (`label-sm`: 0.6875rem) and headlines bold and expansive, we guide the user's eye through a narrative rather than a list of data.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely discarded in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f4f5) section. This creates a soft, natural lift without a single pixel of shadow.
*   **Ambient Shadows:** If an element must "float" (e.g., a hover state or a floating action button), use an extra-diffused shadow: `Y: 8px, Blur: 24px, Color: #191c1d at 4% opacity`. The shadow must feel like ambient light, not a "drop shadow" effect.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#e5bdba) at **15% opacity**. 100% opaque borders are strictly forbidden as they interrupt the visual flow.

---

## 5. Components & Primitive Styling

### Sidebar Navigation (Desktop Efficiency)
*   **Layout:** Fixed width, utilizing `surface-container-low` (#f3f4f5). 
*   **Active State:** Use a "pill" shape (`rounded-full`) in `primary_fixed` (#ffdad7) with `on_primary_fixed_variant` (#930016) text. No vertical lines or arrows; indicate selection through soft color blocks.

### Primary Buttons
*   **Style:** `primary` (#be0321) background, `on_primary` (#ffffff) text.
*   **Rounding:** `lg` (1rem / 16px) for a modern, friendly feel.
*   **State:** On hover, transition to the signature gradient (Primary to Primary-Container).

### Product Cards & Lists
*   **Constraint:** Forbid the use of divider lines. 
*   **Execution:** Use `spacing-6` (2rem) of white space between list items. For cards, use `surface-container-lowest` (#ffffff) with a `md` (12px) corner radius. 
*   **Hover:** Instead of a shadow, the card should slightly shift in color to `surface_bright` or gain a 2px `surface_tint` internal glow.

### Input Fields
*   **Style:** Minimalist. `surface_container_highest` (#e1e3e4) background with a "bottom-only" focus state in `primary`. 
*   **Typography:** Labels must be `label-md` and always visible (no disappearing placeholders).

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical spacing. Allow more white space on the left of a container than the right to create a "pushed" editorial feel.
*   **Do** overlap elements. Allow a product image to slightly bleed out of its card container or overlap a headline.
*   **Do** use the `tertiary` (#006779) color for "Trust" elements like verified badges or shipping guarantees to provide a calm counterpoint to the energetic Red.

### Don't
*   **Don't** use 1px solid borders to separate content. It creates "visual noise" and cheapens the premium feel.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1d) or Slate 900 to maintain tonal warmth.
*   **Don't** cram information. If a section feels crowded, increase the `spacing-10` (3.5rem) or `spacing-12` (4rem) gaps. Space is a luxury brand asset.