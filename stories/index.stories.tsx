import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '../src/index';
import React from 'react';
import type { PositionType } from '../src/index';
import './index.css';

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    content: 'This is a basic tooltip',
    children: <button>Hover me</button>,
  },
};

export const WithCustomPlacement: Story = {
  args: {
    content: 'Tooltip on the right',
    placement: 'right',
    children: <button>Hover me</button>,
  },
};

export const WithArrow: Story = {
  args: {
    content: 'Tooltip with arrow',
    arrow: true,
    children: <button>Hover me</button>,
  },
};

export const WithCustomOffset: Story = {
  args: {
    content: 'Tooltip with custom offset',
    offset: 20,
    children: <button>Hover me</button>,
  },
};

export const WithCustomDelay: Story = {
  args: {
    content: 'Tooltip with custom delay',
    openDelay: 500,
    closeDelay: 1000,
    children: <button>Hover me</button>,
  },
};

export const WithCustomZIndex: Story = {
  args: {
    content: 'Tooltip with custom z-index',
    zIndex: 1500,
    children: <button>Hover me</button>,
  },
};

export const WithCustomStyling: Story = {
  args: {
    content: (
      <div
        style={{
          padding: '10px',
          background: '#333',
          color: 'white',
          borderRadius: '4px',
        }}
      >
        Custom styled tooltip
      </div>
    ),
    children: <button>Hover me</button>,
  },
};

export const WithInteractiveContent: Story = {
  args: {
    content: (
      <div>
        <p>Interactive tooltip content</p>
        <button onClick={() => alert('Button clicked!')}>Click me</button>
      </div>
    ),
    disableInteractive: false,
    children: <button>Hover me</button>,
  },
};

export const WithControlledState: Story = {
  args: {
    content: 'Controlled tooltip',
    open: true,
    children: <button>Controlled tooltip</button>,
  },
};

export const WithDifferentPlacements: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {[
        'top',
        'right',
        'bottom',
        'left',
        'top-start',
        'top-end',
        'right-start',
        'right-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
      ].map((placement) => (
        <Tooltip
          key={placement}
          content={`Tooltip on ${placement}`}
          placement={placement as PositionType}
        >
          <button className="placement-button">{placement}</button>
        </Tooltip>
      ))}
    </div>
  ),
};
