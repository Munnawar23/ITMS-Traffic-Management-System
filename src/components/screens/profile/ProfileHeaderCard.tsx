import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/styles/theme";

interface UserType {
  name?: string;
  badgeNumber?: string;
  profile_picture?: string;
  role?: string;
  phone_number?: string;
}

interface ProfileHeaderCardProps {
  user: UserType | null;
}

export default function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  return (
    <View style={styles.headerCard}>
      <View style={styles.profileBasicInfo}>
        <View style={styles.avatarCircle}>
          {user?.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons
              name="person"
              size={36}
              color={theme.colors.primary}
            />
          )}
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.userName}>{user?.name || "Jawan Name"}</Text>
          <View style={styles.societyBadge}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.societyText}>
              {user?.badgeNumber || "ITMS-9988"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactInfoSection}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="ribbon"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Designation</Text>
            <Text style={styles.infoValue}>{user?.role || "Jawan"}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Contact Number</Text>
            <Text style={styles.infoValue}>
              {user?.phone_number || "9999999999"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileBasicInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  nameSection: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontFamily: theme.fontFamily.heading,
    color: "#000000",
  },
  societyBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  societyText: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },
  contactInfoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#000000",
  },
});
