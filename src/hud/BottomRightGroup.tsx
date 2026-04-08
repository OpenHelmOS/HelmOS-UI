import { ZoomControl } from "./ZoomControl";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function BottomRightGroup({ onZoomIn, onZoomOut }: Props) {
  return (
    <ZoomControl
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
    />
  );
}