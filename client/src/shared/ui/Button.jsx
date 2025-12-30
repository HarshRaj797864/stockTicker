import React from 'react';
import { clsx } from 'clsx'; 
import { twMerge } from 'tailwind-merge'; 
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  isLoading = false, 
  ...props 
}) => {
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  
  const classes = twMerge(
    clsx(
      'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50', 
      variants[variant] 
    )
  );

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={classes}
      {...props}
    >
      {}
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
