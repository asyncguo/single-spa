import { reroute } from "./navigation/reroute";
import { isInBrowser } from "./utils/runtime-environment";

let started: boolean = false

export function start() {
  started = true;

  if (isInBrowser) {
    reroute()
  }
}

export function isStarted() {
  return started;
}
