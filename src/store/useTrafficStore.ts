import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiMode, CycleReportEntry } from "@/types/traffic";
import { ModeKey } from "@/constants";
import {
  getStatusApi,
  switchModeApi,
  setManualTimesApi,
  vipOverrideApi,
  downloadCycleJsonApi,
} from "@/api/traffic";

interface TrafficState {
  // Real-time API States
  currentMode: ApiMode;
  vipActive: boolean;
  vipLanesGreen: string[] | null;
  inferenceHas: boolean;
  isLoading: boolean;
  error: string | null;
  logs: CycleReportEntry[];

  // Local configurations persisted on device
  selectedStrategy: "cycle" | "jump";
  laneTimes: { lane1: string; lane2: string; lane3: string; lane4: string };
  selectedVipLanes: { lane1: boolean; lane2: boolean; lane3: boolean; lane4: boolean };
  selectedBlinkerLanes: { lane1: boolean; lane2: boolean; lane3: boolean; lane4: boolean };

  // Core Actions
  fetchStatus: () => Promise<void>;
  switchMode: (uiMode: ModeKey, extraData?: any) => Promise<void>;
  deactivateVip: () => Promise<void>;
  fetchLogs: (date?: Date) => Promise<void>;
  clearError: () => void;
}

export const useTrafficStore = create<TrafficState>()(
  persist(
    (set, get) => ({
      // Initial States
      currentMode: "none",
      vipActive: false,
      vipLanesGreen: null,
      inferenceHas: false,
      isLoading: false,
      error: null,
      logs: [],

      selectedStrategy: "cycle",
      laneTimes: { lane1: "30", lane2: "30", lane3: "30", lane4: "30" },
      selectedVipLanes: { lane1: false, lane2: false, lane3: false, lane4: false },
      selectedBlinkerLanes: { lane1: false, lane2: false, lane3: false, lane4: false },

      clearError: () => {
        console.log(`[🚀 ZUSTAND STORE] Action: clearError() called.`);
        set({ error: null });
      },

      // 1. Fetch real-time system status from the RPi5 controller
      fetchStatus: async () => {
        console.log(`[🚀 ZUSTAND STORE] ➡️ Action: fetchStatus() invoked.`);
        set({ error: null });
        try {
          const status = await getStatusApi();
          console.log(`[🚀 ZUSTAND STORE] ✅ fetchStatus() Success. Payload:`, JSON.stringify(status, null, 2));
          set({
            currentMode: status.current_mode,
            vipActive: status.vip_active,
            vipLanesGreen: status.vip_lanes_green,
            inferenceHas: status.inference_has,
          });
        } catch (err: any) {
          console.error(`[🚀 ZUSTAND STORE] ❌ fetchStatus() Failed! Reason:`, err.message || err);
          set({ error: err.message || "Failed to connect to Traffic Controller" });
        }
      },

      // 2. Switch operating modes and invoke corresponding hardware endpoints
      switchMode: async (uiMode: ModeKey, extraData?: any) => {
        console.log(`[🚀 ZUSTAND STORE] ➡️ Action: switchMode() invoked. UI Trigger: "${uiMode}". Payload:`, JSON.stringify(extraData || {}, null, 2));
        set({ isLoading: true, error: null });
        try {
          if (uiMode === "timeset") {
            const data = extraData || get().laneTimes;
            console.log(`[🚀 ZUSTAND STORE] Processing "timeset" mode. Durations configured:`, data);
            
            // Format and save manual timings on Raspberry Pi
            const formattedTimings = {
              lane1_time: parseInt(data.lane1, 10) || 30,
              lane2_time: parseInt(data.lane2, 10) || 30,
              lane3_time: parseInt(data.lane3, 10) || 30,
              lane4_time: parseInt(data.lane4, 10) || 30,
            };
            
            console.log(`[🚀 ZUSTAND STORE] Sending manual durations to RPi5:`, formattedTimings);
            await setManualTimesApi(formattedTimings);
            console.log(`[🚀 ZUSTAND STORE] Switching physical mode to "set_manual"...`);
            await switchModeApi("set_manual");
            
            set({ laneTimes: data, currentMode: "set_manual" });

          } else if (uiMode === "auto") {
            const strategy = extraData || get().selectedStrategy;
            const apiMode: ApiMode = strategy === "jump" ? "auto" : "cycle_auto";
            console.log(`[🚀 ZUSTAND STORE] Processing "auto" mode. Strategy choice: "${strategy}" -> ApiMode: "${apiMode}"`);
            
            await switchModeApi(apiMode);
            
            set({ selectedStrategy: strategy, currentMode: apiMode });

          } else if (uiMode === "blinker") {
            console.log(`[🚀 ZUSTAND STORE] Processing "blinker" mode. Activating Yellow Blinker...`);
            
            await switchModeApi("yellow");
            
            set({ currentMode: "yellow" });

          } else if (uiMode === "vip") {
            const data = extraData || get().selectedVipLanes;
            console.log(`[🚀 ZUSTAND STORE] Processing "vip" override mode. Selection:`, data);
            
            // Map selected visual lanes { lane1: true, ... } to hardware IDs ["81", "82", ...]
            const lanes: string[] = [];
            if (data.lane1) lanes.push("81");
            if (data.lane2) lanes.push("82");
            if (data.lane3) lanes.push("83");
            if (data.lane4) lanes.push("84");

            if (lanes.length === 0) {
              console.warn(`[🚀 ZUSTAND STORE] ⚠️ VIP activation rejected: No lanes selected.`);
              throw new Error("Please select at least one lane for VIP override");
            }

            console.log(`[🚀 ZUSTAND STORE] Activating VIP override on Lane IDs:`, lanes);
            await vipOverrideApi({
              active: true,
              lanes_to_green: lanes,
            });

            set({
              selectedVipLanes: data,
              currentMode: "vip",
              vipActive: true,
              vipLanesGreen: lanes,
            });
          }

          console.log(`[🚀 ZUSTAND STORE] ✅ switchMode("${uiMode}") completed. Syncing status...`);
          await get().fetchStatus();
        } catch (err: any) {
          const errorMessage = err.message || "Failed to switch mode";
          console.error(`[🚀 ZUSTAND STORE] ❌ switchMode("${uiMode}") Failed! Error: "${errorMessage}"`);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // 3. Deactivate VIP mode and return system to manual timing rotation gracefully
      deactivateVip: async () => {
        console.log(`[🚀 ZUSTAND STORE] ➡️ Action: deactivateVip() invoked.`);
        set({ isLoading: true, error: null });
        try {
          console.log(`[🚀 ZUSTAND STORE] Sending VIP deactivation command...`);
          await vipOverrideApi({ active: false });
          console.log(`[🚀 ZUSTAND STORE] VIP deactivation successfully received by backend.`);
          set({
            vipActive: false,
            vipLanesGreen: null,
            selectedVipLanes: { lane1: false, lane2: false, lane3: false, lane4: false },
          });
          console.log(`[🚀 ZUSTAND STORE] Syncing status after VIP deactivation...`);
          await get().fetchStatus();
        } catch (err: any) {
          const errorMessage = err.message || "Failed to stop VIP mode";
          console.error(`[🚀 ZUSTAND STORE] ❌ deactivateVip() Failed! Error: "${errorMessage}"`);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      // 4. Download and parse cycle analytics from RPi5
      fetchLogs: async (date = new Date()) => {
        console.log(`[🚀 ZUSTAND STORE] ➡️ Action: fetchLogs() invoked for date:`, date.toDateString());
        set({ isLoading: true, error: null });
        try {
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // getMonth() is 0-indexed
          const day = date.getDate();

          console.log(`[🚀 ZUSTAND STORE] Downloading cycle JSON reports for: Year=${year}, Month=${month}, Day=${day}`);
          let data = await downloadCycleJsonApi(year, month, day);
          
          // If today's log exists but is empty, try loading the pre-loaded sample logs
          if (!data || data.length === 0) {
            console.log(`[🚀 ZUSTAND STORE] ℹ️ Today's logs are empty. Fetching historical sample logs (2025-12-05)...`);
            data = await downloadCycleJsonApi(2025, 12, 5);
          }

          console.log(`[🚀 ZUSTAND STORE] ✅ fetchLogs() Success. Received ${data?.length || 0} entries.`);
          set({ logs: data || [] });
        } catch (err: any) {
          console.error(`[🚀 ZUSTAND STORE] ❌ fetchLogs() Failed! Status code: ${err.status || "NO_CONN"} | Msg: "${err.message}"`);
          
          // If no logs exist yet for today (404), fallback to the sample logs date (2025-12-05)
          if (err.status === 404) {
            try {
              console.log(`[🚀 ZUSTAND STORE] ℹ️ RPi5 returned 404 for today. Loading sample logs (2025-12-05)...`);
              const fallbackData = await downloadCycleJsonApi(2025, 12, 5);
              console.log(`[🚀 ZUSTAND STORE] ✅ Fallback Success. Received ${fallbackData?.length || 0} entries.`);
              set({ logs: fallbackData || [] });
            } catch (fallbackErr) {
              console.error(`[🚀 ZUSTAND STORE] ❌ Fallback failed. Setting empty list.`);
              set({ logs: [] });
            }
          } else {
            set({ error: err.message || "Failed to load traffic cycle logs" });
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "itms-traffic-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedStrategy: state.selectedStrategy,
        laneTimes: state.laneTimes,
        selectedVipLanes: state.selectedVipLanes,
        selectedBlinkerLanes: state.selectedBlinkerLanes,
      }), // Save user settings, but pull current system status fresh
    }
  )
);
