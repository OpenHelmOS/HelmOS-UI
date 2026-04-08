import { useState, useEffect, useRef } from "react";

type Props = {
  version: string;
};

export function BottomBar({ version }: Props) {
  const [showAttrib, setShowAttrib] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      const height = ref.current!.offsetHeight;
      document.documentElement.style.setProperty(
        "--bottom-bar-height",
        `${height}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bottom-bar hud-bar">
      <div className="bottom-bar-left">
        v{version}
      </div>

      <div className="bottom-bar-center-absolute">
        OpenHelmOS
      </div>

      
        <div className="bottom-bar-right-group">
            {showAttrib && (
            <div className="bottom-bar-attrib">
                © OpenStreetMap contributors · MapLibre
            </div>
            )}
            <button
                className="bottom-bar-right"
                onClick={() => setShowAttrib(v => !v)}
                aria-label="Attribution"
                >
                ⓘ
            </button>
        </div>
    </div>
  );
}