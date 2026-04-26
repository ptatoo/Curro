import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MapPin,
  Route,
  Calendar,
  Lock,
  Globe,
} from "lucide-react";

export interface LobbyData {
  name: string;
  location: string;
  route: string;
  date: string;
  time: string;
  maxParticipants: number;
  distance: string;
  isPublic: boolean;
  description: string;
}

export default function CreateLobby() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [distance, setDistance] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLobby: LobbyData = {
      name,
      location,
      route,
      date,
      time,
      maxParticipants: parseInt(maxParticipants),
      distance,
      isPublic,
      description,
    };

    // TEMP: just log for now
    console.log("Created lobby:", newLobby);

    // go back to lobby list
    navigate("/lobbies", { state: newLobby });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/lobbies")}
          className="p-2 hover:bg-accent rounded-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <h1 className="text-foreground mb-4">Create New Lobby</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg">

          <input
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Location"
            className="w-full p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            placeholder="Route"
            className="w-full p-2 border rounded"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full p-2 border rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <input
            placeholder="Distance (e.g. 5km)"
            className="w-full p-2 border rounded"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />

          <button className="w-full bg-primary text-white py-2 rounded">
            Create Lobby
          </button>

        </form>
      </div>
    </div>
  );
}