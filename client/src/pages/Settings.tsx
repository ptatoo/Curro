import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Calendar, Clock, Pencil, X } from "lucide-react";
import { useUnit } from "../context/UnitContext";

type Settings = {
  location: string;
  distanceGoalKm: number;   // always stored in km internally
  paceGoalPerKm: string;    // always stored as min/km internally
  runsPerWeek: string;
};

// Helpers
function kmToMi(km: number) { return (km * 0.621371); }
function miToKm(mi: number) { return (mi / 0.621371); }
function paceKmToMi(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) * 0.621371;
  const m = Math.floor(totalSecs / 60);
  const s = Math.round(totalSecs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function paceMiToKm(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) / 0.621371;
  const m = Math.floor(totalSecs / 60);
  const s = Math.round(totalSecs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Settings() {
  const navigate = useNavigate();
  const { unit, setUnit } = useUnit();
  const [isEditing, setIsEditing] = useState(false);

  // Master settings always stored in km
  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    distanceGoalKm: 25,
    paceGoalPerKm: "5:30",
    runsPerWeek: "3",
  });

  // Draft uses display unit for the input fields
  const [draftLocation, setDraftLocation] = useState(settings.location);
  const [draftDistanceDisplay, setDraftDistanceDisplay] = useState("");
  const [draftPaceDisplay, setDraftPaceDisplay] = useState("");
  const [draftRuns, setDraftRuns] = useState(settings.runsPerWeek);

  const handleOpenEdit = () => {
    setDraftLocation(settings.location);
    setDraftDistanceDisplay(
      unit === "km"
        ? settings.distanceGoalKm.toFixed(1)
        : kmToMi(settings.distanceGoalKm).toFixed(1)
    );
    setDraftPaceDisplay(
      unit === "km" ? settings.paceGoalPerKm : paceKmToMi(settings.paceGoalPerKm)
    );
    setDraftRuns(settings.runsPerWeek);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const distKm =
      unit === "km" ? parseFloat(draftDistanceDisplay) : miToKm(parseFloat(draftDistanceDisplay));
    const paceKm = unit === "km" ? draftPaceDisplay : paceMiToKm(draftPaceDisplay);
    setSettings({
      location: draftLocation,
      distanceGoalKm: distKm,
      paceGoalPerKm: paceKm,
      runsPerWeek: draftRuns,
    });
    setIsEditing(false);
  };

  const toggleUnit = () => setUnit(unit === "km" ? "mi" : "km");

  // Display values derived from canonical km values
  const displayDistance =
    unit === "km"
      ? settings.distanceGoalKm.toFixed(1)
      : kmToMi(settings.distanceGoalKm).toFixed(1);
  const displayPace =
    unit === "km" ? settings.paceGoalPerKm : paceKmToMi(settings.paceGoalPerKm);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-foreground">Settings</h1>
        </div>

        {/* View Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-card-foreground">Personal Preferences</h2>
            <div className="flex items-center gap-2">

              {/* Unit toggle */}
              <div className="flex items-center rounded-lg border border-border overflow-hidden text-sm font-medium">
                <button
                  onClick={() => unit !== "km" && toggleUnit()}
                  className={`px-3 py-2 transition-colors ${unit === "km" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
                >
                  km
                </button>
                <div className="w-px h-full bg-border" />
                <button
                  onClick={() => unit !== "mi" && toggleUnit()}
                  className={`px-3 py-2 transition-colors ${unit === "mi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
                >
                  mi
                </button>
              </div>

              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                <p className="text-foreground font-medium">{settings.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Distance Goal (per week)</p>
                <p className="text-foreground font-medium">{displayDistance} {unit} / week</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Pace Goal</p>
                <p className="text-foreground font-medium">{displayPace} / {unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Runs Per Week</p>
                <p className="text-foreground font-medium">{settings.runsPerWeek} runs per week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setIsEditing(false)}>
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 p-1 hover:bg-accent rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-bold mb-6">Edit Preferences</h2>
            <form onSubmit={handleSave} className="space-y-5">

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input
                  type="text"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Target className="w-4 h-4" /> Distance Goal (per week)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={draftDistanceDisplay}
                    onChange={(e) => setDraftDistanceDisplay(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">{unit} / week</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Clock className="w-4 h-4" /> Pace Goal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="0" max="59"
                    value={draftPaceDisplay.split(":")[0] ?? ""}
                    onChange={(e) => {
                      const secs = draftPaceDisplay.split(":")[1] ?? "00";
                      setDraftPaceDisplay(`${e.target.value}:${secs}`);
                    }}
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <span className="text-muted-foreground">:</span>
                  <input
                    type="number" min="0" max="59"
                    value={draftPaceDisplay.split(":")[1] ?? ""}
                    onChange={(e) => {
                      const mins = draftPaceDisplay.split(":")[0] ?? "0";
                      setDraftPaceDisplay(`${mins}:${e.target.value.padStart(2, "0")}`);
                    }}
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">/ {unit}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Calendar className="w-4 h-4" /> Runs Per Week
                </label>
                <select
                  value={draftRuns}
                  onChange={(e) => setDraftRuns(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {["1","2","3","4","5","6","7"].map((n) => (
                    <option key={n} value={n}>{n} run{n !== "1" ? "s" : ""} per week</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}