import React from "react";
import { useEffect } from "react";
import { useRuns } from "../context/RunContext";
import type { RunGroup, RunRoute } from "../types/runTypes";
import { route1, route3 } from "../services/routes";

const LobbyRouterCreater = () => {
  const { publicRuns, addRoute, addRun } = useRuns();

  useEffect(() => {
    addRun({
      id: 1,
      creatorId: 123456789,
      routeId: 1,
      startTime: new Date(),
      targetPace: 10.6789,
      maxPlayers: 20,
      playerIds: [17, 38],
      isPrivate: false,
      status: "open",
    } as RunGroup);
    addRun({
      id: 2,
      creatorId: 124356789,
      startTime: new Date(),
      routeId: 2,
      targetPace: 7.6789,
      maxPlayers: 10,
      playerIds: [17, 38, 57],
      isPrivate: false,
      status: "open",
    } as RunGroup);
  }, [publicRuns]);
  useEffect(() => {
    addRoute({
      id: 1,
      name: "Morning 5K Run",
      route: route3,
      distance: 5,
    } as RunRoute);
    addRoute({
      id: 2,
      name: "Evening Trail Run",
      route: route1,
      distance: 2,
    } as RunRoute);
  }, []);

  return <div></div>;
};

export default LobbyRouterCreater;
