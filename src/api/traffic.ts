import { apiClient } from "./apiClient";
import { TrafficStatus, ApiMode, LaneTimings, CycleReportEntry } from "@/types/traffic";

// 1. Get real-time status of the GEM intelligent traffic lights
export const getStatusApi = async (): Promise<TrafficStatus> => {
  const response = await apiClient.get<TrafficStatus>("/status");
  return response.data;
};

// 2. Switch the traffic light operating mode
export const switchModeApi = async (modeName: ApiMode): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(`/mode/${modeName}`);
  return response.data;
};

// 3. Save manual green durations for each of the 4 lanes
export const setManualTimesApi = async (timings: LaneTimings): Promise<{ status: string; timings: LaneTimings }> => {
  const response = await apiClient.post<{ status: string; timings: LaneTimings }>("/api/set_manual_times", timings);
  return response.data;
};

// 4. Activate or deactivate VIP priority overrides
export const vipOverrideApi = async (data: {
  active: boolean;
  lanes_to_green?: string[];
}): Promise<{ status: string; lanes?: string[] }> => {
  const response = await apiClient.post<{ status: string; lanes?: string[] }>("/api/vip_override", data);
  return response.data;
};

// 5. Download traffic light daily cycle report
export const downloadCycleJsonApi = async (
  year: number,
  month: number,
  day: number
): Promise<CycleReportEntry[]> => {
  const response = await apiClient.get<CycleReportEntry[]>("/download/cycle/json", {
    params: { year, month, day },
  });
  return response.data;
};
