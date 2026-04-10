type Props = {
  isFollowing: boolean;
  onFindBoat: () => void;
  onToggleFollow: () => void;
};

export function CameraControl({
  isFollowing,
  onFindBoat,
  onToggleFollow,
}: Props) {
  return (
    <div className="flex divide-x divide-white/10">
      <button
        onClick={onFindBoat}
        className="
          px-4 py-3
          hover:bg-white/10
          active:bg-white/20
          min-w-[90px]
        "
      >
        Find
      </button>

      <button
        onClick={onToggleFollow}
        className={`
          px-4 py-3
          min-w-[90px]
          hover:bg-white/10
          active:bg-white/20
          ${isFollowing ? "bg-white/20" : ""}
        `}
      >
        Follow
      </button>
    </div>
  );
}