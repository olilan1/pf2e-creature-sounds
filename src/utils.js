import { getSetting, SETTINGS } from "./settings.js";

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getHashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer 
    }
    
    return hash;
}

export function logd(message) {
    if (getSetting(SETTINGS.DEBUG_LOGGING)) {
        console.log(message);
    }
}