"use client";

import { useRef } from "react";

const MIN_FILL_TIME_MS = 1500;

/**
 * Shared frontend spam-deterrent logic for the contact form and
 * newsletter signup — the two public forms on this site. Two
 * techniques, catching different bot behavior:
 *
 * 1. A honeypot field (see HoneypotField.jsx): a field real visitors
 *    never see or reach, but that simple bots often fill in anyway
 *    since they don't render the page, they just find every <input>
 *    and fill it.
 * 2. A time-trap: bots frequently submit a form within milliseconds
 *    of loading it. `startedAt` records when the component mounted;
 *    `isSpam()` treats anything faster than MIN_FILL_TIME_MS as
 *    suspicious.
 *
 * Neither of these is a substitute for real server-side protection
 * (IP rate limiting, a CAPTCHA token verified server-side) — there's
 * no backend receiving these submissions yet at all, so this is what's
 * actually possible today. It's worth having in place from day one
 * rather than retrofitting later; when a backend is added, it should
 * ALSO re-check the honeypot value server-side rather than trusting
 * the frontend alone (a bot that reads this source can simply stop
 * filling in the honeypot field).
 */
export function useSpamGuard() {
  const startedAt = useRef(Date.now());

  const isSpam = (honeypotValue) => {
    if (honeypotValue) return true;
    return Date.now() - startedAt.current < MIN_FILL_TIME_MS;
  };

  return { isSpam };
}
