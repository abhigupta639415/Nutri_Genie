import React from 'react';

/**
 * PageContainer provides a consistent, generous max-width and responsive horizontal padding
 * across every page in the application.
 *
 * Max width: 1536px (`max-w-screen-2xl`) or 1440px (`max-w-[1440px]`)
 * Responsive padding: px-6 md:px-10 lg:px-16
 */
export const PageContainer = ({
  children,
  className = '',
  maxWidth = 'max-w-screen-2xl',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`w-full ${maxWidth} mx-auto px-6 md:px-10 lg:px-16 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * SectionContainer provides full-bleed background styling across the entire viewport
 * while constraining inner content to the shared PageContainer width.
 */
export const SectionContainer = ({
  children,
  className = '',
  containerClassName = '',
  maxWidth = 'max-w-screen-2xl',
  as: Component = 'section',
  ...props
}) => {
  return (
    <Component className={`w-full ${className}`} {...props}>
      <PageContainer maxWidth={maxWidth} className={containerClassName}>
        {children}
      </PageContainer>
    </Component>
  );
};

export default PageContainer;
