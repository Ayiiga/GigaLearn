"use client";

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;

  const permitted = await requestPushPermission();
  if (!permitted) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (!existing) {
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: undefined,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export function showLearningReminder(title: string, body: string) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/icon.png", tag: "gigalearn-reminder" });
  } catch {
    // Notifications blocked
  }
}

export function scheduleDailyReminder(hour = 16) {
  if (typeof window === "undefined") return;
  const key = "gigalearn-daily-reminder";
  const last = localStorage.getItem(key);
  const today = new Date().toISOString().split("T")[0];
  if (last === today) return;

  const now = new Date();
  if (now.getHours() >= hour) {
    showLearningReminder("Time to learn! 📚", "Keep your streak going with a quick GigaLearn session.");
    localStorage.setItem(key, today);
  }
}
