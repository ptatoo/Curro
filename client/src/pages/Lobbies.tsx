import { ArrowLeft, Plus, X, CheckCircle, Trash2, Map } from "lucide-react";
import { LobbyCard } from "../components/LobbyCard";
import { useNavigate } from "react-router-dom";
import { useRuns } from "../context/RunContext";
import type { RunGroup, RunRoute } from "../types/runTypes";
import { useEffect, useState } from "react";
import StaticRouteMap from "../components/RouteMap";
import { route3 } from "../services/routes";
import { useUser } from "../context/UserContext";

export default function Lobbies() {
  const navigate = useNavigate();
  const {
    publicRuns,
    runRoutes,
    myPrivateRuns,
    myPublicRuns,
    setPublicRuns,
    setPrivateRuns,
    addRoute,
    addRun,
    removeRun,
  } = useRuns();
  const { profile } = useUser();

  const [selectedLobby, setSelectedLobby] = useState<RunGroup | null>(null);

  const isJoined = (run: RunGroup): boolean => {
    if (!profile) return false;
    const exists = myPrivateRuns.find((r) => r.id === run.id);
    if (exists) return true;
    const exists2 = myPublicRuns.find((r) => r.id === run.id);
    if (exists2) return true;
    return false;
  };
  const isOwner = (run: RunGroup): boolean => {
    if (!profile) return false;
    return run.creatorId === profile.uid;
  };

  const handleJoin = (run: RunGroup) => {
    if (!profile?.uid) return;

    if (!isJoined(run)) {
      const setter = run.isPrivate ? setPrivateRuns : setPublicRuns;

      setter((prevRuns: RunGroup[]) => {
        return prevRuns.map((r) => {
          if (r.id === run.id) {
            return {
              ...r,
              playerIds: [...r.playerIds, profile.uid],
            };
          }
          // Return others unchanged
          return r;
        });
      });
    }
    setSelectedLobby(null);
  };

  //leave a runGroup
  const handleLeave = (run: RunGroup) => {
    if (!profile?.uid) return;

    if (isJoined(run)) {
      const setter = run.isPrivate ? setPrivateRuns : setPublicRuns;

      setter((prevRuns: RunGroup[]) => {
        return prevRuns.map((r) => {
          if (r.id === run.id) {
            return {
              ...r,
              playerIds: r.playerIds.filter((id) => id !== profile.uid),
            };
          }
          return r;
        });
      });
    }

    setSelectedLobby(null);
  };
  //add default functions
  const handleDelete = (run: RunGroup) => {
    removeRun(run.id);
    setSelectedLobby(null);
  };

  useEffect(() => {
    addRun({
      id: 1,
      creatorId: 123456789,
      routeId: 1,
      startTime: new Date(),
      targetPace: 10.6789,
      maxPlayers: 20,
      playerIds: [17, 38],
      isPrivate: false,
      status: "open",
    } as RunGroup);
    addRun({
      id: 2,
      creatorId: 124356789,
      startTime: new Date(),
      routeId: 2,
      targetPace: 7.6789,
      maxPlayers: 10,
      playerIds: [17, 38, 57],
      isPrivate: false,
      status: "open",
    } as RunGroup);
  }, [publicRuns]);
  useEffect(() => {
    addRoute({
      id: 1,
      name: "Morning 5K Run",
      route: route3,
      distance: 5,
    } as RunRoute);
    addRoute({
      id: 2,
      name: "Evening Trail Run",
      route: route3,
      distance: 2,
    } as RunRoute);
  }, []);

  const availableRuns = publicRuns.filter((r) => !isOwner(r));
  const selectedRoute = selectedLobby
    ? runRoutes.find((r) => r.id === selectedLobby.routeId)
    : null;

  console.log(selectedRoute);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
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
        {myPublicRuns.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">My Runs</h2>
            <div className="flex flex-col gap-3">
              {myPublicRuns.map((run) => {
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
                    {isOwner(run) ? (
                      <button
                        onClick={() => handleDelete(run)}
                        className="text-sm text-destructive hover:opacity-70 transition-opacity ml-4"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLeave(run)}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors ml-4"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Available Runs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableRuns.map((lobby, index) => {
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

      {selectedLobby && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setSelectedLobby(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-5 max-w-md w-full mx-4 relative overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLobby(null)}
              className="absolute top-4 right-4 p-1 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-bold mb-4 pr-8">
              {selectedRoute?.name ?? "Run Details"}
            </h2>

            <div className="bg-background border border-border rounded-lg p-4 space-y-2 mb-4">
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
                <b>Participants:</b> {selectedLobby.playerIds.length} /{" "}
                {selectedLobby.maxPlayers}
              </p>
            </div>

            <div className="w-full h-32 bg-muted border border-border rounded-lg mb-4 flex flex-col items-center justify-center gap-2">
              <Map className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Map unavailable</p>
            </div>

            {isOwner(selectedLobby) ? (
              <button
                onClick={() => handleDelete(selectedLobby)}
                className="w-full py-3 border border-destructive text-destructive font-semibold rounded-xl hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Cancel Run
              </button>
            ) : isJoined(selectedLobby) ? (
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
