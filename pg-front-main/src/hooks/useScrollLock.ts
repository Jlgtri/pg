import { useRef } from "react";

const safeDocument = typeof document !== "undefined" ? document : null;

/**
 * Usage:
 * const {blockScroll, allowScroll} = useScrollLock();
 */
export const useScrollLock = () => {
  const scrollBlocked = useRef<boolean>(false);

  const blockScroll = () => {
    const html = safeDocument?.documentElement;
    const body = safeDocument?.body;
    if (!body || !html || !body.style || scrollBlocked.current) return;

    const scrollBarWidth = window.innerWidth - html.clientWidth;
    const bodyPaddingRight =
      parseInt(
        window.getComputedStyle(body).getPropertyValue("padding-right")
      ) || 0;

    /**
     * 1. Fixes a bug in iOS and desktop Safari whereby setting
     *    `overflow: hidden` on the html/body does not prevent scrolling.
     * 2. Fixes a bug in desktop Safari where `overflowY` does not prevent
     *    scroll if an `overflow-x` style is also applied to the body.
     */
    html.style.position = "relative"; /* [1] */
    html.style.overflow = "hidden"; /* [2] */
    body.style.position = "relative"; /* [1] */
    body.style.overflow = "hidden"; /* [2] */
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

    scrollBlocked.current = true;
  };

  const allowScroll = () => {
    const html = safeDocument?.documentElement;
    const body = safeDocument?.body;
    if (!body || !html || !body.style || !scrollBlocked.current) return;

    html.style.position = "";
    html.style.overflow = "";
    body.style.position = "";
    body.style.overflow = "";
    body.style.paddingRight = "";

    scrollBlocked.current = false;
  };

  return { blockScroll, allowScroll };
};
