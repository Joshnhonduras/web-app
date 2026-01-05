# Design System - Growth Hub Professional UI

## Color Palette

### Primary Colors (Indigo - Trust & Professional)
```css
--primary-50:   #f0f4ff   /* lightest background */
--primary-100:  #e0e9fe   /* light backgrounds */
--primary-200:  #c7d2fe   /* accent backgrounds */
--primary-400:  #818cf8   /* hover states */
--primary-500:  #6366f1   /* standard primary */
--primary-600:  #4f46e5   /* darker primary (buttons) */
--primary-700:  #4338ca   /* darkest primary */
--primary-900:  #1e1b4b   /* text color */
```

**Usage**: Main buttons, headers, active states, primary actions

### Accent Colors (Cyan - Modern & Fresh)
```css
--accent-500:  #06b6d4   /* standard accent */
--accent-600:  #0891b2   /* darker accent */
```

**Usage**: Secondary actions, links, accents

### Semantic Colors
```css
--success-500:  #10b981   /* Green - success states, confirmations */
--warning-500:  #f59e0b   /* Amber - warnings, coming soon */
--danger-500:   #ef4444   /* Red - errors, destructive actions */
```

### Neutral/Gray Scale (Slate - Professional)
```css
--slate-50:    #f8fafc   /* backgrounds (lightest) */
--slate-100:   #f1f5f9   /* card backgrounds */
--slate-200:   #e2e8f0   /* borders, dividers */
--slate-300:   #cbd5e1   /* subtle dividers */
--slate-400:   #94a3b8   /* secondary text */
--slate-500:   #64748b   /* standard text */
--slate-600:   #475569   /* stronger text */
--slate-700:   #334155   /* dark text */
--slate-800:   #1e293b   /* very dark text */
--slate-900:   #0f172a   /* text on dark backgrounds */
```

**Usage**: Text, borders, backgrounds, secondary elements

## Typography

### Font Family
```css
-apple-system,           /* macOS/iOS */
BlinkMacSystemFont,      /* Safari */
'Inter',                 /* Custom: modern, clean */
'Segoe UI',             /* Windows */
'Roboto',               /* Android */
sans-serif              /* fallback */
```

**Why**: Industry standard, great readability, modern aesthetic

### Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 500 | Medium | Secondary text, helper copy |
| 600 | Semibold | Form labels, tab text |
| 700 | Bold | Headers, button text |
| 800 | Extra-Bold | Page titles, gradients |

### Size Scale

| Size | Usage | Line-height |
|------|-------|-------------|
| 0.75rem (12px) | Small labels, badges | 1.0 |
| 0.8rem (13px) | Status, helper text | 1.2 |
| 0.85rem (14px) | Small UI text | 1.4 |
| 0.9rem (14px) | Secondary text | 1.5 |
| 0.95rem (15px) | Body text | 1.6 |
| 1rem (16px) | Default body | 1.6 |
| 1.1rem (18px) | Subheading | 1.6 |
| 1.25rem (20px) | Small heading | 1.5 |
| 1.3rem (21px) | Chat title | 1.5 |
| 1.4rem (22px) | Small section title | 1.5 |
| 1.5rem (24px) | Section heading | 1.4 |
| 1.75rem (28px) | Large heading | 1.3 |
| 2.5rem (40px) | Page subtitle | 1.2 |
| 3.5rem (56px) | Page title | 1.1 |

## Spacing System

Based on 4px grid (rem = 16px):

| Unit | Value | Usage |
|------|-------|-------|
| xs | 0.25rem (4px) | Micro gaps |
| sm | 0.5rem (8px) | Tight spacing |
| md | 1rem (16px) | Standard padding |
| lg | 1.5rem (24px) | Container padding |
| xl | 2rem (32px) | Sections |
| 2xl | 3rem (48px) | Major sections |
| 3xl | 4rem (64px) | Page sections |
| 4xl | 5rem (80px) | Hero padding |

## Border Radius

| Radius | Usage |
|--------|-------|
| 6px | Small components (badges, status) |
| 8px | Standard buttons, tags |
| 12px | Form inputs, cards, modals |
| 16px | Large cards, hero sections |
| 50% | Circles (avatars, status dots) |

## Shadows

### Elevation System

```css
/* Level 0: Subtle */
0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);

/* Level 1: Small cards, inputs */
0 2px 8px rgba(0, 0, 0, 0.08);

/* Level 2: Cards, buttons */
0 4px 12px rgba(0, 0, 0, 0.1);

/* Level 3: Floating elements */
0 6px 16px rgba(0, 0, 0, 0.12);

/* Level 4: Large modals */
0 20px 40px rgba(0, 0, 0, 0.15);

/* Level 5: Overlays */
0 20px 60px rgba(0, 0, 0, 0.2);
```

### Color-Specific Shadows

```css
/* Primary (Indigo) shadows */
0 4px 12px rgba(79, 70, 229, 0.25);  /* hover */
0 6px 16px rgba(79, 70, 229, 0.3);   /* active */

/* Accent (Cyan) shadows */
0 4px 12px rgba(6, 182, 212, 0.25);

/* Danger (Red) shadows */
0 4px 12px rgba(239, 68, 68, 0.25);
```

## Animation Timing

### Easing Functions

```css
/* Standard ease - most UI elements */
cubic-bezier(0.23, 1, 0.320, 1)

/* Linear - continuous motion */
linear

/* Ease out - elements settling */
ease-out

/* Ease in - starting motion */
ease-in
```

### Duration by Type

| Duration | Usage |
|----------|-------|
| 0.2s | Button hover, quick feedback |
| 0.3s | Card hover, entrance/exit |
| 0.5s | Medium animations |
| 0.8s | Longer entrance animations |
| 1.4s | Continuous (loading, loops) |

## Button Styles

### Primary Button
```css
background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%);
color: white;
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
padding: 1rem 2rem;
border-radius: 12px;
font-weight: 600;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

&:active {
  transform: translateY(0);
}
```

### Secondary Button
```css
background: var(--slate-100);
color: var(--slate-900);
border: 1px solid var(--slate-200);
padding: 1rem 2rem;
border-radius: 12px;
font-weight: 600;

&:hover {
  background: var(--slate-200);
  border-color: var(--slate-400);
}
```

### Danger Button
```css
background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
color: white;
box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
padding: 1rem 2rem;
border-radius: 12px;
font-weight: 600;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}
```

## Form Elements

### Input/Textarea
```css
padding: 0.875rem 1rem;
border: 1px solid var(--slate-200);
border-radius: 12px;
background: var(--slate-100);
color: var(--slate-900);
font-size: 1rem;
font-family: inherit;
transition: all 0.2s ease;

&:focus {
  outline: none;
  border-color: var(--primary-500);
  background: var(--slate-50);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### Range Sliders
```css
width: 100%;
height: 6px;
background: var(--slate-200);
border-radius: 3px;

&::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%);
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  
  &:hover {
    transform: scale(1.2);
  }
}
```

## Component Spacing

### Message Bubbles
```css
padding: 1rem 1.25rem;      /* inside padding */
margin-bottom: 1.25rem;     /* gap between */
max-width: 80%;             /* width constraint */
line-height: 1.6;           /* text spacing */
```

### Cards/Containers
```css
padding: 1.5rem to 2rem;    /* variable based on context */
border-radius: 12-16px;     /* rounded corners */
border: 1px solid var(--slate-200);
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

&:hover {
  border-color: var(--primary-400);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.08);
}
```

## Responsive Breakpoints

```css
/* Mobile first approach */
/* No media query = mobile (default) */

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large desktop */
@media (min-width: 1280px) { ... }
```

## Dark Mode

Automatically applied via:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--slate-900);
    --bg-secondary: var(--slate-800);
    --text-primary: var(--slate-50);
    --text-secondary: var(--slate-300);
    /* ... rest of variables */
  }
}
```

## Accessibility

### Color Contrast

| Combination | Ratio | Level |
|-------------|-------|-------|
| Primary on White | 7.1:1 | AAA |
| Primary on Gray | 5.5:1 | AA |
| Text on Background | 7.5:1+ | AAA |

### Focus States

All interactive elements have:
```css
&:focus {
  outline: 3px solid var(--primary-600);
  outline-offset: 2px;
  /* OR */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

## Usage Examples

### Primary Action (Save, Submit)
- Background: Primary gradient
- Text: White
- Shadow: Color-specific
- Hover: Lift + stronger shadow

### Secondary Action (Cancel, Back)
- Background: Slate-100
- Text: Slate-900
- Border: 1px Slate-200
- Hover: Darker slate

### Destructive Action (Delete, Reset)
- Background: Red gradient
- Text: White
- Shadow: Red-tinted
- Hover: Lift + stronger red shadow

### Hover States
- Lift: `transform: translateY(-2px)`
- Shadow: Increase depth level
- Color: Slightly brighter/darker

## Implementation Notes

1. **All values use CSS custom properties** - Easy to modify globally
2. **Semantic naming** - Variables describe purpose, not value
3. **Gradient consistency** - 135deg diagonal for all gradients
4. **Animation smoothness** - All use cubic-bezier easing
5. **No hard-coded colors** - Everything references variables
6. **Dark mode support** - Automatically handled by media query

This system ensures consistency, maintainability, and a premium user experience across the entire application.
