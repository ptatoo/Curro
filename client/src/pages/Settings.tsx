import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Target, Clock, Pencil } from "lucide-react";
import { useUnit } from "../context/UnitContext";
import { useUser } from "../context/UserContext";
import EditSettingsModal, { secondsToMinSec } from "./EditSettingsModal"; // Adjust import path

// Helpers
function kmToMi(km: number) {
  return km * 0.621371;
}

export default function Settings() {
  const navigate = useNavigate();
  const { unit, setUnit } = useUnit();
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useUser();

  const toggleUnit = () => setUnit(unit === "km" ? "mi" : "km");

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
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          {/* User Profile Display */}
          <div className="space-y-5">
            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                <p className="text-foreground font-medium">
                  {profile?.location ? profile.location : "N/A Location"}
                </p>
              </div>
            </div>
            {/* Distances */}
            <div className="flex flex-row gap-10">
              <div className="flex items-center gap-3 w-3/12">
                <Target className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Min Distance</p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? unit === "mi"
                        ? kmToMi(profile.minDistance).toFixed(1)
                        : profile.minDistance
                      : "N/A"}{" "}
                    {unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-3/12">
                <Target className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Max Distance</p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? unit === "mi"
                        ? kmToMi(profile.maxDistance).toFixed(1)
                        : profile.maxDistance
                      : "N/A"}{" "}
                    {unit}
                  </p>
                </div>
              </div>
            </div>
            {/* Paces */}
            <div className="flex flex-row gap-10">
              <div className="flex items-center gap-3 w-3/12">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Min Pace</p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? `${secondsToMinSec(profile.minPace, unit).min}:${String(secondsToMinSec(profile.minPace, unit).sec).padStart(2, "0")}`
                      : "N/A"}{" "}
                    / {unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-3/12">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Max Pace</p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? `${secondsToMinSec(profile.maxPace, unit).min}:${String(secondsToMinSec(profile.maxPace, unit).sec).padStart(2, "0")}`
                      : "N/A"}{" "}
                    / {unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <EditSettingsModal isOpen={isEditing} onClose={() => setIsEditing(false)} />
    </div>
  );
}