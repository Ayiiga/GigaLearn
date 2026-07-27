"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CommunityReport,
  Coordinates,
  EmergencyContact,
  MapStyle,
  Place,
  PlaceCategory,
  TravelMode,
  UserMapPreferences,
} from "@/types/smart-map";
import { SAMPLE_REPORTS } from "@/content/smart-map/reports";

interface MapState extends UserMapPreferences {
  countryCode: string;
  userLocation: Coordinates | null;
  selectedPlaceId: string | null;
  activeCategory: PlaceCategory | "all";
  travelMode: TravelMode;
  destination: Place | null;
  reports: CommunityReport[];
  searchQuery: string;
  sosActive: boolean;
  aiOpen: boolean;
  setCountryCode: (code: string) => void;
  setUserLocation: (coords: Coordinates | null) => void;
  setSelectedPlaceId: (id: string | null) => void;
  setActiveCategory: (category: PlaceCategory | "all") => void;
  setTravelMode: (mode: TravelMode) => void;
  setDestination: (place: Place | null) => void;
  setSearchQuery: (q: string) => void;
  setMapStyle: (style: MapStyle) => void;
  toggleSavedPlace: (id: string) => void;
  setSosActive: (active: boolean) => void;
  setAiOpen: (open: boolean) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  setSafetyModes: (modes: Partial<Pick<UserMapPreferences, "womenSafetyMode" | "childSafetyMode" | "touristSafetyMode">>) => void;
  setMedical: (bloodGroup?: string, medicalNotes?: string) => void;
  addReport: (report: CommunityReport) => void;
  setVoiceNav: (on: boolean) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      countryCode: "GH",
      userLocation: null,
      selectedPlaceId: null,
      activeCategory: "all",
      travelMode: "driving",
      destination: null,
      reports: SAMPLE_REPORTS,
      searchQuery: "",
      sosActive: false,
      aiOpen: false,
      savedPlaceIds: [],
      favoriteRouteIds: [],
      emergencyContacts: [],
      womenSafetyMode: false,
      childSafetyMode: false,
      touristSafetyMode: false,
      bloodGroup: undefined,
      medicalNotes: undefined,
      mapStyle: "streets",
      voiceNav: true,
      setCountryCode: (code) => set({ countryCode: code }),
      setUserLocation: (coords) => set({ userLocation: coords }),
      setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setTravelMode: (mode) => set({ travelMode: mode }),
      setDestination: (place) => set({ destination: place }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setMapStyle: (style) => set({ mapStyle: style }),
      toggleSavedPlace: (id) => {
        const current = get().savedPlaceIds;
        set({
          savedPlaceIds: current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id],
        });
      },
      setSosActive: (active) => set({ sosActive: active }),
      setAiOpen: (open) => set({ aiOpen: open }),
      addEmergencyContact: (contact) =>
        set({ emergencyContacts: [...get().emergencyContacts, contact] }),
      removeEmergencyContact: (id) =>
        set({ emergencyContacts: get().emergencyContacts.filter((c) => c.id !== id) }),
      setSafetyModes: (modes) => set({ ...modes }),
      setMedical: (bloodGroup, medicalNotes) => set({ bloodGroup, medicalNotes }),
      addReport: (report) => set({ reports: [report, ...get().reports] }),
      setVoiceNav: (on) => set({ voiceNav: on }),
    }),
    {
      name: "smart-map-store",
      partialize: (state) => ({
        countryCode: state.countryCode,
        savedPlaceIds: state.savedPlaceIds,
        favoriteRouteIds: state.favoriteRouteIds,
        emergencyContacts: state.emergencyContacts,
        womenSafetyMode: state.womenSafetyMode,
        childSafetyMode: state.childSafetyMode,
        touristSafetyMode: state.touristSafetyMode,
        bloodGroup: state.bloodGroup,
        medicalNotes: state.medicalNotes,
        mapStyle: state.mapStyle,
        voiceNav: state.voiceNav,
        reports: state.reports,
      }),
    },
  ),
);
