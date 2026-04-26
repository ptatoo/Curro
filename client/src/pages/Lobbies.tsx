import { ArrowLeft, Plus, X, CheckCircle } from "lucide-react";
import { LobbyCard } from "../components/LobbyCard";
import { useNavigate } from "react-router-dom";
import { useRuns } from "../context/RunContext";
import type { RunGroup, RunRoute } from "../types/runTypes";
import { useEffect, useState } from "react";
import StaticRouteMap from "../components/RouteMap";
import { APIProvider } from "@vis.gl/react-google-maps";
import { route1, route2 } from "../services/routes";

export default function Lobbies() {
  const navigate = useNavigate();
  const { publicRuns, runRoutes, addRoute, addRun } = useRuns();

  const [selectedLobby, setSelectedLobby] = useState<RunGroup | null>(null);
  const [joinedRunIds, setJoinedRunIds] = useState<number[]>([]);

  const isJoined = (run: RunGroup) => joinedRunIds.includes(run.id);

  const handleJoin = (run: RunGroup) => {
    if (!isJoined(run)) setJoinedRunIds((prev) => [...prev, run.id]);
    setSelectedLobby(null);
  };

  const handleLeave = (run: RunGroup) => {
    setJoinedRunIds((prev) => prev.filter((id) => id !== run.id));
  };

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

  const joinedRuns = publicRuns.filter((r) => joinedRunIds.includes(r.id));
  const selectedRoute = selectedLobby
    ? runRoutes.find((r) => r.id === selectedLobby.routeId)
    : null;

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

        {/* My Runs Section */}
        {joinedRuns.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">My Runs</h2>
            <div className="flex flex-col gap-3">
              {joinedRuns.map((run) => {
                const route = runRoutes.find((r) => r.id === run.routeId);
                return (
                  <div
                    key={run.id}
                    className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">{route?.name ?? "Run"}</p>
                        <p className="text-sm text-muted-foreground">
                          {run.startTime.toLocaleString()} · {route?.distance}{" "}
                          km · pace {run.targetPace.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLeave(run)}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors ml-4"
                    >
                      Leave
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Runs */}
        <h2 className="text-lg font-semibold mb-3">Available Runs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicRuns.map((lobby, index) => {
            const thisRoute = runRoutes.find((r) => r.id === lobby.routeId);
            if (!thisRoute) return null;
            return (
              <LobbyCard
                key={index}
                thisRoute={thisRoute}
                thisLobby={lobby}
                isJoined={isJoined(lobby)}
                onClick={() => setSelectedLobby(lobby)}
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

            <h2 className="text-xl font-bold mb-6">
              {selectedRoute?.name ?? "Run Details"}
            </h2>

            <div className="bg-background border border-border rounded-lg p-6 space-y-3 mb-6">
              <p>
                <b>Distance:</b> {selectedRoute?.distance} km
              </p>
              <p>
                <b>Start Time:</b> {selectedLobby.startTime.toLocaleString()}
              </p>
              <p>
                <b>Pace:</b> {selectedLobby.targetPace.toFixed(1)} min/km
              </p>
              <p>
                <b>Participants:</b> {selectedLobby.numPlayers} /{" "}
                {selectedLobby.maxPlayers}
              </p>
            </div>

            {/* <StaticRouteMap
              route={selectedRoute?.route === null ? selectedRoute.route : "{}"}
            /> */}

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
