import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Calendar, Clock } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [distanceGoal, setDistanceGoal] = useState("");
  const [paceGoal, setPaceGoal] = useState("");
  const [runsPerWeek, setRunsPerWeek] = useState("3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-foreground">Settings</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-card-foreground mb-6">Personal Preferences</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-card-foreground mb-2">
                <MapPin className="w-5 h-5" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., New York, NY"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2">
                  <Target className="w-5 h-5" />
                  Distance Goal (per week)
                </label>
                <input
                  type="text"
                  value={distanceGoal}
                  onChange={(e) => setDistanceGoal(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 25 km"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2">
                  <Clock className="w-5 h-5" />
                  Pace Goal
                </label>
                <input
                  type="text"
                  value={paceGoal}
                  onChange={(e) => setPaceGoal(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 5:30/km"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-card-foreground mb-2">
                <Calendar className="w-5 h-5" />
                Runs Per Week
              </label>
              <select
                value={runsPerWeek}
                onChange={(e) => setRunsPerWeek(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">1 run per week</option>
                <option value="2">2 runs per week</option>
                <option value="3">3 runs per week</option>
                <option value="4">4 runs per week</option>
                <option value="5">5 runs per week</option>
                <option value="6">6 runs per week</option>
                <option value="7">7 runs per week</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}