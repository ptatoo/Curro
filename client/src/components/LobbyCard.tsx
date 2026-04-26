interface LobbyCardProps {
  name: string;
  location: string;
  time: string;
  participants: number;
  maxParticipants: number;
  distance: string;
  onClick?: () => void;
}

export function LobbyCard({
  name,
  location,
  time,
  participants,
  maxParticipants,
  distance,
  onClick,
}: LobbyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:opacity-90 transition-opacity cursor-pointer"
    >
      <h3 className="text-card-foreground font-medium">{name}</h3>

      <p className="text-muted-foreground text-sm mt-1">{location}</p>

      <p className="text-muted-foreground text-sm mt-2">{time}</p>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-muted-foreground">
          {participants}/{maxParticipants} runners
        </span>

        <span className="text-primary font-medium">{distance}</span>
      </div>

      {/* VIEW DETAILS LABEL */}
      <p className="mt-3 text-sm text-primary font-medium">
        View details →
      </p>
    </div>
  );
}