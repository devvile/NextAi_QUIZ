interface FormControlsProps {
  keepLoggedIn: boolean;
  onKeepLoggedInChange: (checked: boolean) => void;
  onForgotPassword: () => void;
}

export default function FormControls({
  keepLoggedIn,
  onKeepLoggedInChange,
  onForgotPassword
}: FormControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={keepLoggedIn}
          onChange={(e) => onKeepLoggedInChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="ml-2 text-sm text-slate-300">Keep me logged in</span>
      </label>
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
      >
        Forgot password?
      </button>
    </div>
  );
}