import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Calendar, Clock, Pencil, X } from "lucide-react";
import { useUnit } from "../context/UnitContext";

type Settings = {
  location: string;
  distanceGoal: number;  // stored in current unit
  paceGoal: number;      // stored in seconds, in current unit
  runsPerWeek: string;
  savedUnit: string;     // which unit was active when saved
};

function kmToMi(km: number) { return km * 0.621371; }
function miToKm(mi: number) { return mi / 0.621371; }
function secsToDisplay(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Settings() {
  const navigate = useNavigate();
  const { unit, setUnit } = useUnit();
  const [isEditing, setIsEditing] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    distanceGoal: 25,
    paceGoal: 330,
    runsPerWeek: "3",
    savedUnit: "km",
  });

  const [draftLocation, setDraftLocation] = useState(settings.location);
  const [draftDistance, setDraftDistance] = useState(settings.distanceGoal);
  const [draftPace, setDraftPace] = useState(settings.paceGoal);
  const [draftRuns, setDraftRuns] = useState(settings.runsPerWeek);

  const handleOpenEdit = () => {
    setDraftLocation(settings.location);
    // Convert saved values to current display unit
    const dist = settings.savedUnit === unit
      ? settings.distanceGoal
      : unit === "mi" ? kmToMi(settings.distanceGoal) : miToKm(settings.distanceGoal);
    const pace = settings.savedUnit === unit
      ? settings.paceGoal
      : unit === "mi" ? settings.paceGoal / 0.621371 : settings.paceGoal * 0.621371;
    setDraftDistance(dist);
    setDraftPace(pace);
    setDraftRuns(settings.runsPerWeek);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({
      location: draftLocation,
      distanceGoal: draftDistance,
      paceGoal: draftPace,
      runsPerWeek: draftRuns,
      savedUnit: unit,
    });
    setIsEditing(false);
  };

  const toggleUnit = () => setUnit(unit === "km" ? "mi" : "km");

  // Convert saved values to current display unit
  const displayDistance = settings.savedUnit === unit
    ? settings.distanceGoal
    : unit === "mi" ? kmToMi(settings.distanceGoal) : miToKm(settings.distanceGoal);

  const displayPace = settings.savedUnit === unit
    ? settings.paceGoal
    : unit === "mi" ? settings.paceGoal / 0.621371 : settings.paceGoal * 0.621371;

  const distanceMin = unit === "km" ? 1 : kmToMi(1);
  const distanceMax = unit === "km" ? 100 : kmToMi(100);
  const paceMin = unit === "km" ? 180 : 180 / 0.621371;
  const paceMax = unit === "km" ? 600 : 600 / 0.621371;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-foreground">Settings</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-card-foreground">Personal Preferences</h2>
            <div className="flex items-center gap-2">
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
                <p className="text-foreground font-medium">{displayDistance.toFixed(1)} {unit} / week</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Pace Goal</p>
                <p className="text-foreground font-medium">{secsToDisplay(displayPace)} / {unit}</p>
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

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setIsEditing(false)}>
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 p-1 hover:bg-accent rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-bold mb-6">Edit Preferences</h2>
            <form onSubmit={handleSave} className="space-y-6">

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
                  <Target className="w-4 h-4" /> Distance Goal — <span className="font-semibold text-primary">{draftDistance.toFixed(1)} {unit} / week</span>
                </label>
                <input
                  type="range"
                  min={distanceMin}
                  max={distanceMax}
                  step="0.5"
                  value={draftDistance}
                  onChange={(e) => setDraftDistance(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{distanceMin.toFixed(0)} {unit}</span>
                  <span>{distanceMax.toFixed(0)} {unit}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Clock className="w-4 h-4" /> Pace Goal — <span className="font-semibold text-primary">{secsToDisplay(draftPace)} / {unit}</span>
                </label>
                <input
                  type="range"
                  min={paceMin}
                  max={paceMax}
                  step="5"
                  value={draftPace}
                  onChange={(e) => setDraftPace(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{secsToDisplay(paceMin)} / {unit}</span>
                  <span>{secsToDisplay(paceMax)} / {unit}</span>
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