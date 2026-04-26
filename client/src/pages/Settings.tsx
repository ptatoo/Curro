import { useState } from "react";
import { PrefetchPageLinks, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Target,
  Calendar,
  Clock,
  Pencil,
  X,
} from "lucide-react";
import { useUnit } from "../context/UnitContext";
import { useUser } from "../context/UserContext";
import type { UserProfile } from "../types/authTypes";
import PlaceAutocomplete from "../components/PlaceAutocomplete";

const MI_TO_KM = 1.60934;

type Settings = {
  location: string;
  distanceGoalKm: number; // always stored in km internally
  paceGoalPerKm: string; // always stored as min/km internally
  runsPerWeek: string;
};

// Helpers
function kmToMi(km: number) {
  return km * 0.621371;
}
function miToKm(mi: number) {
  return mi / 0.621371;
}
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
  const { profile, setProfile } = useUser();

  // Draft uses display unit for the input fields
  const [draftProfile, setDraftProfile] = useState({
    location: profile?.location || "",
    minDist: profile?.minDistance || 0,
    maxDist: profile?.maxDistance || 0,
    minPace: profile?.minPace || 0,
    maxPace: profile?.maxPace || 0,
  });

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const minDistKm =
      unit === "km"
        ? draftProfile.minDist
        : Math.round(miToKm(draftProfile.minDist) * 10) / 10;

    const maxDistKm =
      unit === "km"
        ? draftProfile.maxDist
        : Math.round(miToKm(draftProfile.maxDist) * 10) / 10;
    setProfile((profilePrev) => {
      if (!profilePrev) return null;
      return {
        ...profilePrev,
        location: draftProfile.location,
        minDistance: minDistKm,
        maxDistance: maxDistKm,
        minPace: draftProfile.minPace,
        maxPace: draftProfile.maxPace,
      } as UserProfile;
    });

    // 3. Update the Local Draft State (to keep it in sync)
    setDraftProfile((prev) => ({
      ...prev,
      minDist: minDistKm,
      maxDist: maxDistKm,
      minPace: draftProfile.minPace,
      maxPace: draftProfile.maxPace,
    }));
    setIsEditing(false);
  };

  const setLocation = (location: string) => {
    setDraftProfile((prev) => {
      return { ...prev, location: location };
    });
  };

  const secondsToMinSec = (totalSeconds: number) => {
    // 1. If unit is miles, we scale the pace (seconds per km -> seconds per mile)
    // A 5:00/km pace becomes ~8:03/mi
    const adjustedSeconds =
      unit === "mi" ? Math.round(totalSeconds * MI_TO_KM) : totalSeconds;

    const min = Math.floor(adjustedSeconds / 60);
    const sec = adjustedSeconds % 60;

    return { min, sec };
  };

  const toTotalSeconds = (min: number, sec: number) => {
    const total = min * 60 + sec;

    // 2. If the user is typing in 'Miles' mode, we must convert BACK
    // to 'Seconds per KM' before saving to the database/state.
    return unit === "mi" ? Math.round(total / MI_TO_KM) : total;
  };

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
                onClick={handleOpenEdit}
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
                  {profile && profile.location
                    ? profile.location
                    : "No location available."}
                </p>
              </div>
            </div>
            {/* Distances */}
            <div className="flex flex-row gap-10">
              <div className="flex items-center gap-3 w-3/12">
                <Target className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Min Distance
                  </p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? unit === "mi"
                        ? kmToMi(profile.minDistance).toFixed(1)
                        : profile.minDistance
                      : "No distance available."}{" "}
                    {unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-3/12">
                <Target className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Max Distance
                  </p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? unit === "mi"
                        ? kmToMi(profile.maxDistance).toFixed(1)
                        : profile.maxDistance
                      : "No distance available."}{" "}
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
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Min Pace
                  </p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? `${secondsToMinSec(profile.minPace).min}:${String(secondsToMinSec(profile.minPace).sec).padStart(2, "0")}`
                      : "No Pace available."}{" "}
                    / {unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3  w-3/12">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Max Pace
                  </p>
                  <p className="text-foreground font-medium">
                    {profile
                      ? `${secondsToMinSec(profile.maxPace).min}:${String(secondsToMinSec(profile.maxPace).sec).padStart(2, "0")}`
                      : "No Pace available."}{" "}
                    / {unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal --- */}
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
              {/* Location Input */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <PlaceAutocomplete onPlaceSelect={setLocation} />
              </div>
              {/* Distance Input */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Target className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-muted-foreground">
                    Distance
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={draftProfile.minDist}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        minDist: Number(e.target.value),
                      })
                    }
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    {unit}
                  </span>

                  <span className="font-semibold text-muted-foreground text-m whitespace-nowrap px-2">
                    to
                  </span>
                  <input
                    type="number"
                    value={draftProfile.maxDist}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        maxDist: Number(e.target.value),
                      })
                    }
                    className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Pace Input */}
              <div>
                <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
                  <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-muted-foreground">
                    Pace
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={secondsToMinSec(draftProfile.minPace).min}
                    onChange={(e) => {
                      const { sec } = secondsToMinSec(draftProfile.minPace);
                      const newTotal = toTotalSeconds(
                        Number(e.target.value),
                        sec,
                      );
                      setDraftProfile({ ...draftProfile, minPace: newTotal });
                    }}
                    className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    :
                  </span>

                  <input
                    type="number"
                    value={secondsToMinSec(draftProfile.minPace).sec}
                    onChange={(e) => {
                      const { min } = secondsToMinSec(draftProfile.minPace);
                      const newTotal = toTotalSeconds(
                        min,
                        Number(e.target.value),
                      );
                      setDraftProfile({ ...draftProfile, minPace: newTotal });
                    }}
                    className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    {unit}
                  </span>

                  <span className="font-semibold text-muted-foreground text-m whitespace-nowrap px-2">
                    to
                  </span>
                  <input
                    type="number"
                    value={secondsToMinSec(draftProfile.maxPace).min}
                    onChange={(e) => {
                      const { sec } = secondsToMinSec(draftProfile.maxPace);
                      const newTotal = toTotalSeconds(
                        Number(e.target.value),
                        sec,
                      );
                      setDraftProfile({ ...draftProfile, maxPace: newTotal });
                    }}
                    className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    :
                  </span>

                  <input
                    type="number"
                    value={secondsToMinSec(draftProfile.maxPace).sec}
                    onChange={(e) => {
                      const { min } = secondsToMinSec(draftProfile.maxPace);
                      const newTotal = toTotalSeconds(
                        min,
                        Number(e.target.value),
                      );
                      setDraftProfile({ ...draftProfile, maxPace: newTotal });
                    }}
                    className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    {unit}
                  </span>
                </div>
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
