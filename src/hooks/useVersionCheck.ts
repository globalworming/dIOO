import { useState, useEffect, useRef } from "react";

const VERSION_STORAGE_KEY = "dioo-version";
const LAST_CHECK_KEY = "dioo-version-last-check";
const GITHUB_TAGS_URL = "https://api.github.com/repos/globalworming/dioo/tags";
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour interval to check if day changed

interface VersionState {
  currentVersion: string | null;
  latestVersion: string | null;
  hasUpdate: boolean;
  loading: boolean;
}

const getDateString = (date: Date) => date.toISOString().split("T")[0];

const shouldCheckToday = () => {
  const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
  const today = getDateString(new Date());
  return lastCheck !== today;
};

export const useVersionCheck = () => {
  const [state, setState] = useState<VersionState>({
    currentVersion: null,
    latestVersion: null,
    hasUpdate: false,
    loading: true,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      // Skip if already checked today
      if (!shouldCheckToday()) {
        const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
        setState({
          currentVersion: storedVersion,
          latestVersion: storedVersion,
          hasUpdate: false,
          loading: false,
        });
        return;
      }

      try {
        const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

        const response = await fetch(GITHUB_TAGS_URL, {
          headers: { Accept: "application/vnd.github+json" },
        });

        if (!response.ok) {
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        const tags = await response.json();
        const latestTag = tags[0]?.name ?? null;

        if (!latestTag) {
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        // Mark today as checked
        localStorage.setItem(LAST_CHECK_KEY, getDateString(new Date()));

        // If no stored version, store the latest and don't show update
        if (!storedVersion) {
          localStorage.setItem(VERSION_STORAGE_KEY, latestTag);
          setState({
            currentVersion: latestTag,
            latestVersion: latestTag,
            hasUpdate: false,
            loading: false,
          });
          return;
        }

        // Compare versions
        const hasUpdate = storedVersion !== latestTag;

        setState({
          currentVersion: storedVersion,
          latestVersion: latestTag,
          hasUpdate,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to check version:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    // Initial check
    checkVersion();

    // Set up interval to check if day changed
    intervalRef.current = setInterval(() => {
      if (shouldCheckToday()) {
        checkVersion();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const updateVersion = () => {
    if (state.latestVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, state.latestVersion);
      window.location.reload();
    }
  };

  const clearVersion = () => {
    localStorage.removeItem(VERSION_STORAGE_KEY);
  };

  return { ...state, updateVersion, clearVersion };
};
