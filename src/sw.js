/* eslint-disable no-undef */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
workbox.core.setCacheNameDetails({
	prefix: "dash"
});

self.addEventListener("message", event => {
	if (!event.data) {
		return;
	}

	switch (event.data) {
		case "skipWaiting":
			// @ts-ignore
			self.skipWaiting();
			break;
		default:
			break;
	}
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
// @ts-ignore
self.__precacheManifest = [].concat(self.__precacheManifest || []);
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
