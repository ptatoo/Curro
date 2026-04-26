import { ArrowLeft, Plus } from "lucide-react";
import { LobbyCard } from "../components/LobbyCard";
import { useNavigate } from "react-router-dom";

export default function Lobbies() {
  const navigate = useNavigate();

  const lobbies = [
    {
      name: "Morning 5K Run",
      location: "Central Park",
      time: "Tomorrow, 7:00 AM",
      participants: 8,
      maxParticipants: 12,
      distance: "5.0 km",
    },
    {
      name: "Evening Trail Run",
      location: "Riverside Trail",
      time: "Today, 6:30 PM",
      participants: 5,
      maxParticipants: 10,
      distance: "8.5 km",
    },
  ];

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

        {/* Lobbies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lobbies.map((lobby, index) => (
            <LobbyCard
              key={index}
              {...lobby}
              onClick={() =>
                navigate(`/lobby/${index}`, { state: lobby })
              }
            />
          ))}
        </div>

      </div>
    </div>
  );
}