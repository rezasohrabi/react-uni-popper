import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import Tooltip from './index';

describe('Tooltip', () => {
  beforeEach(() => {
    // Create a container for the portal to avoid test warnings
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);

    // Mock timers for delay testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up the portal container
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }

    // Restore timers
    vi.restoreAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('shows tooltip on mouse over with default delay', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(screen.getByText('Hover me'));

    // Default open delay is 300ms
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    // Fast-forward time to trigger the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('hides tooltip on mouse leave with default delay', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    // Show tooltip
    fireEvent.mouseOver(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    // Hide tooltip
    fireEvent.mouseLeave(screen.getByText('Hover me'));

    // Default close delay is 200ms
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  test('shows tooltip immediately on focus', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>,
    );

    fireEvent.focus(screen.getByText('Focus me'));

    // Should show immediately without delay on focus
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('hides tooltip immediately on blur', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Focus me</button>
      </Tooltip>,
    );

    // Show tooltip with focus
    fireEvent.focus(screen.getByText('Focus me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    // Hide tooltip with blur
    fireEvent.blur(screen.getByText('Focus me'));

    // Should hide immediately without delay on blur
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  test('applies custom class name to tooltip', async () => {
    render(
      <Tooltip content="Tooltip content" className="custom-tooltip-class">
        <button>Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    const tooltipElement = screen
      .getByText('Tooltip content')
      .closest('.headless-tooltip');
    expect(tooltipElement).toHaveClass('custom-tooltip-class');
  });

  test('handles controlled mode with open prop', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip content" open={false}>
        <button>Controlled Tooltip</button>
      </Tooltip>,
    );

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    rerender(
      <Tooltip content="Tooltip content" open={true}>
        <button>Controlled Tooltip</button>
      </Tooltip>,
    );

    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('calls onOpenChange callback when state changes', async () => {
    const onOpenChange = vi.fn();

    render(
      <Tooltip content="Tooltip content" onOpenChange={onOpenChange}>
        <button>Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('respects custom delay settings', async () => {
    const openDelay = 500;
    const closeDelay = 400;

    render(
      <Tooltip
        content="Tooltip content"
        openDelay={openDelay}
        closeDelay={closeDelay}
      >
        <button>Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(screen.getByText('Hover me'));

    // Not visible before delay
    act(() => {
      vi.advanceTimersByTime(openDelay - 10);
    });
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    // Visible after delay
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    // Start closing
    fireEvent.mouseLeave(screen.getByText('Hover me'));

    // Still visible before close delay
    act(() => {
      vi.advanceTimersByTime(closeDelay - 10);
    });
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    // Hidden after close delay
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  test('renders arrow when arrow prop is true', () => {
    render(
      <Tooltip content="Tooltip content" arrow={true} open={true}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const arrowElement = document.querySelector('.headless-tooltip-arrow');
    expect(arrowElement).toBeInTheDocument();
  });

  test('applies custom arrow class name', () => {
    render(
      <Tooltip
        content="Tooltip content"
        arrow={true}
        arrowClassName="custom-arrow-class"
        open={true}
      >
        <button>Hover me</button>
      </Tooltip>,
    );

    const arrowElement = document.querySelector('.headless-tooltip-arrow');
    expect(arrowElement).toHaveClass('custom-arrow-class');
  });

  test('sets custom arrow size', () => {
    const customSize = 20;

    render(
      <Tooltip
        content="Tooltip content"
        arrow={true}
        arrowSize={customSize}
        open={true}
      >
        <button>Hover me</button>
      </Tooltip>,
    );

    const arrowElement = document.querySelector(
      '.headless-tooltip-arrow',
    ) as HTMLElement;
    expect(arrowElement.style.width).toBe(`${customSize}px`);
    expect(arrowElement.style.height).toBe(`${customSize}px`);
  });

  test('closes tooltip when Escape key is pressed', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseOver(screen.getByText('Hover me'));

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  test('respects disableInteractive prop', () => {
    render(
      <Tooltip content="Tooltip content" open={true} disableInteractive={true}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltipElement = screen
      .getByText('Tooltip content')
      .closest('.headless-popper') as HTMLElement;

    // Events should not be defined when disableInteractive is true
    expect(tooltipElement).not.toHaveAttribute('onMouseEnter');
    expect(tooltipElement).not.toHaveAttribute('onMouseLeave');
  });

  test('keeps tooltip open when hovering over tooltip with interactive mode', async () => {
    render(
      <Tooltip content="Tooltip content" disableInteractive={false}>
        <button>Hover me</button>
      </Tooltip>,
    );

    // Show tooltip
    fireEvent.mouseOver(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    // Mouse leaves trigger but enters tooltip
    fireEvent.mouseLeave(screen.getByText('Hover me'));

    // Simulate mouse enter on tooltip
    fireEvent.mouseEnter(
      screen
        .getByText('Tooltip content')
        .closest('.headless-popper') as HTMLElement,
    );

    // Fast-forward past the close delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Tooltip should still be visible because we're hovering over it
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('renders in a custom portal container', () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-container';
    document.body.appendChild(customContainer);

    render(
      <Tooltip
        content="Tooltip content"
        open={true}
        portalContainer={customContainer}
      >
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltipInCustomContainer =
      customContainer.querySelector('.headless-tooltip');
    expect(tooltipInCustomContainer).toBeInTheDocument();
    expect(tooltipInCustomContainer?.textContent).toBe('Tooltip content');

    // Clean up
    document.body.removeChild(customContainer);
  });

  test('wraps non-element children in a span', () => {
    render(<Tooltip content="Tooltip content">Text Node</Tooltip>);

    const span = screen.getByText('Text Node');
    expect(span.tagName).toBe('SPAN');
  });

  test('sets aria-describedby when tooltip is open', () => {
    render(
      <Tooltip content="Tooltip content" open={true}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByText('Hover me');
    const tooltipId = trigger.getAttribute('aria-describedby');
    expect(tooltipId).toBeTruthy();

    const tooltip = document.getElementById(tooltipId as string);
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.textContent).toBe('Tooltip content');
  });

  test('cleans up timeouts on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    // Trigger open timeout
    fireEvent.mouseOver(screen.getByText('Hover me'));

    unmount();

    // Should clear any pending timeouts on unmount
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
