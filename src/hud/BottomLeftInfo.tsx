type Props = {
  lat: number;
  lon: number;
};

export function BottomLeftInfo({ lat, lon }: Props) {
  return (
    <div className="hud-box bottom-left-box">
      <div className="info-title">Crosshair</div>
      <div className="info-value">
        {lat.toFixed(5)}° | {lon.toFixed(5)}°
      </div>
    </div>
  );
}
``