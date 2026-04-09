
type Props = {
  center: { lat: number; lon: number };
};

export function CrosshairLocation({ center }: Props) {
  return (
    <div className="px-3 py-2 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-white/60">
        Crosshair
      </span>
      <span className="font-mono text-sm">
        {center.lat.toFixed(5)}° | {center.lon.toFixed(5)}°
      </span>
    </div>
  );
}
