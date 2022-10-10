import * as React from 'react';

type Props = React.ComponentPropsWithRef<'input'>;

/**
 * A simple text input
 */
export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ ...rest }: Props, ref) => (
    <input
      type="text"
      ref={ref}
      placeholder="user:<username> and/or stars:<from>..<to>"
      {...rest}
    />
  ),
);

// Display name for React debugging messages
Input.displayName = 'Input';
