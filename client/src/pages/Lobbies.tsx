import { ArrowLeft, Plus } from "lucide-react";
import { LobbyCard } from "../components/LobbyCard";
import { useNavigate } from "react-router-dom";
import { useRuns } from "../context/RunContext";
import type { RunGroup, RunRoute } from "../types/runTypes";
import { useEffect } from "react";
import StaticRouteMap from "../components/RouteMap";
import { APIProvider } from "@vis.gl/react-google-maps";
import { route1, route2 } from "../services/routes";

export default function Lobbies() {
  const navigate = useNavigate();
  const { publicRuns, privateRuns, runRoutes, addRoute, addRun } = useRuns();

  useEffect(() => {
    addRun({
      id: 1,
      creatorId: "alex id of doom",
      routeId: 1,
      startTime: new Date(),
      targetPace: 10.6789,
      maxPlayers: 20,
      numPlayers: 0,
      isPrivate: false,
      status: "open",
    } as RunGroup);
    addRun({
      id: 2,
      creatorId: "alex id of doom",
      startTime: new Date(),
      routeId: 2,
      targetPace: 7.6789,
      maxPlayers: 10,
      numPlayers: 4,
      isPrivate: false,
      status: "open",
    } as RunGroup);
  }, [publicRuns]);
  useEffect(() => {
    addRoute({
      id: 1,
      name: "Morning 5K Run",
      route: JSON.stringify(route1),
      distance: 5,
    } as RunRoute);
    addRoute({
      id: 2,
      name: "Evening Trail Run",
      route: JSON.stringify(route2),
      distance: 2,
    } as RunRoute);
  }, [runRoutes]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>

          <button
            onClick={() => navigate("/lobby/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Create Lobby
          </button>
        </div>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <StaticRouteMap />
        </APIProvider>

        {/* Lobbies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicRuns.map((lobby, index) => {
            const thisRoute = runRoutes.find((r) => r.id === lobby.routeId);
            if (!thisRoute) return;
            return (
              <LobbyCard
                key={index}
                thisRoute={thisRoute}
                thisLobby={lobby}
                onClick={() => navigate(`/lobby/${index}`, { state: lobby })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
