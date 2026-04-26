import { CheckCircle } from "lucide-react";
import type { RunRoute, RunGroup } from "../types/runTypes";

interface LobbyCardProps {
  isJoined?: boolean;
  thisRoute: RunRoute;
  thisLobby: RunGroup;
  onClick?: () => void;
}

export function LobbyCard({
  thisRoute,
  thisLobby,
  onClick,
  isJoined,
}: LobbyCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-card border border-border rounded-lg p-4 hover:opacity-90 transition-opacity cursor-pointer"
    >
      {isJoined && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
          <CheckCircle className="w-3.5 h-3.5" />
          Joined
        </div>
      )}

      <h3 className="text-card-foreground font-medium pr-16">
        {thisRoute.name}
      </h3>

      <p className="text-muted-foreground text-sm mt-1">
        {thisLobby.startTime.toLocaleString()}
      </p>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-muted-foreground">
          {thisLobby.playerIds.length}/{thisLobby.maxPlayers} runners
        </span>
        <span className="text-primary font-medium">
          {thisRoute.distance} km
        </span>
      </div>

      <p className="mt-3 text-sm text-primary font-medium">View details →</p>
    </div>
  );
}
