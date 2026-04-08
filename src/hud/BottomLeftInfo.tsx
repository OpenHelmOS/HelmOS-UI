type Props = {
  lat: number;
  lon: number;
};

export function BottomLeftInfo({ lat, lon }: Props) {
  return (
    <div className="info-box bottom-left">
      <div className="info-title">Keskipiste</div>
      <div className="info-value">
        {lat.toFixed(5)}°
      </div>
      <div className="info-value">
        {lon.toFixed(5)}°
      </div>
    </div>
  );
}
``