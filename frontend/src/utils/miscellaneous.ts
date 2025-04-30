/**
 * Converts a given number of seconds into a string formatted as "HH:MM:SS" or "MM:SS".
 *
 * @param {number} value - The number of seconds to convert.
 * @returns {string} The formatted time string.
 *
 * @example
 * // Returns "00:01:40"
 * toHHMMSS(100);
 *
 * @example
 * // Returns "01:01:01"
 * toHHMMSS(3661);
 */
export const toHHMMSS = (value: number): string => {
    const sec_num = Math.floor(value);
    let hours: number | string = Math.floor(sec_num / 3600);
    let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
    let seconds: number | string = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10 && hours !== 0) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    const mm_ss = `${minutes}:${seconds}`;
    if (hours === 0) return mm_ss;
    return `${hours}:${mm_ss}`;
};
