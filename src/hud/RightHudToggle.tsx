type Props = {
  onToggle: () => void;
};

export function RightHudToggle({ onToggle }: Props) {
  return (
    <button
      className="hud-toggle hud-toggle-right"
      onClick={onToggle}
      aria-label="Toggle right HUD"
    >
      ▶
    </button>
  );
}