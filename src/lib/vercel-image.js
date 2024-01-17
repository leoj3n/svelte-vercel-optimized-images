import { dev } from '$app/environment';
import { PUBLIC_BUILD_VERCEL } from '$env/static/public';

/**
 * @param {string | number | boolean} src
 */
export function srcset(src, widths = [640, 960, 1280], quality = 90) {
	if (dev || PUBLIC_BUILD_VERCEL !== 'true') return src;

	return widths
		.slice()
		.sort((a, b) => a - b)
		.map((width, i) => {
			const url = `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
			const descriptor = ` ${width}w`;
			return url + descriptor;
		})
		.join(', ');
}
