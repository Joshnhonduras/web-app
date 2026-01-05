# Quick Reference - Professional UI Styling

## Color Palette Quick Access

### Primary (Use for main actions, headers)
```
Primary-600: #4f46e5 (Buttons, Headers)
Primary-500: #6366f1 (Light hover states)
Primary-400: #818cf8 (Lightest states)
```

### Semantic (Use for feedback)
```
Success:  #10b981 (Green - confirmations)
Warning:  #f59e0b (Amber - alerts)
Danger:   #ef4444 (Red - errors)
Accent:   #06b6d4 (Cyan - secondary)
```

## Button Templates

### Primary Button
```css
background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%);
color: white;
padding: 1rem 2rem;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
font-weight: 600;
transition: all 0.2s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}
```

### Secondary Button
```css
background: var(--slate-100);
color: var(--slate-900);
border: 1px solid var(--slate-200);
padding: 1rem 2rem;
border-radius: 12px;
```

## Card Styling

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  
  &:hover {
    border-color: var(--primary-400);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.1);
    transform: translateY(-4px);
  }
}
```

## Input Styling

```css
input, textarea {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}
```

## Message Styling

```css
/* User message */
.message.user {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%);
  color: white;
  border-radius: 16px 4px 16px 16px; /* asymmetric */
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

/* Assistant message */
.message.assistant {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px 16px 16px 16px; /* asymmetric */
  padding: 1rem 1.25rem;
}
```

## Animation Timing

```css
/* Fast interactions */
transition: all 0.2s ease;

/* Medium animations */
transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);

/* Slow animations */
animation: float 8s ease-in-out infinite;
```

## Common Animations

### Hover Lift
```css
&:hover {
  transform: translateY(-2px);
}
```

### Message Entrance
```css
animation: messageSlideIn 0.3s cubic-bezier(0.23, 1, 0.320, 1);

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

## Responsive Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

## Dark Mode

Colors automatically change in dark mode via:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--slate-900);
    --text-primary: var(--slate-50);
    /* etc */
  }
}
```

## Shadow Levels

```css
/* Level 1: Subtle */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* Level 2: Cards */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Level 3: Floating */
box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

/* Level 4: Modals */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
```

## Typography Sizes

```css
h1 { font-size: 3.5rem; font-weight: 800; }
h2 { font-size: 1.75rem; font-weight: 700; }
h3 { font-size: 1.5rem; font-weight: 700; }
p  { font-size: 1rem; font-weight: 500; }
.small { font-size: 0.85rem; font-weight: 500; }
```

## Spacing Scale

```css
.xs { padding: 0.25rem; }
.sm { padding: 0.5rem; }
.md { padding: 1rem; }
.lg { padding: 1.5rem; }
.xl { padding: 2rem; }
.2xl { padding: 3rem; }
```

## Gradient Templates

### Primary Gradient
```css
background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
```

### Cyan Gradient
```css
background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
```

### Success Gradient
```css
background: linear-gradient(135deg, #059669 0%, #10b981 100%);
```

## Status Badge

```css
.badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
}

.badge.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  color: var(--success-500);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  color: var(--danger-500);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
```

## Accessibility Checklist

- ✅ Focus rings: `0 0 0 3px rgba(99, 102, 241, 0.1)`
- ✅ Color contrast: Text on background ≥ 7:1
- ✅ Touch targets: Minimum 44x44px
- ✅ Semantic HTML: Use proper headings, labels
- ✅ Dark mode: All colors work in both modes

## Performance Tips

1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width`, `height`, `position`
3. Use `will-change: transform` sparingly
4. Batch multiple changes in single repaint
5. Use `:has()` and `:is()` for specificity

---

**For complete documentation, see: DESIGN_SYSTEM.md**
