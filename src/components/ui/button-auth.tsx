import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  className?: string;
}

const ButtonAuth: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = 'button',
  variant = 'primary',
  className = ''
}) => {
  return (
    <StyledWrapper className={className}>
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={variant}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    padding: 16px 24px;
    border: unset;
    border-radius: 20px;
    color: #F8F4FF;
    z-index: 1;
    background: #451F55;
    position: relative;
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    box-shadow: 0 8px 20px -3px rgba(69, 31, 85, 0.3);
    transition: all 300ms ease;
    overflow: hidden;
    cursor: pointer;
  }

  button.secondary {
    background: #ffffff;
    color: #451F55;
    border: 2px solid #e5e7eb;
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
  }

  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 20px;
    background: linear-gradient(135deg, #F8F4FF 0%, #e8d5ff 100%);
    z-index: -1;
    box-shadow: 0 8px 25px -3px rgba(248, 244, 255, 0.4);
    transition: all 300ms ease;
  }

  button.secondary::before {
    background: linear-gradient(135deg, #451F55 0%, #6b21a8 100%);
  }

  button:hover:not(:disabled) {
    color: #451F55;
    transform: translateY(-2px);
    box-shadow: 0 12px 25px -3px rgba(69, 31, 85, 0.4);
  }

  button.secondary:hover:not(:disabled) {
    color: #F8F4FF;
    border-color: #451F55;
    box-shadow: 0 8px 20px -2px rgba(69, 31, 85, 0.3);
  }

  button:hover:not(:disabled)::before {
    width: 100%;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  button:disabled::before {
    width: 0;
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export default ButtonAuth;