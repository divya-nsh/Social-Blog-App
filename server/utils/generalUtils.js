import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export function createSlug(text, suffix) {
  let slug = "";
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .filter(Boolean);
  words.forEach((word) => (slug += word + "-"));
  slug += suffix || "";
  return slug;
}

export const isObj = (val) => {
  return typeof val === "object" && val !== null && !Array.isArray(val);
};

/**
 * @type {(toObj:{[key:string]:any},fromObj:{[key:string]:any},allowedFields?:string[],removeValWith?:Array<string|null|undefined|{}|[]>)=>object}
 */
export function checkAssign(
  toObj,
  fromObj,
  allowedKeys = [],
  notAllow = [undefined]
) {
  if (!isObj(fromObj) || !isObj(toObj)) return toObj;
  let isArrAndEmpty = (val) => Array.isArray(val) && !val.length;
  let isObjAndEmpty = (val) => {
    return isObj(val) && Object.keys(val).length === 0;
  };
  let isEmptyArrNotAllowed = notAllow.some(isArrAndEmpty);
  let isEmptyObjNotAllowed = notAllow.some(isObjAndEmpty);

  for (const key in fromObj) {
    let value = fromObj[key];
    // Skip keys not in allowedKeys (if allowedKeys is provided)
    if (allowedKeys.length && !allowedKeys.includes(key)) continue;
    // Skip not allowed values
    if (
      notAllow.includes(value) ||
      (isEmptyArrNotAllowed && isArrAndEmpty(value)) ||
      (isEmptyObjNotAllowed && isObjAndEmpty(value))
    ) {
      continue;
    }

    toObj[key] = value;
  }
  return toObj;
}

export let wait = (delay = 0) => new Promise((res) => setTimeout(res, delay));

/**
 * @param {()=>Promise<any>} fn
 * @param {{retries?:number,delay?:number,backOffFactor?:number,intialDelay?:number,maxBackOff?:number,onFailed?:(err:any,retryLeft:number)=>void}} options
 * @returns {Promise<any>}
 */
export async function resolveWithRetries(fn, options = {}) {
  let {
    retries = 3,
    delay = 1000,
    backoffFactor = 2,
    initialDelay = 0,
    maxBackOff = Infinity,
    onFailed,
  } = options;
  if (initialDelay) await wait(initialDelay);
  if (backoffFactor === 0) backoffFactor = 1;
  try {
    return await fn();
  } catch (e) {
    if (retries === 0) throw e;
    onFailed(e, retries - 1);
    await wait(delay);
    const nextDelay = Math.min(delay * backoffFactor, maxBackOff);
    return resolveWithRetries(fn, {
      ...options,
      retries: retries - 1,
      delay: nextDelay,
      initialDelay: 0,
    });
  }
}

export function generateAvatar(name = "") {
  return createAvatar(initials, {
    seed: name,
    size: 300,
    fontSize: 40,
    chars: 1,
  }).toDataUri();
}

export function isValidEmail(email) {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

  if (email.length > 254) return false; // Check overall email length

  return emailRegex.test(email); // Perform regex validation
}

export function formatTime(time) {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  if (time < SECOND) return time + "ms";
  if (time < MINUTE) return (time / SECOND).toFixed(2) + "s";
  if (time < HOUR) return (time / MINUTE).toFixed(2) + "m";
  return (time / HOUR).toFixed(2) + "h";
}

export const startClock = () => {
  const now = performance.now();

  return {
    get timeElapsed() {
      const ms = Math.floor(performance.now() - now);
      return formatTime(ms);
    },
    get elpasedMs() {
      return Math.floor(performance.now() - now);
    },
  };
};

export function formatSize(size) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (size < KB) return size + "B";
  if (size < MB) return (size / KB).toFixed(2) + "KB";
  if (size < GB) return (size / MB).toFixed(2) + "MB";
  return (size / GB).toFixed(2) + "GB";
}
