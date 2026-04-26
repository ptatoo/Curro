import { useNavigate } from "react-router-dom";
import { History, TrendingUp, MapPin, Clock, Footprints } from "lucide-react";

import { WelcomeSection } from "../components/WelcomeSection";
import { StatsCard } from "../components/StatsCard";
import RunProgressChart from "../components/RunProgressChart";

export default function Dashboard() {
  const navigate = useNavigate();

  const weeklyData = [
    { id: "sun", date: "S", distance: 0 },
    { id: "mon", date: "M", distance: 5.2 },
    { id: "tue", date: "T", distance: 0 },
    { id: "wed", date: "W", distance: 7.8 },
    { id: "thu", date: "R", distance: 0 },
    { id: "fri", date: "F", distance: 10.5 },
    { id: "sat", date: "S", distance: 6.3 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeSection userName="Alex" onClick={() => navigate("/lobbies")} />

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Total Distance" value="129.5 km" icon={<MapPin className="w-6 h-6" />} />
          <StatsCard label="Total Runs" value="24" icon={<Footprints className="w-6 h-6" />} />
          <StatsCard label="Avg Pace" value="5:32/km" icon={<TrendingUp className="w-6 h-6" />} />
          <StatsCard label="This Week" value="29.8 km" icon={<Clock className="w-6 h-6" />} />
        </div>

        <div className="mt-6">
          <RunProgressChart data={weeklyData} />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/lobbies")}
            className="flex items-center gap-2 px-16 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <History className="w-5 h-5" />
            Previous Runs
          </button>
        </div>
      </div>
    </div>
  );
}