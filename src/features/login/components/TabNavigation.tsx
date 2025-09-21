interface TabNavigationProps {
  isSignIn: boolean;
  onTabChange: (isSignIn: boolean) => void;
}

export default function TabNavigation({ isSignIn, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex mb-8">
      <button
        onClick={() => onTabChange(true)}
        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
          isSignIn
            ? 'text-white border-b-2 border-blue-500'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onTabChange(false)}
        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
          !isSignIn
            ? 'text-white border-b-2 border-blue-500'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}