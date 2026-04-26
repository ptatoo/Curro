import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LobbyDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const lobby = location.state as any;

  if (!lobby) {
    return (
      <div className="p-6">
        <p>No lobby data found.</p>
        <button
          className="mt-4 text-primary"
          onClick={() => navigate("/lobbies")}
        >
          Go back to lobbies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/lobbies")}
          className="p-2 hover:bg-accent rounded-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold mb-4">{lobby.name}</h1>

        {/* Info */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-2">
          <p><b>Location:</b> {lobby.location}</p>
          <p><b>Time:</b> {lobby.time}</p>
          <p><b>Distance:</b> {lobby.distance}</p>
          <p>
            <b>Participants:</b> {lobby.participants} / {lobby.maxParticipants}
          </p>
        </div>

      </div>
    </div>
  );
}