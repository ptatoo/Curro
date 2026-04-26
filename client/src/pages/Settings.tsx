import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Calendar, Clock, Pencil, X } from "lucide-react";

type Settings = {
  location: string;
  distanceGoal: string;
  paceGoal: string;
  runsPerWeek: string;
};

type Unit = "km" | "mi";

function kmToMi(km: number) {
  return (km * 0.621371).toFixed(1);
}

function miToKm(mi: number) {
  return (mi / 0.621371).toFixed(1);
}

function paceKmToMi(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) * 0.621371;
  const newMins = Math.floor(totalSecs / 60);
  const newSecs = Math.round(totalSecs % 60);
  return `${newMins}:${String(newSecs).padStart(2, "0")}`;
}

function paceMiToKm(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) / 0.621371;
  const newMins = Math.floor(totalSecs / 60);
  const newSecs = Math.round(totalSecs % 60);
  return `${newMins}:${String(newSecs).padStart(2, "0")}`;
}

export default function Settings() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [unit, setUnit] = useState<Unit>("km");

  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    distanceGoal: "25",
    paceGoal: "5:30",
    runsPerWeek: "3",
  });

  const [draft, setDraft] = useState<Settings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(draft);
    setIsEditing(false);
  };

  const handleOpenEdit = () => {
    setDraft(settings);
    setIsEditing(true);
  };

  const toggleUnit = () => {
    if (unit === "km") {
      setUnit("mi");
      setSettings((s) => ({
        ...s,
        distanceGoal: kmToMi(parseFloat(s.distanceGoal)),
        paceGoal: paceKmToMi(s.paceGoal),
      }));
      setDraft((d) => ({
        ...d,
        distanceGoal: kmToMi(parseFloat(d.distanceGoal)),
        paceGoal: paceKmToMi(d.paceGoal),
      }));
    } else {
      setUnit("km");
      setSettings((s) => ({
        ...s,
        distanceGoal: miToKm(parseFloat(s.distanceGoal)),
        paceGoal: paceMiToKm(s.paceGoal),
      }));
      setDraft((d) => ({
        ...d,
        distanceGoal: miToKm(parseFloat(d.distanceGoal)),
        paceGoal: paceMiToKm(d.paceGoal),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
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
                  className={`px-3 py-2 transition-colors ${
                    unit === "km"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  km
                </button>
                <div className="w-px h-full bg-border" />
                <button
                  onClick={() => unit !== "mi" && toggleUnit()}
                  className={`px-3 py-2 transition-colors ${
                    unit === "mi"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
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
                <p className="text-foreground font-medium">{settings.distanceGoal} {unit} / week</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Pace Goal</p>
                <p className="text-foreground font-medium">{settings.paceGoal} / {unit}</p>
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
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-1 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Preferences</h2>

            <form onSubmit={handleSave} className="space-y-5">

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>

              {/* Distance Goal */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Target className="w-4 h-4" />
                  Distance Goal (per week)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={draft.distanceGoal}
                    onChange={(e) => setDraft({ ...draft, distanceGoal: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="25"
                    required
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">{unit} / week</span>
                </div>
              </div>

              {/* Pace Goal */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Clock className="w-4 h-4" />
                  Pace Goal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={draft.paceGoal.split(":")[0] ?? ""}
                    onChange={(e) => {
                      const secs = draft.paceGoal.split(":")[1] ?? "00";
                      setDraft({ ...draft, paceGoal: `${e.target.value}:${secs}` });
                    }}
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="5"
                    required
                  />
                  <span className="text-muted-foreground">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={draft.paceGoal.split(":")[1] ?? ""}
                    onChange={(e) => {
                      const mins = draft.paceGoal.split(":")[0] ?? "0";
                      const secs = e.target.value.padStart(2, "0");
                      setDraft({ ...draft, paceGoal: `${mins}:${secs}` });
                    }}
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="30"
                    required
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">/ {unit}</span>
                </div>
              </div>

              {/* Runs Per Week */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Runs Per Week
                </label>
                <select
                  value={draft.runsPerWeek}
                  onChange={(e) => setDraft({ ...draft, runsPerWeek: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {["1","2","3","4","5","6","7"].map((n) => (
                    <option key={n} value={n}>{n} run{n !== "1" ? "s" : ""} per week</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
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