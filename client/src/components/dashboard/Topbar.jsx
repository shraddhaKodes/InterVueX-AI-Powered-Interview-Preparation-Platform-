import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import {
  getMyNotifications,
  markAllNotificationsRead as markAllNotificationsReadRequest,
} from "../../api/notificationApi.js";

import { io } from "socket.io-client";
import { createPortal } from "react-dom";

/**
 * Production-ready Topbar for dashboard.
 * - Uses AuthContext for user data
 * - Shows credits from `credits` prop
 * - Notification dropdown + unread badge (local until backend wired)
 * - Debounced search autocomplete (local demo until backend wired)
 * - Optional Socket.IO wiring (safe no-op if socket config missing)
 */
const Topbar = ({ credits = 0 }) => {
  const { user } = useAuth();
  const theme = useContext(ThemeContext);
  const darkMode = theme?.darkMode;
  const setDarkMode = theme?.setDarkMode;

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const profileName = user?.fullName || user?.name || "";
  const profileRole = user?.role || "";
  const avatarInitial = useMemo(() => {
    if (profileName?.trim()) return profileName.trim()[0].toUpperCase();
    if (user?.email) return String(user.email)[0]?.toUpperCase?.() || "U";
    return "U";
  }, [profileName, user?.email]);

  const shellClass = darkMode
    ? "rounded-3xl mb-5 border border-white/10 bg-slate-950/70 p-3 shadow-xl shadow-black/20"
    : "rounded-3xl mb-5 border border-slate-200/60 bg-white/90 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl";

  const controlButtonClass = darkMode
    ? "inline-flex h-12 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70 px-4 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
    : "inline-flex h-12 items-center justify-center rounded-3xl border border-slate-200/60 bg-white/90 px-4 text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

  const profileClass = darkMode
    ? "hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 shadow-xl shadow-black/20 lg:flex"
    : "hidden items-center gap-3 rounded-3xl border border-slate-200/60 bg-white/90 px-4 py-3 text-slate-900 shadow-xl shadow-slate-900/10 lg:flex";

  const profileNameClass = darkMode
    ? "text-sm font-semibold text-white"
    : "text-sm font-semibold text-slate-900";

  const profileMetaClass = darkMode
    ? "text-xs text-slate-400"
    : "text-xs text-slate-500";

  const searchWrapRef = useRef(null);
  const notifWrapRef = useRef(null);
  const debouncedRef = useRef(null);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await markAllNotificationsReadRequest();
      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true })),
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true })),
      );
    }
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const runSearch = useCallback(
    async (q) => {
      const query = q.trim();
      if (!query) {
        setSearchResults([]);
        setSearchLoading(false);
        setSearchError("");
        return;
      }

      setSearchLoading(true);
      setSearchError("");

      try {
        await new Promise((r) => setTimeout(r, 180));

        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
        const score = (text) => {
          const t = String(text).toLowerCase();
          return tokens.reduce(
            (acc, tok) => acc + (t.includes(tok) ? 1 : 0),
            0,
          );
        };

        const base = [
          { type: "Interview", title: "Two Sum", path: "/dashboard" },
          {
            type: "Coding Problem",
            title: "LRU Cache",
            path: "/dashboard/coding",
          },
          {
            type: "Resource",
            title: "Big-O Cheatsheet",
            path: "/dashboard/analytics",
          },
          {
            type: "User",
            title: profileName || "Your Profile",
            path: "/dashboard/settings",
          },
        ];

        const results = base
          .map((r) => ({ ...r, _score: score(r.title) + score(r.type) }))
          .filter((r) => r._score > 0)
          .sort((a, b) => b._score - a._score)
          .slice(0, 6);

        setSearchResults(results);
      } catch {
        setSearchError("Search failed.");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [profileName],
  );

  useEffect(() => {
    const onDocDown = (e) => {
      const t = e.target;
      if (searchWrapRef.current && !searchWrapRef.current.contains(t)) {
        setSearchOpen(false);
      }
      if (notifWrapRef.current && !notifWrapRef.current.contains(t)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    setSearchError("");

    debouncedRef.current = setTimeout(() => {
      runSearch(search);
    }, 300);

    return () => {
      if (debouncedRef.current) clearTimeout(debouncedRef.current);
    };
  }, [search, runSearch]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = localStorage.getItem("intervuex_token");
        const userId = user?.id || user?._id;
        if (!token || !userId) return;

        const res = await getMyNotifications({ limit: 10 });
        const list = res?.notifications || [];

        if (cancelled) return;
        setNotifications(
          list.map((n) => ({
            id: n.id || n._id,
            _id: n._id,
            title: n.title || n.message || "Notification",
            body: n.body || n.description || "",
            type: n.type || "info",
            read: Boolean(n.read),
            createdAt: n.createdAt || new Date().toISOString(),
            href: n.href || n.path,
          })),
        );
      } catch {
        // ignore; socket will still show new notifications
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?._id]);

  useEffect(() => {
    let socket;

    const setup = async () => {
      try {
        const url = import.meta.env.VITE_SOCKET_URL;
        const enabled = Boolean(url);
        if (!enabled) return;

        socket = io(url, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          auth: {
            token: localStorage.getItem("intervuex_token"),
          },
        });

        socket.on("notifications:new", (payload) => {
          const list = Array.isArray(payload)
            ? payload
            : payload?.notifications
              ? payload.notifications
              : payload
                ? [payload]
                : [];

          if (!list.length) return;

          setNotifications((prev) => {
            const mapped = list.map((n) => ({
              id: n.id || n._id || String(Date.now()) + Math.random(),
              title: n.title || n.message || "Notification",
              body: n.body || n.description || "",
              type: n.type || "info",
              read: Boolean(n.read),
              createdAt: n.createdAt || n.loggedAt || new Date().toISOString(),
              href: n.href || n.path,
            }));

            return [...mapped, ...prev].slice(0, 10);
          });
        });

        socket.on("notifications:read", () => {
          markAllNotificationsRead();
        });

        socket.on("credits:updated", (payload) => {
          const newCredits = payload?.credits;
          if (Number.isFinite(Number(newCredits))) {
            window.dispatchEvent(
              new CustomEvent("credits:updated", {
                detail: { credits: Number(newCredits) },
              }),
            );
          }
        });

        socket.on("interview:completed", (payload) => {
          const title = payload?.title || "Interview completed";
          const body = payload?.body || payload?.resultSummary || "";
          setNotifications((prev) =>
            [
              {
                id: payload?.id || payload?._id || String(Date.now()),
                title,
                body,
                type: "interview",
                read: false,
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ].slice(0, 10),
          );
        });

        socket.on("admin:announcement", (payload) => {
          const title = payload?.title || "Admin announcement";
          const body = payload?.body || payload?.message || "";
          setNotifications((prev) =>
            [
              {
                id: payload?.id || payload?._id || String(Date.now()),
                title,
                body,
                type: "admin",
                read: false,
                createdAt: new Date().toISOString(),
                href: payload?.href || payload?.path,
              },
              ...prev,
            ].slice(0, 10),
          );
        });
      } catch {
        // ignore socket errors; keep app functional
      }
    };

    setup();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [markAllNotificationsRead]);

  const notifPopover = notifOpen ? (
    <NotificationPopover
      darkMode={darkMode}
      notifications={notifications}
      unreadCount={unreadCount}
      notifError={notifError}
      markAllNotificationsRead={markAllNotificationsRead}
      markNotificationRead={markNotificationRead}
    />
  ) : null;

  return (
    <div className={shellClass}>
      <div className="flex items-center justify-between gap-4">
        {/* Credits + profile */}
        <div className={profileClass}>
          <div
            className={
              darkMode
                ? "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm font-semibold text-white shadow-xl shadow-black/20"
                : "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 bg-white/70 text-sm font-semibold text-slate-900 shadow-xl shadow-slate-900/10"
            }
          >
            {avatarInitial}
          </div>
          <div className="min-w-0">
            <div className={profileNameClass}>{profileName || "User"}</div>
            <div className={profileMetaClass}>{profileRole}</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            className={controlButtonClass}
            onClick={() => {
              // credits interaction placeholder
            }}
          >
            <span className="text-sm font-semibold">Credits:</span>
            <span className="ml-2 text-sm font-bold tabular-nums">
              {credits}
            </span>
          </button>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            className={controlButtonClass}
            onClick={() => setDarkMode?.(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifWrapRef}>
            <button
              type="button"
              className={controlButtonClass}
              onClick={() => {
                setNotifOpen((v) => !v);
                setNotifError("");
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className={
                    darkMode
                      ? "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-xs font-bold text-slate-950"
                      : "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-xs font-bold text-white"
                  }
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Portal so it never gets clipped/stacked by navbar/container */}
          {notifOpen
            ? createPortal(
                <NotificationPopover
                  darkMode={darkMode}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  notifError={notifError}
                  markAllNotificationsRead={markAllNotificationsRead}
                  markNotificationRead={markNotificationRead}
                />,
                document.body,
              )
            : null}
        </div>
      </div>
    </div>
  );
};

const NotificationPopover = ({
  darkMode,
  notifications,
  unreadCount,
  notifError,
  markAllNotificationsRead,
  markNotificationRead,
}) => {
  return (
    <div
      className={
        darkMode
          ? "absolute top-[64px] right-[24px] z-[99999] w-[360px] max-w-[90vw] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur max-h-[70vh] overflow-auto"
          : "absolute top-[64px] right-[24px] z-[99999] w-[360px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl max-h-[70vh] overflow-auto"
      }
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={
            darkMode
              ? "text-sm font-bold text-slate-100"
              : "text-sm font-bold text-slate-900"
          }
        >
          Notifications
        </div>
        <button
          type="button"
          className={
            darkMode
              ? "text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              : "text-xs font-semibold text-cyan-600 hover:text-cyan-500"
          }
          onClick={markAllNotificationsRead}
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div
          className={
            darkMode
              ? "mt-3 text-sm text-slate-400"
              : "mt-3 text-sm text-slate-500"
          }
        >
          No notifications yet.
        </div>
      ) : (
        <div className="mt-2 max-h-[320px] overflow-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={
                darkMode
                  ? "flex items-start gap-3 rounded-xl p-3 hover:bg-white/5 transition cursor-pointer"
                  : "flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50 transition cursor-pointer"
              }
              onClick={() => markNotificationRead(n.id)}
              role="button"
              tabIndex={0}
            >
              <div
                className={
                  n.read
                    ? darkMode
                      ? "h-2.5 w-2.5 rounded-full bg-slate-600 mt-2"
                      : "h-2.5 w-2.5 rounded-full bg-slate-300 mt-2"
                    : darkMode
                      ? "h-2.5 w-2.5 rounded-full bg-cyan-400 mt-2"
                      : "h-2.5 w-2.5 rounded-full bg-cyan-500 mt-2"
                }
              />
              <div className="min-w-0">
                <div
                  className={
                    darkMode
                      ? n.read
                        ? "text-sm font-semibold text-slate-200"
                        : "text-sm font-bold text-white"
                      : n.read
                        ? "text-sm font-semibold text-slate-900"
                        : "text-sm font-bold text-slate-900"
                  }
                >
                  {n.title}
                </div>
                <div
                  className={
                    darkMode
                      ? "text-xs text-slate-400 mt-1"
                      : "text-xs text-slate-500 mt-1"
                  }
                >
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                {n.body && (
                  <div
                    className={
                      darkMode
                        ? "text-xs text-slate-300 mt-1"
                        : "text-xs text-slate-700 mt-1"
                    }
                  >
                    {n.body}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {notifError && (
        <div
          className={
            darkMode ? "mt-2 text-sm text-red-300" : "mt-2 text-sm text-red-600"
          }
        >
          {notifError}
        </div>
      )}
    </div>
  );
};

export default Topbar;
