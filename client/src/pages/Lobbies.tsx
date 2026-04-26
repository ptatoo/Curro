import { ArrowLeft, Plus, X, CheckCircle } from "lucide-react";
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

      {/* Modal */}
      {selectedLobby && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setSelectedLobby(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLobby(null)}
              className="absolute top-4 right-4 p-1 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-bold mb-6">{selectedLobby.name}</h2>

            <div className="bg-background border border-border rounded-lg p-6 space-y-3 mb-6">
              <p><b>Location:</b> {selectedLobby.location}</p>
              <p><b>Time:</b> {selectedLobby.time}</p>
              <p><b>Distance:</b> {selectedLobby.distance}</p>
              <p><b>Participants:</b> {selectedLobby.participants} / {selectedLobby.maxParticipants}</p>
            </div>

            {isJoined(selectedLobby) ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle className="w-5 h-5" />
                  You've joined this run
                </div>
                <button
                  onClick={() => {
                    handleLeave(selectedLobby);
                    setSelectedLobby(null);
                  }}
                  className="w-full py-3 border border-destructive text-destructive font-semibold rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  Leave Run
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleJoin(selectedLobby)}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Join Run
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
