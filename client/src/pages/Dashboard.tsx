import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, History, TrendingUp, MapPin, Clock, Footprints } from "lucide-react";

// Use curly braces because these files use "export function" instead of "export default"
import { WelcomeSection } from "../components/WelcomeSection";
import { StatsCard } from "../components/StatsCard";
import RunProgressChart from "../components/RunProgressChart";

export default function Dashboard() {
  const navigate = useNavigate();

  const weeklyData = [
    { id: "mon", date: "Mon", distance: 5.2 },
    { id: "tue", date: "Tue", distance: 0 },
    { id: "wed", date: "Wed", distance: 7.8 },
    { id: "thu", date: "Thu", distance: 0 },
    { id: "fri", date: "Fri", distance: 10.5 },
    { id: "sat", date: "Sat", distance: 0 },
    { id: "sun", date: "Sun", distance: 6.3 }
  ];

  // YOU MUST HAVE THIS RETURN STATEMENT
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-foreground font-bold text-xl">RunTogether</h2>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <SettingsIcon className="w-6 h-6 text-foreground" />
          </button>
        </div>

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

        <div className="mt-8">
          <button
            onClick={() => navigate("/lobbies")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <History className="w-5 h-5" />
            Previous Runs
          </button>
        </div>
      </div>
    </div>
  );
}