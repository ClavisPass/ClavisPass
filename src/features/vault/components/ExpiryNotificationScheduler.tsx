import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { logger } from "../../../infrastructure/logging/logger";
import ModulesEnum from "../model/ModulesEnum";
import type ValuesType from "../model/ValuesType";
import type ExpiryModuleType from "../model/modules/ExpiryModuleType";

const EXPIRY_NOTIFICATION_KIND = "clavispass-expiry-reminder";
const EXPIRY_NOTIFICATION_CHANNEL_ID = "expiry-reminders";
const MAX_SCHEDULED_EXPIRY_NOTIFICATIONS = 64;

type PendingExpiryReminder = {
  entryId: string;
  moduleId: string;
  scheduledAt: Date;
};

let notificationHandlerConfigured = false;

function configureNotificationHandler() {
  if (notificationHandlerConfigured) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldSetBadge: false,
    }),
  });
  notificationHandlerConfigured = true;
}

async function cancelScheduledExpiryReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled.map((notification) => {
      const data = notification.content.data as { kind?: string } | undefined;
      if (data?.kind !== EXPIRY_NOTIFICATION_KIND) {
        return Promise.resolve();
      }
      return Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }),
  );
}

function getReminderDate(expiryValue: string): Date | null {
  const expiryDate = new Date(expiryValue);
  if (Number.isNaN(expiryDate.getTime())) return null;

  const scheduledAt = new Date(expiryDate);
  scheduledAt.setDate(scheduledAt.getDate() - 1);
  scheduledAt.setHours(9, 0, 0, 0);

  const now = Date.now();
  if (expiryDate.getTime() <= now || scheduledAt.getTime() <= now) {
    return null;
  }

  return scheduledAt;
}

function buildPendingExpiryReminders(values: ValuesType[]): PendingExpiryReminder[] {
  const pending: PendingExpiryReminder[] = [];

  values.forEach((entry) => {
    entry.modules.forEach((module) => {
      if (module.module !== ModulesEnum.EXPIRY) return;

      const expiryModule = module as ExpiryModuleType;
      const scheduledAt = getReminderDate(expiryModule.value);
      if (!scheduledAt) return;

      pending.push({
        entryId: entry.id,
        moduleId: expiryModule.id,
        scheduledAt,
      });
    });
  });

  return pending
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .slice(0, MAX_SCHEDULED_EXPIRY_NOTIFICATIONS);
}

export default function ExpiryNotificationScheduler() {
  const { t } = useTranslation();
  const vault = useVault();
  const { value: expiryRemindersEnabled } = useSetting("EXPIRY_REMINDERS");

  useEffect(() => {
    if (Platform.OS === "web") return;

    let cancelled = false;

    const syncExpiryReminders = async () => {
      try {
        if (!expiryRemindersEnabled || !vault.isUnlocked) {
          await cancelScheduledExpiryReminders();
          return;
        }

        const permissions = await Notifications.getPermissionsAsync();
        const granted =
          permissions.status === "granted" ||
          (await Notifications.requestPermissionsAsync()).status === "granted";

        if (!granted || cancelled) {
          return;
        }

        configureNotificationHandler();

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync(
            EXPIRY_NOTIFICATION_CHANNEL_ID,
            {
              name: t("settings:expiryReminders"),
              importance: Notifications.AndroidImportance.DEFAULT,
            },
          );
        }

        const pending = buildPendingExpiryReminders(
          vault.exportFullData().values,
        );

        await cancelScheduledExpiryReminders();

        if (cancelled) return;

        await Promise.all(
          pending.map((reminder) =>
            Notifications.scheduleNotificationAsync({
              identifier: `clavispass-expiry-${reminder.entryId}-${reminder.moduleId}`,
              content: {
                title: t("settings:expiryReminderNotificationTitle"),
                body: t("settings:expiryReminderNotificationBody"),
                sound: false,
                data: {
                  kind: EXPIRY_NOTIFICATION_KIND,
                  entryId: reminder.entryId,
                  moduleId: reminder.moduleId,
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminder.scheduledAt,
                channelId:
                  Platform.OS === "android"
                    ? EXPIRY_NOTIFICATION_CHANNEL_ID
                    : undefined,
              },
            }),
          ),
        );
      } catch (error) {
        logger.warn("[ExpiryNotifications] Failed to sync reminders:", error);
      }
    };

    void syncExpiryReminders();

    return () => {
      cancelled = true;
    };
  }, [
    expiryRemindersEnabled,
    t,
    vault.isUnlocked,
    vault.revision,
    vault.exportFullData,
  ]);

  return null;
}
