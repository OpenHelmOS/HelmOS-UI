type Props = {
  mode: "2d" | "3d";
  onToggle: () => void;
};

export function ViewModeControl({ mode, onToggle }: Props) {
  return (
    <div className="flex">
      <button
        onClick={onToggle}
        className="
          px-4 py-3
          min-w-[180px]
          hover:bg-white/10
          active:bg-white/20
          text-sm tracking-wide
        "
      >
        {mode === "2d" ? "2D" : "3D"}
      </button>
    </div>
  );
}