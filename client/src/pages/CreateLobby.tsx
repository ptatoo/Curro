import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRuns } from "../context/LobbyContext";
import { useUser } from "../context/UserContext";

export default function CreateLobby() {

  const navigate = useNavigate();
  const { addLobby, addRoute, publicRuns, runRoutes } = useRuns();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRouteId = (runRoutes.length > 0 ? Math.max(...runRoutes.map(r => r.id)) : 0) + 1;
    const newRunId = (publicRuns.length > 0 ? Math.max(...publicRuns.map(r => r.id)) : 0) + 1;

    addRoute({
      id: newRouteId,
      name,
      route: [],
      distance: parseFloat(distance) || 0,
    });

    addLobby({
      id: newRunId,
      creatorId: 1,
      routeId: newRouteId,
      startTime: new Date(`${date}T${time}`),
      targetPace: parseFloat(pace) || 0,
      maxPlayers: parseInt(maxParticipants),
      playerIds: [],
      isPrivate: false,
      status: "open",
    });

    navigate("/lobbies");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/lobbies")}
          className="p-2 hover:bg-accent rounded-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <h1 className="text-foreground mb-4">Create New Lobby</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg">
          <input
            placeholder="Run name (e.g. Morning 5K)"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <input
            placeholder="Distance (km)"
            type="number"
            step="0.1"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />

          <input
            placeholder="Target pace (min/km)"
            type="number"
            step="0.1"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            required
          />

          <input
            placeholder="Max participants"
            type="number"
            className="w-full p-2 border border-border rounded bg-input-background text-foreground"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />

          <button className="w-full bg-primary text-primary-foreground py-2 rounded">
            Create Lobby
          </button>
        </form>
      </div>
    </div>
  );
}