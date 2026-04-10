import { Compass } from "lucide-react";

type MapOrientationMode = "north-up" | "3d" | "follow";

type Props = {
  mode: MapOrientationMode;
  bearing: number;
  onToggle: () => void;
};

export function OrientationModeControl({
  mode,
  bearing,
  onToggle,
}: Props) {
  return (
    <div className="flex">
      <button
        onClick={onToggle}
        className="
          px-4 py-3
          min-w-[180px]
          flex items-center justify-center gap-2
          hover:bg-white/10
          active:bg-white/20
        "
        aria-label="Map orientation mode"
      >
        {mode === "north-up" && (
          <Compass
            size={20}
            className="text-red-500"
          />
        )}

        {mode === "3d" && (
          <>
            <Compass size={20} />
            <span className="text-xs tracking-wide">3D</span>
          </>
        )}

        {mode === "follow" && (
          <Compass
            size={20}
            style={{
              transform: `rotate(${bearing}deg)`,
            }}
          />
        )}
      </button>
    </div>
  );
}