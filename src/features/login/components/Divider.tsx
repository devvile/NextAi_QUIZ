interface DividerProps {
  text: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-600"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-slate-900 text-slate-400">{text}</span>
      </div>
    </div>
  );
}