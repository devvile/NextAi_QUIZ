interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  ariaLabel?: string;
}

export default function VideoBackground({ videoSrc, className = "", ariaLabel = "Background video" }: VideoBackgroundProps) {
  return (
    <div className={`hidden lg:flex lg:w-2/3 relative ${className}`}>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        aria-label={ariaLabel}
        role="img"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}