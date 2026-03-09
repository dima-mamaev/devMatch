---
name: figma-extract
description: Extract implementation details from Figma designs. Use when implementing UI from Figma, converting designs to code, or needing to understand a Figma mockup. Accepts Figma URLs or works with current selection in Figma desktop.
---

# Figma Extract - Design to Implementation

Extract structured implementation details from Figma designs for the landing page's Next.js + React + Tailwind stack.

## Prerequisites

- **Figma Desktop App** must be running with Dev Mode enabled
- **MCP Server** enabled in Figma (Shift+D → Enable desktop MCP server)
- The frame/component you want must be **selected in Figma** OR provide a **Figma URL**

## When to Use

- Converting Figma mockups to React/TypeScript components
- Understanding what components a design needs
- Planning implementation of new UI features
- Building new UI that matches existing designs

---

## Process Flow

Follow these steps IN ORDER:

### Step 1: Visual Context (REQUIRED)

**Always get a screenshot first** - This shows what we're building.

```
Call: get_screenshot(nodeId: "[extracted-node-id]")
```

### Step 2: Get Design Context

```
Call: get_design_context(nodeId: "[extracted-node-id]")
```

This returns React + Tailwind code. Read it to understand:
- Component hierarchy
- Text content
- Interactive elements

### Step 3: Feature Specification (PRD-style)

Before diving into implementation, describe WHAT we're building:

```markdown
## Feature Specification

### What is this?
[1-2 sentences describing the feature's purpose]

### User Stories
- As a [role], I can [action] so that [benefit]

### Acceptance Criteria
- [ ] User can...
- [ ] System should...
```

### Step 4: Pattern Discovery

**IMPORTANT**: Invoke the `/find-pattern` skill to find similar existing implementations.

This will:
- Find reference files to follow
- Identify existing components to reuse
- Show patterns for similar features

### Step 5: Component Mapping

Check `.claude/reference/components_catalog.md` for existing components.

Split into two categories:
1. **Already Have** - Components/patterns that exist (reuse these)
2. **Need to Implement** - New UI elements

### Step 6: Translate Tailwind Classes

**CRITICAL**: Convert Figma's raw values to landing page design tokens.

Use the translation map below - NEVER output raw hex colors or pixel values.

### Step 7: Generate Implementation Tasks

Create specific, actionable tasks for what's actually NEW.
Reference existing patterns. Skip known layout patterns.

---

## Tailwind Translation Map

**Always translate Figma output to our design tokens:**

### Colors

**See `.claude/reference/components_catalog.md` and brand guidelines for color mappings.**

Common patterns:
- Background: `bg-white`, `bg-gray-50`, `bg-gray-900`
- Text: `text-gray-900`, `text-gray-600`, `text-white`
- Primary/Accent: Check brand.md for brand colors
- Borders: `border-gray-200`, `border-gray-300`

### Spacing (Tailwind scale)

| Figma px | Tailwind | Usage |
|----------|----------|-------|
| `4px` | `1` | `gap-1`, `p-1` |
| `8px` | `2` | `gap-2`, `p-2` |
| `12px` | `3` | `gap-3`, `p-3` |
| `16px` | `4` | `gap-4`, `p-4` |
| `20px` | `5` | `gap-5`, `p-5` |
| `24px` | `6` | `gap-6`, `p-6` |
| `32px` | `8` | `gap-8`, `p-8` |
| `48px` | `12` | `gap-12`, `p-12` |
| `64px` | `16` | `gap-16`, `p-16` |

### Border Radius

| Figma px | Tailwind |
|----------|----------|
| `4px` | `rounded` |
| `6px` | `rounded-md` |
| `8px` | `rounded-lg` |
| `12px` | `rounded-xl` |
| `16px` | `rounded-2xl` |
| `full` | `rounded-full` |

### Typography

| Figma Size | Tailwind |
|------------|----------|
| `12px` | `text-xs` |
| `14px` | `text-sm` |
| `16px` | `text-base` |
| `18px` | `text-lg` |
| `20px` | `text-xl` |
| `24px` | `text-2xl` |
| `30px` | `text-3xl` |
| `36px` | `text-4xl` |
| `48px` | `text-5xl` |

---

## Known Patterns to Filter Out

These exist in the landing page layouts - do NOT include them in implementation tasks:

| Pattern | Location | Notes |
|---------|----------|-------|
| Navigation header | `components/navigation/` | Site-wide header |
| Footer | `components/footer/` | Site-wide footer |
| Hero sections | Common pattern | Check existing hero components |
| CTA buttons | `components/ui/` | Standard button variants |
| Form inputs | `components/forms/` | Use existing form components |

If the design shows these, mention "uses existing layout" and move on.

---

## Output Template

Use this structure for your output:

```markdown
# Feature: [Feature Name]

## Screenshot
[Image from get_screenshot]

## Feature Specification

### What is this?
[Brief description]

### User Stories
- As a [role], I can [action] so that [benefit]

### Acceptance Criteria
- [ ] User can...
- [ ] System should...

---

## Existing Patterns to Follow

[Results from /find-pattern]

### Reference Files
- `app/...` or `components/...` - Similar UI
- `lib/...` - Similar utilities
- `components/...` - Reusable components

---

## Component Mapping

### Already Have (reuse)
| UI Element | Component | Location |
|------------|-----------|----------|
| [element] | [component] | [path] |

### Need to Implement
| UI Element | Approach | Notes |
|------------|----------|-------|
| [element] | [recommendation] | [details] |

---

## Design Tokens (Translated)

### Colors
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-600`
- Accent: [from brand.md]

### Typography
- Heading: `text-4xl font-bold text-gray-900`
- Subheading: `text-xl font-medium text-gray-700`
- Body: `text-base text-gray-600`
- Caption: `text-sm text-gray-500`

### Spacing
- Section: `py-16 px-4`
- Container: `max-w-7xl mx-auto`
- Card: `p-6`
- Elements: `gap-4`

---

## Implementation Tasks

### Phase 1: Setup
- [ ] **Create component**: `components/[name]/[Component].tsx`
- [ ] **Add types**: Define TypeScript interfaces

### Phase 2: Component Structure
- [ ] **Implement JSX**: Build component structure
- [ ] **Follow pattern**: Reference `[similar component]`
- [ ] **Add props**: Define component props interface

### Phase 3: Styling
- [ ] **Apply Tailwind**: Use design tokens (not raw values)
- [ ] **Responsive**: Add mobile/tablet breakpoints
- [ ] **Dark mode**: If applicable

### Phase 4: Behavior
- [ ] **Interactivity**: Add click handlers, state management
- [ ] **Animations**: Use Motion if needed
- [ ] **Forms**: Hook up form handling if applicable

### Phase 5: Integration
- [ ] **Import**: Add to parent component/page
- [ ] **Props**: Pass required data
- [ ] **Test**: Verify in browser

### Phase 6: Verify
- [ ] `npm run type-check` - TypeScript validation
- [ ] `npm run lint` - ESLint check
- [ ] `npm run build` - Build validation
- [ ] Manual test in browser
```

---

## Example: Translating Figma Output

### Bad (Raw Figma)
```tsx
<div className="bg-[#f9fafb] gap-4 p-6 font-['Inter'] text-[24px] text-[#111827]">
```

### Good (Translated)
```tsx
<div className="bg-gray-50 gap-4 p-6 font-sans text-2xl text-gray-900">
```

---

## Tool Usage

### With Figma URL

```
/figma-extract https://www.figma.com/design/xxx?node-id=123-456

1. Extract nodeId from URL (123:456 or 123-456)
2. get_screenshot(nodeId)
3. get_design_context(nodeId)
4. Write feature spec
5. Run /find-pattern for similar implementations
6. Map components (existing vs new)
7. Translate Tailwind to our tokens
8. Generate specific implementation tasks
```

### With Current Selection

```
/figma-extract

1. get_screenshot() (uses current selection)
2. get_design_context() (uses current selection)
3. Same process as above
```

---

## Key Reminders

1. **Screenshot first** - Always show what we're building
2. **Feature spec before code** - Describe WHAT, then HOW
3. **Use /find-pattern** - Find similar existing implementations
4. **Translate Tailwind** - Never output raw hex/px values
5. **Filter known patterns** - Don't task out existing layouts
6. **Be specific** - Tasks should reference actual files and components
7. **TypeScript first** - Always define types/interfaces
8. **Responsive design** - Consider mobile/tablet breakpoints
