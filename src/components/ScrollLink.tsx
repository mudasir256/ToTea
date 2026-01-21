import { Link, LinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

export const ScrollLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ onClick, to, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Scroll to top on navigation (instant)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      
      // Call original onClick if provided
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link
        ref={ref}
        to={to}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

ScrollLink.displayName = 'ScrollLink';
