import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString) => {
  if (!dateString) return "";
  // Handle both "YYYY-MM-DD" and "YYYY-MM-DD HH:mm"
  const datePart = dateString.split(" ")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  // Construct UTC date to avoid local timezone shifts
  const date = new Date(Date.UTC(year, month - 1, day));
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "UTC",
  });
};

export const getBisayaPhrase = (condition, temp, humidity) => {
  const conditionText = condition?.text?.toLowerCase() || "";

  if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
    return {
      text: "Mo-ulan karon. Pero dayon japun ang klase hahay.",
      severity: "warning",
    };
  } else if (
    conditionText.includes("sunny") ||
    conditionText.includes("clear")
  ) {
    if (temp > 30) {
      return {
        text: "Init kaayo karon! Ayaw kalimot ug payong ha!",
        severity: "caution",
      };
    } else {
      return {
        text: "Nindot ang panahon karon, sige laag!",
        severity: "good",
      };
    }
  } else if (conditionText.includes("cloud")) {
    return {
      text: "Medyo lungon pero okay ra, pwede pa mo gawas.",
      severity: "neutral",
    };
  } else if (
    conditionText.includes("storm") ||
    conditionText.includes("thunder")
  ) {
    return {
      text: "Bawal laag! May bagyo! Puydi ka ma-unay!",
      severity: "danger",
    };
  } else if (humidity > 80) {
    return {
      text: "Humot kaayo ang hangin karon, mag-init2x lang sa balay.",
      severity: "caution",
    };
  }

  return {
    text: "Okay ra ang panahon karon, pero bantayi gihapon.",
    severity: "neutral",
  };
};

export const toFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);
export const toMiles = (km) => Math.round(km * 0.621371);
export const toMph = (kph) => Math.round(kph * 0.621371);
export const toInHg = (mb) => (mb * 0.02953).toFixed(2);
