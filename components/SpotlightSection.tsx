import React from 'react';

interface SpotlightSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SpotlightSection = React.forwardRef<HTMLElement, SpotlightSectionProps>(({ children, className = '', ...rest }, ref) => {
  return (
    <section
      ref={ref}
      {...rest}
      className={`relative ${className}`}
    >
      {children}
    </section>
  );
});

export default SpotlightSection;

