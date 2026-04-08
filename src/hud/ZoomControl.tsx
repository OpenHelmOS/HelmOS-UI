type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function ZoomControl({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="hud-box zoom-box">
      <button className="zoom-btn" onClick={onZoomIn}>+</button>
      <button className="zoom-btn" onClick={onZoomOut}>−</button>
    </div>
  );
}