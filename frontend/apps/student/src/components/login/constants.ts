export const VIT_DOMAINS = [];

export const WRONG_EMAIL_LINES = [
  "Please enter a valid email address.",
  "Check your credentials and try again.",
  "Unable to authenticate with provided details.",
];

export const LOADING_STEPS = [
  "Verifying credentials",
  "Checking account status",
  "Securing your session",
  "Unlocking the app",
];

export const LOADING_QUIPS = [
  "Firing up your campus food pass...",
  "Warming up the digital tawa...",
  "Authenticating your tastebuds...",
  "Setting up your ordering dashboard...",
];

export const EASTER_LINES = [
  "bro there is only one button",
  "more clicks ≠ faster food",
  "the button heard you. it's thinking.",
];

export const TAGLINES = [
  "Skip the queue. Not the flavour.",
  "Hunger has no attendance policy.",
  "Food before GPA. Always.",
  "Eat first. Regret never.",
];

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function decodeJwtPayload(
  token: string,
): { email?: string; name?: string; picture?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
