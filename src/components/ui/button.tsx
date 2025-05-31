import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children = "Generate", 
  onClick, 
  type = "submit",
  disabled = false,
  className = ""
}) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-violet-950 text-white border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="bg-violet-400 shadow-violet-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]" />
      {children}
    </button>
  );
}

export default Button;