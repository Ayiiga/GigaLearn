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
import type { LocationPermission, NavEndpoint, ResolvedAddress } from "@/lib/geo/types";
import { SAMPLE_REPORTS } from "@/content/smart-map/reports";

interface LocationMeta {
  accuracyM: number | null;
  speedMps: number | null;
  updatedAt: number | null;
  source: "gps" | "manual" | "none";
}

interface MapState extends UserMapPreferences {
  countryCode: string;
  userLocation: Coordinates | null;
  locationPermission: LocationPermission;
  locationMeta: LocationMeta;
  resolvedAddress: ResolvedAddress | null;
  selectedPlaceId: string | null;
  activeCategory: PlaceCategory | "all";
  travelMode: TravelMode;
  destination: Place | null;
  navOrigin: NavEndpoint | null;
  navDestination: NavEndpoint | null;
  homeLocation: NavEndpoint | null;
  workLocation: NavEndpoint | null;
  recentPlaces: NavEndpoint[];
  pickOnMapMode: "origin" | "destination" | null;
  followUser: boolean;
  reports: CommunityReport[];
  searchQuery: string;
  sosActive: boolean;
  aiOpen: boolean;
  setCountryCode: (code: string) => void;
  setUserLocation: (coords: Coordinates | null) => void;
  setLocationPermission: (permission: LocationPermission) => void;
  setLocationMeta: (meta: Partial<LocationMeta>) => void;
  setResolvedAddress: (address: ResolvedAddress | null) => void;
  setSelectedPlaceId: (id: string | null) => void;
  setActiveCategory: (category: PlaceCategory | "all") => void;
  setTravelMode: (mode: TravelMode) => void;
  setDestination: (place: Place | null) => void;
  setNavOrigin: (endpoint: NavEndpoint | null) => void;
  setNavDestination: (endpoint: NavEndpoint | null) => void;
  setHomeLocation: (endpoint: NavEndpoint | null) => void;
  setWorkLocation: (endpoint: NavEndpoint | null) => void;
  addRecentPlace: (endpoint: NavEndpoint) => void;
  setPickOnMapMode: (mode: "origin" | "destination" | null) => void;
  setFollowUser: (follow: boolean) => void;
  setSearchQuery: (q: string) => void;
  setMapStyle: (style: MapStyle) => void;
  toggleSavedPlace: (id: string) => void;
  setSosActive: (active: boolean) => void;
  setAiOpen: (open: boolean) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  setSafetyModes: (
    modes: Partial<Pick<UserMapPreferences, "womenSafetyMode" | "childSafetyMode" | "touristSafetyMode">>,
  ) => void;
  setMedical: (bloodGroup?: string, medicalNotes?: string) => void;
  addReport: (report: CommunityReport) => void;
  setVoiceNav: (on: boolean) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      countryCode: "GH",
      userLocation: null,
      locationPermission: "unknown",
      locationMeta: { accuracyM: null, speedMps: null, updatedAt: null, source: "none" },
      resolvedAddress: null,
      selectedPlaceId: null,
      activeCategory: "all",
      travelMode: "driving",
      destination: null,
      navOrigin: null,
      navDestination: null,
      homeLocation: null,
      workLocation: null,
      recentPlaces: [],
      pickOnMapMode: null,
      followUser: true,
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
      setLocationPermission: (permission) => set({ locationPermission: permission }),
      setLocationMeta: (meta) => set({ locationMeta: { ...get().locationMeta, ...meta } }),
      setResolvedAddress: (address) => set({ resolvedAddress: address }),
      setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setTravelMode: (mode) => set({ travelMode: mode }),
      setDestination: (place) => {
        set({ destination: place });
        if (place) {
          const endpoint: NavEndpoint = {
            id: place.id,
            label: place.name,
            coordinates: place.coordinates,
            source: "search",
            placeId: place.id,
            address: place.address,
          };
          set({ navDestination: endpoint });
          get().addRecentPlace(endpoint);
        }
      },
      setNavOrigin: (endpoint) => set({ navOrigin: endpoint }),
      setNavDestination: (endpoint) => {
        set({ navDestination: endpoint });
        if (endpoint) get().addRecentPlace(endpoint);
      },
      setHomeLocation: (endpoint) => set({ homeLocation: endpoint }),
      setWorkLocation: (endpoint) => set({ workLocation: endpoint }),
      addRecentPlace: (endpoint) => {
        const filtered = get().recentPlaces.filter((p) => p.id !== endpoint.id);
        set({ recentPlaces: [endpoint, ...filtered].slice(0, 12) });
      },
      setPickOnMapMode: (mode) => set({ pickOnMapMode: mode, followUser: mode == null }),
      setFollowUser: (follow) => set({ followUser: follow }),
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
        homeLocation: state.homeLocation,
        workLocation: state.workLocation,
        recentPlaces: state.recentPlaces,
      }),
    },
  ),
);
