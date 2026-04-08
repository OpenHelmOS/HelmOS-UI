type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function ZoomControl({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="hud-box zoom-box bottom-right-box">
      <button
        className="zoom-btn zoom-in"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="zoom-btn zoom-out"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
}