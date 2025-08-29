# React Uni Popper

A lightweight, flexible React component for positioning floating elements (tooltips, dropdowns, popovers) with built-in portal support and arrow positioning. **Specifically implemented to solve the [Headless UI](https://headlessui.com/) portal issue** where dropdowns and popovers need to be rendered in specific containers rather than the default document.body.

## Features

- 🌐 **Portal Support**: Render Headless UI floating elements in any DOM container by determining container portal
- ♿ **Accessible**: You have Accessibility of Headless UI un hurt
- 📦 **Lightweight**: Uses Floating UI that Headless UI uses internally

## Installation

```bash
npm install react-uni-popper
# or
yarn add react-uni-popper
# or
pnpm add react-uni-popper
```

## Quick Start

```tsx
import React, { useRef, useState } from 'react';
import ReactUniPopper from 'react-uni-popper';

function TooltipExample() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Hover me
      </button>

      {isOpen && (
        <ReactUniPopper
          reference={buttonRef.current}
          placement="top"
          offset={8}
          arrow
          arrowSize={8}
        >
          <div className="bg-gray-900 text-white px-3 py-2 rounded text-sm">
            This is a tooltip!
          </div>
        </ReactUniPopper>
      )}
    </div>
  );
}
```

## API Reference

### Props

| Prop              | Type                          | Default         | Description                                     |
| ----------------- | ----------------------------- | --------------- | ----------------------------------------------- |
| `reference`       | `HTMLElement \| null`         | **required**    | The reference element to position relative to   |
| `children`        | `ReactNode \| RenderFunction` | **required**    | Content to render or render function            |
| `placement`       | `PositionType`                | `'bottom'`      | Preferred placement direction                   |
| `offset`          | `number`                      | `4`             | Distance between reference and floating element |
| `arrow`           | `boolean`                     | `false`         | Whether to show positioning arrow               |
| `arrowSize`       | `number`                      | `8`             | Size of the arrow in pixels                     |
| `portalContainer` | `HTMLElement`                 | `document.body` | Container to render the portal in               |
| `zIndex`          | `number`                      | `undefined`     | CSS z-index value                               |

### Position Types

```typescript
type PositionType =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';
```

### Render Function

The `children` prop can be a render function that receives positioning data:

```tsx
<ReactUniPopper reference={ref} arrow>
  {({ placement, arrowStyles, floatingStyles, arrowRef }) => (
    <div style={floatingStyles} className="tooltip">
      Content here
      {arrow && <div ref={arrowRef} style={arrowStyles} className="arrow" />}
    </div>
  )}
</ReactUniPopper>
```

## Headless UI Integration

This package is specifically designed to solve portal issues with Headless UI components. Here are examples of how to integrate it with various Headless UI components:

### Select Component with Headless UI

```tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  ListboxProps,
} from '@headlessui/react';
import ReactUniPopper from 'react-uni-popper';

interface SelectOption {
  name: string;
  value: string | number;
  className?: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<ListboxProps<any>, 'children'> {
  options: SelectOption[];
  renderOption?: (option: SelectOption) => React.ReactNode;
  popperClassName?: string;
  portalContainer?: HTMLElement;
}

function Select({
  options,
  className,
  value,
  renderOption,
  popperClassName,
  portalContainer = document.body,
  ...props
}: SelectProps) {
  const selectedValue = !value ? options[0].value : value;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Listbox value={selectedValue} onChange={props.onChange}>
      {({ open }) => (
        <>
          <ListboxButton
            ref={buttonRef}
            className={`flex h-9 min-h-9 w-full items-center justify-between text-nowrap rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 ${className || ''}`}
          >
            {selectedOption?.name}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </ListboxButton>

          {open && (
            <ReactUniPopper
              reference={buttonRef.current}
              portalContainer={portalContainer}
              zIndex={1300}
              placement="bottom-start"
              offset={4}
            >
              <ListboxOptions
                style={{
                  width: buttonRef.current?.offsetWidth,
                }}
                className={`max-h-60 overflow-auto rounded-lg border bg-white shadow-lg ${popperClassName || ''}`}
              >
                {options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    className={`cursor-pointer text-nowrap px-4 py-2 text-sm font-medium text-gray-700 data-[focus]:bg-blue-100 ${option.className || ''}`}
                    disabled={option.disabled}
                    value={option.value}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <span>{option.name}</span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </ReactUniPopper>
          )}
        </>
      )}
    </Listbox>
  );
}

export default Select;
```

### Combobox Component with Headless UI

```tsx
import React, { useRef, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxProps,
} from '@headlessui/react';
import ReactUniPopper from 'react-uni-popper';

interface ComboboxOption {
  name: string;
  value: string | number;
  className?: string;
  disabled?: boolean;
}

interface CustomComboboxProps extends Omit<ComboboxProps<any>, 'children'> {
  options: ComboboxOption[];
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  popperClassName?: string;
  portalContainer?: HTMLElement;
}

function CustomCombobox({
  options,
  className,
  value,
  onChange,
  renderOption,
  popperClassName,
  portalContainer = document.body,
  ...props
}: CustomComboboxProps) {
  const [query, setQuery] = useState('');
  const buttonRef = useRef<HTMLDivElement>(null);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <Combobox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <div ref={buttonRef} className="relative">
            <ComboboxInput
              className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 ${className || ''}`}
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(option: ComboboxOption) => option?.name}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </ComboboxButton>
          </div>

          {open && (
            <ReactUniPopper
              reference={buttonRef.current}
              portalContainer={portalContainer}
              zIndex={1300}
              placement="bottom-start"
              offset={4}
            >
              <ComboboxOptions
                className={`max-h-60 overflow-auto rounded-lg border bg-white shadow-lg ${popperClassName || ''}`}
              >
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 data-[focus]:bg-blue-100 ${option.className || ''}`}
                    disabled={option.disabled}
                    value={option}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <span>{option.name}</span>
                    )}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </ReactUniPopper>
          )}
        </>
      )}
    </Combobox>
  );
}

export default CustomCombobox;
```

### Dropdown Menu Component with Headless UI

```tsx
import React, { useRef, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuProps,
} from '@headlessui/react';
import ReactUniPopper from 'react-uni-popper';

interface MenuOption {
  name: string;
  value: string | number;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface CustomDropdownProps extends Omit<MenuProps<any>, 'children'> {
  options: MenuOption[];
  renderOption?: (option: MenuOption) => React.ReactNode;
  popperClassName?: string;
  portalContainer?: HTMLElement;
  buttonContent?: React.ReactNode;
}

function CustomDropdown({
  options,
  renderOption,
  popperClassName,
  portalContainer = document.body,
  buttonContent = 'Open Menu',
  ...props
}: CustomDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Menu>
      {({ open }) => (
        <>
          <MenuButton
            ref={buttonRef}
            className="flex h-9 min-h-9 items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700"
          >
            {buttonContent}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </MenuButton>

          {open && (
            <ReactUniPopper
              reference={buttonRef.current}
              portalContainer={portalContainer}
              zIndex={1300}
              placement="bottom-start"
              offset={4}
            >
              <MenuItems
                className={`min-w-48 rounded-lg border bg-white shadow-lg p-2 ${popperClassName || ''}`}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.value}
                    disabled={option.disabled}
                    className={`cursor-pointer rounded px-3 py-2 text-sm font-medium text-gray-700 data-[focus]:bg-blue-100 ${option.className || ''}`}
                    onClick={option.onClick}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <span>{option.name}</span>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </ReactUniPopper>
          )}
        </>
      )}
    </Menu>
  );
}

export default CustomDropdown;
```

## Styling

The component renders with a `headless-popper` class for custom styling:

```css
.headless-popper {
  /* Your custom styles */
}

.headless-popper .arrow {
  /* Arrow styles */
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}
```

## Browser Support

- React 16.8+ (hooks support required)
- Modern browsers with ES6+ support
- IE11+ with polyfills

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
