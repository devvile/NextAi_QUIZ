interface FooterLinksProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onAboutClick?: () => void;
}

export default function FooterLinks({
  onPrivacyClick,
  onTermsClick,
  onAboutClick
}: FooterLinksProps) {
  return (
    <div className="mt-12 flex justify-center space-x-4 text-sm text-slate-400">
      <button 
        onClick={onPrivacyClick}
        className="hover:text-slate-300 transition-colors duration-200"
      >
        Privacy
      </button>
      <span>•</span>
      <button 
        onClick={onTermsClick}
        className="hover:text-slate-300 transition-colors duration-200"
      >
        Terms
      </button>
      <span>•</span>
      <button 
        onClick={onAboutClick}
        className="hover:text-slate-300 transition-colors duration-200"
      >
        About
      </button>
    </div>
  );
}