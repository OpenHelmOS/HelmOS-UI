type Props = {
  onToggle: () => void;
};

export function LeftHudToggle({ onToggle }: Props) {
  return (
    <button
      className="hud-toggle hud-toggle-left"
      onClick={onToggle}
      aria-label="Toggle left HUD"
    >
      ◀
    </button>
  );
}