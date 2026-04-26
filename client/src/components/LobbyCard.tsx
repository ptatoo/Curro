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
      className="relative bg-card border border-border rounded-lg p-4 hover:opacity-90 transition-opacity cursor-pointer flex gap-4"
    >
      {/* Distance block on the right */}
      <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-4 py-2 min-w-[80px] shrink-0">
        <span className="text-primary font-bold text-2xl leading-none">{thisRoute.distance}</span>
        <span className="text-primary text-xs mt-1">km</span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {isJoined && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full w-fit mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Joined
          </div>
        )}

        <h3 className="text-card-foreground font-medium truncate">
          {thisRoute.name}
        </h3>

        <p className="text-muted-foreground text-sm mt-1">
          {thisLobby.startTime.toLocaleString()}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {thisLobby.playerIds.length}/{thisLobby.maxPlayers} runners
          </span>
          <span className="text-primary font-medium">View details →</span>
        </div>
      </div>
    </div>
  );
}