import { useState } from "react";

type Props = {
  version: string;
};

export function BottomBar({ version }: Props) {
  const [showAttrib, setShowAttrib] = useState(false);

  return (
    <div className="bottom-bar hud-bar">
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