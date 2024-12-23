"use client";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const ModernButton = ({ label, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center px-6 py-3 text-white font-semibold bg-gradient-to-b from-purple-500 to-pink-500 border-2 border-transparent hover:border-purple-600 transition-all duration-300 rounded-md shadow-lg transform hover:scale-105"
      style={{
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)", // Bottom shadow effect
      }}
    >
      {label}
    </button>
  );
};

export default ModernButton;
