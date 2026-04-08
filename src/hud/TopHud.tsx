
// src/hud/TopHud.tsx

export function TopHud() {
  return (
    <div className="hud-box top-hud-box">
      <div className="top-hud-heading">
        <span className="heading-value">273°</span>
        <span className="heading-label">NE</span>
      </div>

      <div className="top-hud-status">
        <span className="status ok">GPS</span>
        <span className="status ok">AP</span>
      </div>
    </div>
  );

}
