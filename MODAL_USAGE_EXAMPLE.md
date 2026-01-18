# Headless UI Modal - Usage Examples

## Installation

✅ `@headlessui/react` has been installed and is ready to use.

## Basic Usage

```tsx
import { useState } from 'react';
import { Modal } from '@/components/ui';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button with hover animation (Tailwind only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-brand-primary-500 text-text-primary rounded-lg font-semibold transition-all hover:scale-105 hover:bg-brand-primary-400 active:scale-95"
      >
        Open Modal
      </button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p className="text-text-primary">Modal content goes here.</p>
      </Modal>
    </>
  );
}
```

## Complete Example with Actions

```tsx
import { useState } from 'react';
import { Modal } from '@/components/ui';
import { Button } from '@/components/Auth';

function DeleteConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Delete logic here
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-danger-500 text-text-primary rounded-lg font-semibold transition-all hover:scale-105 hover:bg-danger-600 active:scale-95"
      >
        Delete Item
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete subscription?"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary">
            This action cannot be undone. The subscription will be permanently deleted.
          </p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-700 text-text-primary text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-danger-500 text-text-primary text-sm font-medium rounded-lg hover:bg-danger-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
```

## Modal Sizes

```tsx
// Small modal (max-w-md)
<Modal isOpen={isOpen} onClose={onClose} title="Small" size="sm">
  Content
</Modal>

// Medium modal (max-w-lg) - default
<Modal isOpen={isOpen} onClose={onClose} title="Medium" size="md">
  Content
</Modal>

// Large modal (max-w-2xl)
<Modal isOpen={isOpen} onClose={onClose} title="Large" size="lg">
  Content
</Modal>

// Extra large modal (max-w-4xl)
<Modal isOpen={isOpen} onClose={onClose} title="XL" size="xl">
  Content
</Modal>

// Full width with margins (max-w-full mx-4)
<Modal isOpen={isOpen} onClose={onClose} title="Full" size="full">
  Content
</Modal>
```

## Without Title or Close Button

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  showCloseButton={false}
>
  <div className="py-4">
    <p>Custom content without header</p>
  </div>
</Modal>
```

## Button Hover Animations (Tailwind Only)

The modal includes smooth animations, but you can add hover effects to buttons:

```tsx
// Scale on hover
<button className="transition-transform hover:scale-105 active:scale-95">
  Hover Me
</button>

// Background color change
<button className="bg-brand-primary-500 hover:bg-brand-primary-400 transition-colors">
  Hover Me
</button>

// Combined effects
<button className="
  px-4 py-2 bg-brand-primary-500 text-text-primary rounded-lg
  transition-all duration-200
  hover:scale-105 hover:bg-brand-primary-400
  active:scale-95
">
  Interactive Button
</button>
```

## Modal Animation Details

The Modal component uses Headless UI Transition with Tailwind classes:

**Backdrop:**
- Fade in: `opacity-0` → `opacity-100` (200ms)
- Fade out: `opacity-100` → `opacity-0` (150ms)

**Panel:**
- Fade + Scale in: `opacity-0 scale-95` → `opacity-100 scale-100` (200ms)
- Fade + Scale out: `opacity-100 scale-100` → `opacity-0 scale-95` (150ms)

All animations use Tailwind's `transition-all` utility for smooth transitions.

## Accessibility Features

✅ **Keyboard Navigation**
- ESC key closes modal
- Focus trap within modal
- Tab navigation works correctly

✅ **ARIA Attributes**
- Dialog role automatically applied
- Proper label associations
- Screen reader announcements

✅ **Focus Management**
- Focus moves to first focusable element on open
- Focus returns to trigger on close
- Focus trap prevents tabbing outside modal
