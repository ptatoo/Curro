import { useNavigate } from "react-router-dom";
import { History, TrendingUp, MapPin, Clock, Footprints } from "lucide-react";

import { WelcomeSection } from "../components/WelcomeSection";
import { StatsCard } from "../components/StatsCard";
import RunProgressChart from "../components/RunProgressChart";
import { useUnit } from "../context/UnitContext";

export default function Dashboard() {
  
  const navigate = useNavigate();
  const { unit, formatDistance, formatPace, distanceLabel } = useUnit();

  // Raw data in km / min-per-km
  const totalDistanceKm = 129.5;
  const thisWeekKm = 29.8;
  const avgPacePerKm = "5:32";

  const weeklyDataKm = [
    { id: "sun", date: "S", distance: 0 },
    { id: "mon", date: "M", distance: 5.2 },
    { id: "tue", date: "T", distance: 0 },
    { id: "wed", date: "W", distance: 7.8 },
    { id: "thu", date: "R", distance: 0 },
    { id: "fri", date: "F", distance: 10.5 },
    { id: "sat", date: "S", distance: 6.3 },
  ];

  const weeklyData = weeklyDataKm.map((d) => ({
    ...d,
    distance: d.distance === 0 ? 0 : parseFloat(formatDistance(d.distance)),
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeSection userName="Alex" onClick={() => navigate("/lobbies")} />

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Total Distance"
            value={`${formatDistance(totalDistanceKm)} ${distanceLabel}`}
            icon={<MapPin className="w-6 h-6" />}
          />
          <StatsCard
            label="Total Runs"
            value="24"
            icon={<Footprints className="w-6 h-6" />}
          />
          <StatsCard
            label="Avg Pace"
            value={`${formatPace(avgPacePerKm)}/${distanceLabel}`}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatsCard
            label="This Week"
            value={`${formatDistance(thisWeekKm)} ${distanceLabel}`}
            icon={<Clock className="w-6 h-6" />}
          />
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