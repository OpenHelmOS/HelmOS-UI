import { BottomLeftInfo } from "./BottomLeftInfo";

type Props = {
  center: {
    lat: number;
    lon: number;
  };
};

export function BottomLeftGroup({ center }: Props) {
  return (
    <>
      <BottomLeftInfo lat={center.lat} lon={center.lon} />
      {/* myöhemmin lisää tähän muita vasemman puolen HUD-elementtejä */}
    </>
  );
}