import React from "react";
import { useEffect } from "react";
import { useRuns } from "../context/RunContext";
import type { Lobby, RunRoute } from "../types/runTypes";
import { route1, route2, route3, route4, route7 } from "../services/routes";

const LobbyRouterCreater = () => {
  const { publicRuns, addRoute, addRun } = useRuns();

  useEffect(() => {
  addRun({
    id: "1",
    creatorId: "123456789",
    routeId: "1",
    startTime: new Date("2026-04-27T06:30:00"),
    targetPace: 10.6789,
    maxPlayers: 20,
    playerIds: ["17", "38"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "2",
    creatorId: "124356789",
    startTime: new Date("2026-04-27T18:00:00"),
    routeId: "2",
    targetPace: 7.6789,
    maxPlayers: 10,
    playerIds: ["17", "38", "57"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "3",
    creatorId: "124356789",
    startTime: new Date("2026-04-28T19:00:00"),
    routeId: "3",
    targetPace: 8.30,
    maxPlayers: 10,
    playerIds: ["12", "14", "22", "67", "76"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "4",
    creatorId: "124356789",
    startTime: new Date("2026-04-28T07:30:00"),
    routeId: "4",
    targetPace: 9.30,
    maxPlayers: 10,
    playerIds: ["11", "21", "25", "68", "80"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "5",
    creatorId: "124356789",
    startTime: new Date("2026-04-29T06:00:00"),
    routeId: "5",
    targetPace: 10,
    maxPlayers: 10,
    playerIds: ["1", "12", "23", "44"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "6",
    creatorId: "124356789",
    startTime: new Date("2026-04-29T16:00:00"),
    routeId: "6",
    targetPace: 7.5,
    maxPlayers: 10,
    playerIds: ["2", "4", "13", "26", "37", "46", "55", "64", "92"],
    isPrivate: false,
    status: "open",
  } as Lobby);
  addRun({
    id: "7",
    creatorId: "124356789",
    startTime: new Date("2026-04-30T08:00:00"),
    routeId: "7",
    targetPace: 8,
    maxPlayers: 10,
    playerIds: ["5", "7", "11", "28", "39", "40", "52"],
    isPrivate: false,
    status: "open",
  } as Lobby);
}, []); // Changed dependency to empty array to prevent infinite loops if addRun updates publicRuns

  useEffect(() => {
    addRoute({
      id: 1,
      name: "Morning Run to Beach",
      route: route1,
      distance: 6,
    } as RunRoute);
    addRoute({
      id: 2,
      name: "Evening Run to Beach",
      route: route1,
      distance: 6,
    } as RunRoute);
    addRoute({
      id: 3,
      name: "Evening Trail Run",
      route: route2,
      distance: 6.4,
    } as RunRoute);
    addRoute({
      id: 4,
      name: "Morning Park Run",
      route: route2,
      distance: 6.4,
    } as RunRoute);
    addRoute({
      id: 5,
      name: "Morning Run to Santa Monica",
      route: route3,
      distance: 9.6,
    } as RunRoute);
    addRoute({
      id: 6,
      name: "Afternoon Run to Sawtelle",
      route: route4,
      distance: 4.8,
    } as RunRoute);
    addRoute({
      id: 7,
      name: "UCLA Campus Loop",
      route: route7,
      distance: 4.1,
    } as RunRoute);
  }, []);

  return <div></div>;
};

export default LobbyRouterCreater;