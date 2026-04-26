import { CheckCircle } from "lucide-react";

import type { RunRoute, RunGroup } from "../types/runTypes";

interface LobbyCardProps {
  name: string;
  location: string;
  time: string;
  participants: number;
  maxParticipants: number;
  distance: string;
  isJoined?: boolean;
  thisRoute: RunRoute;
  thisLobby: RunGroup;
  onClick?: () => void;
}

export function LobbyCard({
  name,
  location,
  time,
  participants,
  maxParticipants,
  distance,
  isJoined,
  onClick,
}: LobbyCardProps) {
export function LobbyCard({ thisRoute, thisLobby, onClick }: LobbyCardProps) {
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

      <h3 className="text-card-foreground font-medium pr-16">{name}</h3>
      <h3 className="text-card-foreground font-medium">{thisRoute.name}</h3>

      <p className="text-muted-foreground text-sm mt-1">
        {thisLobby.startTime.getTime()}
      </p>

      <p className="text-muted-foreground text-sm mt-2">{}</p>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-muted-foreground">
          {thisLobby.numPlayers}/{thisLobby.maxPlayers} runners
        </span>
        <span className="text-primary font-medium">{distance}</span>

        <span className="text-primary font-medium">{thisRoute.distance}</span>
      </div>

      <p className="mt-3 text-sm text-primary font-medium">View details →</p>
      {/* VIEW DETAILS LABEL */}
      <p className="mt-3 text-sm text-primary font-medium">View details →</p>
    </div>
  );
}
