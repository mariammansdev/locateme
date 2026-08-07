import { useEffect, useState } from "react";

type CountryClockProps = {
  country: string;
  timezone: string;
};

function isValidTimeZone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
    }).format(new Date());

    return true;
  } catch {
    return false;
  }
}

function normalizeTimeZone(timezone: string) {
  const value = timezone?.trim();

  if (!value) return "UTC";
  if (isValidTimeZone(value)) return value;

  const sanitized = value
    .replace(/['’]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9/_+-]/g, "");

  if (sanitized && isValidTimeZone(sanitized)) {
    return sanitized;
  }

  return "UTC";
}

export default function CountryClock({ country, timezone }: CountryClockProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const safeTimezone = normalizeTimeZone(timezone);

    const update = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: safeTimezone,
      }).format(now);

      setTime(formatted);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="w-72 items-center rounded-sm border-[3px] border-zinc-500 bg-[#171717] px-5 py-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.45)]">
        <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.25em] text-gray-100">
            {country}
        </h2>

        <div
            className="
            mt-3
            text-center
            font-digital
            text-[60px]
            leading-none
            tracking-[0.06em]
            text-[#ff2020]
            select-none
            [text-shadow:0_0_4px_#ff0000,0_0_10px_#ff0000,0_0_18px_#ff0000]
            "
        >
            {time}
        </div>

        <div className="mt-2 flex justify-end">
            <span className="text-xs tracking-widest text-zinc-400">
            UTC +10:00
            </span>
        </div>
    </div>
  );
}
