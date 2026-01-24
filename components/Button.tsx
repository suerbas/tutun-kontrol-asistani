import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    // WCAG 2.1 requires minimum 44px touch target
    const baseStyles = "px-5 py-3 min-h-[44px] rounded-lg font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

    const variants = {
        primary: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm hover:shadow-md",
        secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
        danger: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500",
        outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
