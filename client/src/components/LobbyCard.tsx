import type { RunRoute, RunGroup } from "../types/runTypes";

interface LobbyCardProps {
  thisRoute: RunRoute;
  thisLobby: RunGroup;
  onClick?: () => void;
}

export function LobbyCard({ thisRoute, thisLobby, onClick }: LobbyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:opacity-90 transition-opacity cursor-pointer"
    >
      <h3 className="text-card-foreground font-medium">{thisRoute.name}</h3>

      <p className="text-muted-foreground text-sm mt-1">
        {thisLobby.startTime.getTime()}
      </p>

      <p className="text-muted-foreground text-sm mt-2">{}</p>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-muted-foreground">
          {thisLobby.numPlayers}/{thisLobby.maxPlayers} runners
        </span>

        <span className="text-primary font-medium">{thisRoute.distance}</span>
      </div>

      {/* VIEW DETAILS LABEL */}
      <p className="mt-3 text-sm text-primary font-medium">View details →</p>
    </div>
  );
}
