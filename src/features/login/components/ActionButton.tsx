interface ActionButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
  backgroundColor?: string;
}

export default function ActionButton({
  children,
  type = 'button',
  onClick,
  className = '',
  backgroundColor = '#3D7A6E'
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-white ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </button>
  );
}