import React from 'react';

/**
 * Generates a unique identifier for a tooltip.
 *
 * @returns A string in the format `tooltip-<randomString>`, where `<randomString>`
 * is a randomly generated alphanumeric string of 7 characters.
 */
export function getId() {
  return `tooltip-${Math.random().toString(36).slice(2, 9)}`;
}

export function getReactElementRef(
  element: React.ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.Ref<any> | null {
  // 'ref' is passed as prop in React 19, whereas 'ref' is directly attached to children in older versions
  if (parseInt(React.version, 10) >= 19) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (element?.props as any)?.ref || null;
  }
  // @ts-expect-error element.ref is not included in the ReactElement type
  // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70189
  return element?.ref || null;
}
