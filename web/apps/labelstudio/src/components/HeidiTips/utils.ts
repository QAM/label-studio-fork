import { defaultTipsCollection } from "./content";
import type { Tip, TipsCollection } from "./types";

const STORE_KEY = "heidi_ignored_tips";

function getKey(collection: string) {
  return `${STORE_KEY}:${collection}`;
}

export const loadLiveTipsCollection = async () => {
  try {
    // Fetch from github raw liveContent.json
    const response = await fetch("https://raw.githubusercontent.com/HumanSignal/label-studio/main/web/apps/labelstudio/src/components/HeidiTips/liveContent.json");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn("Failed to load live tips collection defaulting to local content", error);
  }

  return defaultTipsCollection;
};

export let tipsCollection: TipsCollection;

export const initTipsCollection = async () => {
  tipsCollection ??= await loadLiveTipsCollection();
};


export async function getRandomTip(collection: keyof TipsCollection): Promise<Tip | null> {
  await initTipsCollection();

  if (isTipDismissed(collection)) return null;

  const tips = tipsCollection[collection];

  const index = Math.floor(Math.random() * tips.length);

  return tips[index];
}

/**
 * Set a cookie that indicates that a collection of tips is dismissed
 * for 30 days
 */
export function dismissTip(collection: string) {
  // will expire in 30 days
  const cookieExpiryTime = 1000 * 60 * 60 * 24 * 30;
  const cookieExpiryDate = new Date();

  cookieExpiryDate.setTime(cookieExpiryDate.getTime() + cookieExpiryTime);

  const finalKey = getKey(collection);
  const cookieValue = `${finalKey}=true`;
  const cookieExpiry = `expires=${cookieExpiryDate.toUTCString()}`;
  const cookiePath = "path=/";
  const cookieString = [cookieValue, cookieExpiry, cookiePath].join("; ");

  document.cookie = cookieString;
}

export function isTipDismissed(collection: string) {
  const cookies = Object.fromEntries(document.cookie.split(";").map((item) => item.trim().split("=")));
  const finalKey = getKey(collection);

  return cookies[finalKey] === "true";
}

export function createURL(url: string, params?: Record<string, string>): string {
  const base = new URL(url);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    base.searchParams.set(key, value);
  });

  const userID = APP_SETTINGS.user?.id;
  const serverID = APP_SETTINGS.server_id;

  if (serverID) base.searchParams.set("server_id", serverID);
  if (userID) base.searchParams.set("user_id", userID);

  return base.toString();
}
