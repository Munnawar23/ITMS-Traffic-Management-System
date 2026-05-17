import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { wp, hp } from "@/helpers";

interface UnifiedModeModalProps {
  visible: boolean;
  modeKey: "timeset" | "auto" | "vip" | "blinker" | null;
  initialData: any;
  onCancel: () => void;
  onDone: (data: any) => void;
}

const AMBER_COLOR = "#F59E0B";

export default function UnifiedModeModal({
  visible,
  modeKey,
  initialData,
  onCancel,
  onDone,
}: UnifiedModeModalProps) {
  const { t } = useTranslation();

  // Local state managers
  const [localLaneTimes, setLocalLaneTimes] = useState({
    lane1: "",
    lane2: "",
    lane3: "",
    lane4: "",
  });

  const [localStrategy, setLocalStrategy] = useState<"cycle" | "jump">("cycle");

  const [localLanes, setLocalLanes] = useState({
    lane1: false,
    lane2: false,
    lane3: false,
    lane4: false,
  });

  // Sync state with parent's initial data when modal becomes visible
  useEffect(() => {
    if (visible && modeKey && initialData) {
      if (modeKey === "timeset") {
        setLocalLaneTimes(initialData);
      } else if (modeKey === "auto") {
        setLocalStrategy(initialData);
      } else if (modeKey === "vip" || modeKey === "blinker") {
        setLocalLanes(initialData);
      }
    }
  }, [visible, modeKey, initialData]);

  if (!modeKey) return null;

  // Validation Checks
  const isDoneEnabled = (() => {
    if (modeKey === "timeset") {
      return (
        localLaneTimes.lane1.trim() !== "" &&
        localLaneTimes.lane2.trim() !== "" &&
        localLaneTimes.lane3.trim() !== "" &&
        localLaneTimes.lane4.trim() !== ""
      );
    }
    if (modeKey === "auto") {
      return true;
    }
    if (modeKey === "vip" || modeKey === "blinker") {
      return (
        localLanes.lane1 ||
        localLanes.lane2 ||
        localLanes.lane3 ||
        localLanes.lane4
      );
    }
    return false;
  })();

  // Trigger done callback with current local data
  const handleSubmit = () => {
    if (modeKey === "timeset") {
      onDone(localLaneTimes);
    } else if (modeKey === "auto") {
      onDone(localStrategy);
    } else if (modeKey === "vip" || modeKey === "blinker") {
      onDone(localLanes);
    }
  };

  // Content Builders
  const renderTimesetContent = () => (
    <View style={laneStyles.laneList}>
      {(["lane1", "lane2", "lane3", "lane4"] as const).map((laneKey) => {
        const val = localLaneTimes[laneKey];
        return (
          <View
            key={laneKey}
            style={[
              laneStyles.laneRow,
              val !== "" && laneStyles.laneRowActive,
            ]}
          >
            <View style={laneStyles.laneLeft}>
              <View style={laneStyles.laneIconWrap}>
                <Ionicons
                  name="navigate-outline"
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={laneStyles.laneName}>
                {t(`mode.timesetModal.${laneKey}`)}
              </Text>
            </View>
            <View style={laneStyles.laneRight}>
              <TextInput
                style={laneStyles.laneInput}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={3}
                value={val}
                onChangeText={(text) =>
                  setLocalLaneTimes((prev) => ({ ...prev, [laneKey]: text }))
                }
              />
              <Text style={laneStyles.laneUnit}>
                {t("mode.timesetModal.placeholder")}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderAutoContent = () => (
    <View style={autoStyles.strategyList}>
      {/* Cycle Auto Option */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setLocalStrategy("cycle")}
        style={[
          autoStyles.strategyRow,
          localStrategy === "cycle" && autoStyles.strategyRowActive,
        ]}
      >
        <View style={autoStyles.strategyLeft}>
          <View
            style={[
              autoStyles.iconWrap,
              localStrategy === "cycle"
                ? autoStyles.iconWrapActive
                : { backgroundColor: "#EFF6FF" },
            ]}
          >
            <Ionicons
              name="sync-outline"
              size={20}
              color={
                localStrategy === "cycle" ? theme.colors.primary : "#3B82F6"
              }
            />
          </View>
          <View style={autoStyles.strategyTexts}>
            <Text style={autoStyles.strategyName}>
              {t("mode.autoModal.cycleAuto")}
            </Text>
          </View>
        </View>

        <View
          style={[
            autoStyles.radioDot,
            localStrategy === "cycle" && autoStyles.radioDotActive,
          ]}
        >
          {localStrategy === "cycle" && (
            <View style={autoStyles.radioDotInner} />
          )}
        </View>
      </TouchableOpacity>

      {/* Jump Mode Option */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setLocalStrategy("jump")}
        style={[
          autoStyles.strategyRow,
          localStrategy === "jump" && autoStyles.strategyRowActive,
        ]}
      >
        <View style={autoStyles.strategyLeft}>
          <View
            style={[
              autoStyles.iconWrap,
              localStrategy === "jump"
                ? autoStyles.iconWrapActive
                : { backgroundColor: "#EFF6FF" },
            ]}
          >
            <Ionicons
              name="trending-up-outline"
              size={20}
              color={
                localStrategy === "jump" ? theme.colors.primary : "#3B82F6"
              }
            />
          </View>
          <View style={autoStyles.strategyTexts}>
            <Text style={autoStyles.strategyName}>
              {t("mode.autoModal.jumpMode")}
            </Text>
          </View>
        </View>

        <View
          style={[
            autoStyles.radioDot,
            localStrategy === "jump" && autoStyles.radioDotActive,
          ]}
        >
          {localStrategy === "jump" && (
            <View style={autoStyles.radioDotInner} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderLaneMultiselectContent = () => {
    const isVip = modeKey === "vip";
    const accent = isVip ? theme.colors.primary : AMBER_COLOR;
    const iconName = isVip ? "shield-outline" : "flash-outline";
    const bgLight = isVip ? "#FEE2E2" : "#FEF3C7";
    const activeBg = isVip ? theme.colors.primary + "05" : AMBER_COLOR + "08";
    const activeBorder = isVip ? theme.colors.primary + "30" : AMBER_COLOR + "40";

    return (
      <View style={laneStyles.laneList}>
        {(["lane1", "lane2", "lane3", "lane4"] as const).map((laneKey) => {
          const isSelected = localLanes[laneKey];
          return (
            <TouchableOpacity
              key={laneKey}
              activeOpacity={0.8}
              onPress={() =>
                setLocalLanes((prev) => ({
                  ...prev,
                  [laneKey]: !prev[laneKey],
                }))
              }
              style={[
                laneStyles.laneRow,
                isSelected && {
                  borderColor: activeBorder,
                  backgroundColor: activeBg,
                },
              ]}
            >
              <View style={laneStyles.laneLeft}>
                <View
                  style={[
                    laneStyles.laneIconWrap,
                    isSelected
                      ? { backgroundColor: accent + "15" }
                      : { backgroundColor: bgLight },
                  ]}
                >
                  <Ionicons
                    name={iconName}
                    size={16}
                    color={
                      isSelected ? accent : isVip ? "#EF4444" : "#D97706"
                    }
                  />
                </View>
                <Text style={laneStyles.laneName}>
                  {t(`mode.${modeKey}Modal.${laneKey}`)}
                </Text>
              </View>

              {/* Checkbox Indicator */}
              <View
                style={[
                  multiselectStyles.checkbox,
                  isSelected && {
                    borderColor: accent,
                    backgroundColor: accent,
                  },
                ]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const dynamicDoneColor = modeKey === "blinker" ? AMBER_COLOR : theme.colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t(`mode.${modeKey}Modal.title`)}</Text>
          <Text style={styles.modalSubtitle}>
            {t(`mode.${modeKey}Modal.subtitle`)}
          </Text>

          {/* Render dynanic body based on modeKey */}
          {modeKey === "timeset" && renderTimesetContent()}
          {modeKey === "auto" && renderAutoContent()}
          {(modeKey === "vip" || modeKey === "blinker") &&
            renderLaneMultiselectContent()}

          {/* Standard buttons */}
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelButtonText}>
                {t(`mode.${modeKey}Modal.cancel`)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={!isDoneEnabled}
              style={[
                styles.modalDoneButton,
                { backgroundColor: dynamicDoneColor },
                !isDoneEnabled && styles.modalDoneButtonDisabled,
              ]}
            >
              <Text style={styles.modalDoneButtonText}>
                {t(`mode.${modeKey}Modal.done`)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(5),
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    width: "100%",
    maxWidth: 400,
    padding: wp(6),
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: "#64748B",
    textAlign: "center",
    marginBottom: hp(3),
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: hp(1),
  },
  modalCancelButton: {
    flex: 1,
    height: hp(6),
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#64748B",
  },
  modalDoneButton: {
    flex: 1.3,
    height: hp(6),
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalDoneButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  modalDoneButtonText: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#FFFFFF",
  },
});

const laneStyles = StyleSheet.create({
  laneList: {
    marginBottom: hp(2),
  },
  laneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    borderRadius: 18,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    marginBottom: hp(1.5),
  },
  laneRowActive: {
    borderColor: theme.colors.primary + "30",
    backgroundColor: theme.colors.primary + "05",
  },
  laneLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  laneIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  laneName: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
  },
  laneRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: wp(28),
    height: hp(5.2),
  },
  laneInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    textAlign: "right",
    padding: 0,
  },
  laneUnit: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#94A3B8",
  },
});

const autoStyles = StyleSheet.create({
  strategyList: {
    marginBottom: hp(2.5),
  },
  strategyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    marginBottom: hp(1.8),
    gap: 12,
  },
  strategyRowActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "06",
  },
  strategyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary + "15",
  },
  strategyTexts: {
    flex: 1,
  },
  strategyName: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDotActive: {
    borderColor: theme.colors.primary,
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
});

const multiselectStyles = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
