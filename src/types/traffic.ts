export type ApiMode = "auto" | "cycle_auto" | "set_manual" | "manual" | "yellow" | "vip" | "none";

export interface TrafficStatus {
  current_mode: ApiMode;
  vip_active: boolean;
  vip_lanes_green: string[] | null;
  inference_has: boolean;
}

export interface LaneTimings {
  lane1_time: number;
  lane2_time: number;
  lane3_time: number;
  lane4_time: number;
}

export interface CycleReportEntry {
  date: string;
  time: string;
  mode: string;
  lane: string;
  green_duration: number;
  total_vehicles: number;
  car: number;
  bus: number;
  truck: number;
  motorcycle: number;
  bicycle: number;
}

export interface ErrorResponse {
  error: string;
}
