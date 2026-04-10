type Props = {
  onNorthUp: () => void;
  on3DView: () => void;
};

export function CompassOrientationControl({
  onNorthUp,
  on3DView,
}: Props) {
  return (
    <div className="flex divide-x divide-white/10">
      <button
        onClick={onNorthUp}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[90px]
        "
        aria-label="North up"
      >
        North ↑
      </button>

      <button
        onClick={on3DView}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[90px]
        "
        aria-label="3D view"
      >
        3D
      </button>
    </div>
  );
}