import React, { useState, useEffect } from "react";
import { MapPin, Target, Clock, X } from "lucide-react";
import { useUnit } from "../context/UnitContext";
import { useUser } from "../context/UserContext";
import type { UserProfile } from "../types/authTypes";
import PlaceAutocomplete from "../components/PlaceAutocomplete";

const MI_TO_KM = 1.60934;

// Shared Helpers
function miToKm(mi: number) {
  return mi / 0.621371;
}

export const secondsToMinSec = (totalSeconds: number, unit: string) => {
  const adjustedSeconds =
    unit === "mi" ? Math.round(totalSeconds * MI_TO_KM) : totalSeconds;
  const min = Math.floor(adjustedSeconds / 60);
  const sec = adjustedSeconds % 60;
  return { min, sec };
};

export const toTotalSeconds = (min: number, sec: number, unit: string) => {
  const total = min * 60 + sec;
  return unit === "mi" ? Math.round(total / MI_TO_KM) : total;
};

type EditSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditSettingsModal({ isOpen, onClose }: EditSettingsModalProps) {
  const { unit } = useUnit();
  const { profile, updateProfile } = useUser();

  const [draftProfile, setDraftProfile] = useState({
    location: "",
    minDist: 0,
    maxDist: 0,
    minPace: 0,
    maxPace: 0,
  });

  // Reset draft state whenever the modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setDraftProfile({
        location: profile.location || "",
        minDist: profile.minDistance || 0,
        maxDist: profile.maxDistance || 0,
        minPace: profile.minPace || 0,
        maxPace: profile.maxPace || 0,
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

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

    const updates = {
        location: draftProfile.location,
        minDistance: minDistKm,
        maxDistance: maxDistKm,
        minPace: draftProfile.minPace,
        maxPace: draftProfile.maxPace,
    } as UserProfile;

    console.log(updates);

    updateProfile(updates);

    onClose();
  };

  const setLocation = (location: string) => {
    setDraftProfile((prev) => ({ ...prev, location }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
              <span className="font-semibold text-muted-foreground">Distance</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={draftProfile.minDist}
                onChange={(e) =>
                  setDraftProfile({ ...draftProfile, minDist: Number(e.target.value) })
                }
                className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">{unit}</span>
              <span className="font-semibold text-muted-foreground text-m whitespace-nowrap px-2">to</span>
              <input
                type="number"
                value={draftProfile.maxDist}
                onChange={(e) =>
                  setDraftProfile({ ...draftProfile, maxDist: Number(e.target.value) })
                }
                className="w-20 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">{unit}</span>
            </div>
          </div>

          {/* Pace Input */}
          <div>
            <label className="flex items-center gap-2 text-card-foreground mb-2 text-sm">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="font-semibold text-muted-foreground">Pace</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={secondsToMinSec(draftProfile.minPace, unit).min}
                onChange={(e) => {
                  const { sec } = secondsToMinSec(draftProfile.minPace, unit);
                  const newTotal = toTotalSeconds(Number(e.target.value), sec, unit);
                  setDraftProfile({ ...draftProfile, minPace: newTotal });
                }}
                className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">:</span>
              <input
                type="number"
                value={secondsToMinSec(draftProfile.minPace, unit).sec}
                onChange={(e) => {
                  const { min } = secondsToMinSec(draftProfile.minPace, unit);
                  const newTotal = toTotalSeconds(min, Number(e.target.value), unit);
                  setDraftProfile({ ...draftProfile, minPace: newTotal });
                }}
                className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">{unit}</span>
              <span className="font-semibold text-muted-foreground text-m whitespace-nowrap px-2">to</span>
              <input
                type="number"
                value={secondsToMinSec(draftProfile.maxPace, unit).min}
                onChange={(e) => {
                  const { sec } = secondsToMinSec(draftProfile.maxPace, unit);
                  const newTotal = toTotalSeconds(Number(e.target.value), sec, unit);
                  setDraftProfile({ ...draftProfile, maxPace: newTotal });
                }}
                className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">:</span>
              <input
                type="number"
                value={secondsToMinSec(draftProfile.maxPace, unit).sec}
                onChange={(e) => {
                  const { min } = secondsToMinSec(draftProfile.maxPace, unit);
                  const newTotal = toTotalSeconds(min, Number(e.target.value), unit);
                  setDraftProfile({ ...draftProfile, maxPace: newTotal });
                }}
                className="w-14 px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">{unit}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
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
  );
}