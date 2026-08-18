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
  const [dateText, setDateText] = useState("");
  const [timezoneOffset, setTimezoneOffset] = useState("");

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

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: safeTimezone,
      }).format(now);

      const offset = new Intl.DateTimeFormat("en-US", {
        timeZone: safeTimezone,
        timeZoneName: "shortOffset",
      }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value ?? "UTC";

      setTime(formatted);
      setDateText(formattedDate);
      setTimezoneOffset(offset);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="w-80 items-center rounded-sm  px-2 py-4">
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

      <div className="mt-2 text-center text-xl capitalize tracking-[0.2em] text-zinc-300">
        {dateText}
      </div>

      <div className="mt-2 flex justify-end">
        <span className="text-xs tracking-widest text-zinc-400">{timezoneOffset}</span>
      </div>
    </div>
  );
}
