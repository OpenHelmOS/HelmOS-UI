type Props = {
  onCenterBoat: () => void;
};

export function BoatCenterControl({ onCenterBoat }: Props) {
  return (
    <div className="flex">
      <button
        onClick={onCenterBoat}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[180px]
        "
        aria-label="Center to boat"
      >
        Center to boat
      </button>
    </div>
  );
}
