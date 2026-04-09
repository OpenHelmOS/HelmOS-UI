type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function ZoomControl({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="flex divide-x divide-white/10">
      <button
        onClick={onZoomIn}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[90px]
        "
        aria-label="Zoom in"
      >
        +
      </button>

      <button
        onClick={onZoomOut}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[90px]
        "
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}
``