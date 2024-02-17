[![image](https://github.com/leoj3n/svelte-vercel-optimized-images/assets/990216/8d466747-7d1f-4f69-bf16-e0f3b307d7ab)](https://svelte-vercel-optimized-images.vercel.app/)

# svelte-vercel-optimized-images

This project demonstrates how you might configure Vercel to generate optimized images for SvelteKit.

- [Create a SvelteKit App and Deploy to Vercel](#create-a-sveltekit-app-and-deploy-to-vercel)
  - [Create a SvelteKit Skeleton Project](#create-a-sveltekit-skeleton-project)
  - [Push to GitHub](#push-to-github)
  - [Deploy to Vercel](#deploy-to-vercel)
- [Add Some Images and Deploy Again](#add-some-images-and-deploy-again)
  - [Add Some Images](#add-some-images)
  - [Deploy Again](#deploy-again)
- [Configure Vercel to Generate Optimized Images](#configure-vercel-to-generate-optimized-images)
  - [New Build Command](#new-build-command)
  - [Configuration Modification Script](#configuration-modification-script)
- [Use the Vercel Generated Optimized Images](#use-the-vercel-generated-optimized-images)
  - [Create `Image.svelte`](#create-imagesvelte)
  - [Using `Image.svelte`](#using-imagesvelte)
  - [Using `PUBLIC_BUILD_VERCEL` in CSS](#using-public_build_vercel-in-css)
- [Test on Vercel](#test-on-vercel)
  - [Command Reference](#command-reference)
    - [Build and Preview](#build-and-preview)
    - [`dev` Mode](#dev-mode)
    - [Optomized Images on Vercel](#optomized-images-on-vercel)
  - [References](#references)
  - [Possibly related?](#possibly-related)

## Create a SvelteKit App and Deploy to Vercel

If you haven't got a SvelteKit app already deployed to Vercel, follow these steps...

### Create a SvelteKit Skeleton Project

- `npm create svelte@latest svelte-vercel-optimized-images`

  <details>
    <summary>(click here to see selected options)</summary>

  ```console
  Need to install the following packages:
    create-svelte@6.0.6
  Ok to proceed? (y) y

  create-svelte version 6.0.6

  ┌  Welcome to SvelteKit!
  │
  ◇  Which Svelte app template?
  │  Skeleton project
  │
  ◇  Add type checking with TypeScript?
  │  No
  │
  ◇  Select additional options (use arrow keys/space bar)
  │  Add Prettier for code formatting
  │
  └  Your project is ready!

  ✔ Prettier
    https://prettier.io/docs/en/options.html
    https://github.com/sveltejs/prettier-plugin-svelte#options

  Install community-maintained integrations:
    https://github.com/svelte-add/svelte-add

  Next steps:
    1: cd svelte-vercel-optimized-images
    2: npm install
    3: git init && git add -A && git commit -m "Initial commit" (optional)
    4: npm run dev -- --open

  To close the dev server, hit Ctrl-C

  Stuck? Visit us at https://svelte.dev/chat
  ```

  </details>

- `cd svelte-vercel-optimized-images`
- `npm install`

### Push to GitHub

- `git init && git add -A && git commit -m 'init'`
- Go to your GitHub profile page and select the "+" in top right to click "New repository".
- Name the repository something like "svelte-vercel-optimized-images".
- `git remote add origin https://github.com/<username>/svelte-vercel-optimized-images.git`
- `git branch -M main && git push -u origin main`

### Deploy to Vercel

- Go to https://vercel.com/signup
- Continue with GitHub
- Select "Import Project"
- Import "svelte-vercel-optimized-images"
- Click "Deploy"

The generated SvelteKit app is now pushed to a GitHub repository and deployed to Vercel.

## Add Some Images and Deploy Again

The next step is to add some images to the app that can later be optimized by Vercel.

### Add Some Images

- Go to <https://placekitten.com> and right-click download any three cat images.
- Save to the project under the `./static` directory and name them `cat1.jpeg`, `cat2.jpeg`, `cat3.jpeg`.
- Edit `./src/routes/+page.svelte` to add an `img` tag for `/cat1.jpeg` and import `./styles.css`:

  ```html
  <!-- +page.svelte -->

  <script>
  	import './styles.css';
  </script>

  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

  <p>
  	<img src="/cat1.jpeg" alt="Cat One" />
  </p>
  ```

- Create `./src/routes/styles.css` with code:

  ```css
  /* styles.css */

  h1 {
  	background-image: url(/cat2.jpeg);
  }
  ```

- Preview the changes locally using `npm run build && npm run preview -- --open`.

There should be a repeating cat image behind the H1 text, and another cat image below the welcome paragraph.

### Deploy Again

Push to GitHub to trigger and a new Vercel build with the added images:

- Run `git add -A && git commit -m 'add unoptimized cat images' && git push`
- Go to Vercel dashboard and click "Visit" for the deployed app (once it is done building and deploying).

You should see the same app as local on a domain like `https://svelte-vercel-optimized-images.vercel.app`

## Configure Vercel to Generate Optimized Images

Vercel will only generate optimized images if configured to do so in `.vercel/output/config.json`.

For this we will add a new build command that calls a custom script to modify the Vercel configuration JSON generated by `vite build`.

### New Build Command

First, edit `package.json` and add to the `scripts` section after the `build` entry the following:

```
"build:vercel": "PUBLIC_BUILD_VERCEL=true vite build && node scripts/add-optimized-images-to-vercel-output-config",
```

Vercel doesn't know to run our new `build:vercel` command, so visit the Vercel dashboard for the project and go to "Settings". Under "Build and Output Settings" > "Build Command" select OVERRIDE and change the build command to `npm run build:vercel` and save.

### Configuration Modification Script

This new `build:vercel` run script expects to call `./scripts/add-optimized-images-to-vercel-output-config.js`.

Create a `scripts` directory and file `add-optimized-images-to-vercel-output-config.js` with contents:

```js
// add-optimized-images-to-vercel-output-config.js

import fs from 'node:fs';

const config_file = '.vercel/output/config.json';
const config = JSON.parse(fs.readFileSync(config_file, 'utf8'));

config.images = {
	sizes: [640, 960, 1280],
	domains: ['svelte-vercel-optimized-images.vercel.app'], // YOUR DOMAIN HERE
	formats: ['image/avif', 'image/webp'],
	minimumCacheTTL: 300
};

fs.writeFileSync(config_file, JSON.stringify(config, null, '\t'));
```

You will need to change the `svelte-vercel-optimized-images.vercel.app` domain to match what you named your app/project.

This configuration modification tells Vercel to generate optimized images at sizes `640, 960, 1280` with file formats `'image/avif', 'image/webp'`. Next, we will specify and utilize these generated images in an `srcset` within our app.

### (UPDATE) Alternative to Build Script

It is now possible to pass the configuration to the Vercel adapter as documented in the [SvelteKit docs](https://kit.svelte.dev/docs/adapter-vercel#image-optimization).

To do this, make the adapter usage in `svelte.config.js` look something like that:

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
export default {
	kit: {
		adapter({
			images: {
				sizes: [640, 828, 1200, 1920, 3840],
				formats: ['image/avif', 'image/webp'],
				minimumCacheTTL: 300,
				domains: ['example-app.vercel.app'],
			}
		})
	}
};
```

To use the Vercel adapter, [you must install the underlying adapter](https://kit.svelte.dev/docs/adapter-auto#environment-specific-configuration).

## Use the Vercel Generated Optimized Images

The optimized images will be available behind a special URL provided by Vercel which looks something like:

- `<your-app-name>.vercel.app/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=42`

Notice you can additionally specify the size and quality like `&w=1280&q=42` which we will make use of for `srcset` ([`srcset` on MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)).

Additionally, we will use the `PUBLIC_BUILD_VERCEL=true` environment variable we set as part of the `vercel:build` npm run script to not have broken images when previewing the app locally.

### Create `Image.svelte`

Create a new folder under `./lib` called `components` and a new file under that called `Image.svelte`.

In this new file (`./src/lib/components/Image.svelte`) paste the following:

```svelte
<!-- Image.svelte -->

<script lang="ts">
	import { srcset } from '$lib/vercel-image';

	export let src;
	export let alt;
	export let quality;
	export let width = '';
	export let height = '';
	export let lazy = true;
</script>

<img
	srcset={srcset(src, undefined, quality)}
	sizes="
		(max-width: 640px) 640px,
		(max-width: 960px) 960px,
		1280px
	"
	{alt}
	{width}
	{height}
	loading={lazy ? 'lazy' : 'eager'}
/>
```

Looking closely you will see this produces `<img srcset=... sizes=... loading=... />` and uses a function imported from a file `$lib/vercel-image`. We need to create `$lib/vercel-image` by making a new file at `./src/lib/vercel-image.js` with contents:

```js
// vercel-image.js

import { dev } from '$app/environment';
import { PUBLIC_BUILD_VERCEL } from '$env/static/public';

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
```

Notice the `if (dev || PUBLIC_BUILD_VERCEL !== 'true') return src;` line which shortcircuits producing an `srcset` locally.

The exported `srcset` function will, for hard-coded sizes `[640, 960, 1280]` with default quality `90`, generate an `srcset` like:

```console
srcset=" /_vercel/image?url=%2Fcat1.jpeg&w=640&q=90 640w,
/_vercel/image?url=%2Fcat1.jpeg&w=960&q=90 960w,
/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=90 1280w"
```

Putting this all together, our `Image` component results in an `<img />` element like:

```html
<img
	alt="Third photo"
	srcset="
		/_vercel/image?url=%2Fcat1.jpeg&w=640&q=90   640w,
		/_vercel/image?url=%2Fcat1.jpeg&w=960&q=90   960w,
		/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=90 1280w
	"
	sizes="
		(max-width: 640px) 640px,
		(max-width: 960px) 960px,
		1280px
	"
	loading="lazy"
/>
```

### Using `Image.svelte`

To use it, edit `+page.svelte` and in the `<script>` tag add:

```svelte
<script>
	import './styles.css';
	import Image from '$lib/components/Image.svelte'; // IMPORT CUSTOM COMPONENT
</script>
```

Then where we had `<img src="/cat1.jpeg" alt="Cat One" />` replace that with:

```svelte
<Image src="/cat1.jpeg" alt="Cat One" quality={42} />
```

Notice the forward slash before the `/cat1.jpeg` src attribute; this will be automatically changed to point to `/_vercel/image?url=...` by our `srcset` function in `./lib/vercel-image.js`.

When not `PUBLIC_BUILD_VERCEL`, this will simply point to our static `/cat1.jpeg` image.

### Using `PUBLIC_BUILD_VERCEL` in CSS

We can also use the vercel optimized image using this pattern in the CSS stylesheet:

```css
/* style.css */

h1 {
	background-image: url(/cat1.jpeg);
}

.vercel-build h1 {
	background-image: url(/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=80);
}
```

Yes, you do have to type `/_vercel/image?url=...` in a `.vercel-build` override CSS class, as needed, when doing CSS. This could perhaps be automated out in a processing step.

In order for this CSS to work, we need to have `.vercel-build` injected onto some HTML element that wraps our app. One way we can do this is to wrap the existing `+page.svelte` HTML in a `div` with dynamic attribute of `class:vercel-build` like so:

```svelte
<!-- +page.svelte -->

<script>
	import './styles.css';
	import Image from '$lib/components/Image.svelte';
	import { PUBLIC_BUILD_VERCEL } from '$env/static/public';
</script>

<div class="app" class:vercel-build={PUBLIC_BUILD_VERCEL === 'true'}>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<p>
		<Image src="/cat1.jpeg" alt="Third photo" quality={42} />
	</p>
</div>
```

Notice the new import and addition of `class:vercel-build={PUBLIC_BUILD_VERCEL === 'true'}`.

## Test on Vercel

To test if the optimized images are being generated by Vercel and utilized in our app, commit all changes and push to GitHub. Vercel should use the updated build command `build:vercel` when building and deploying.

Right click to inspect the cat images and see they are using `srcset` pointing to `/_vercel/image?url=...` like:

`https://svelte-vercel-optimized-images.vercel.app/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=42`

You can also check the Network tab in the developer tools to see that the images are being served as AVIF:

![image](https://github.com/leoj3n/svelte-vercel-optimized-images/assets/990216/846afeb8-fc90-4695-998b-62389e71c9b5)

### Command Reference

#### Build and Preview

- `npm run build`
- `npm run preview -- --open`

#### `dev` Mode

- `npm run dev -- --open`

#### Optomized Images on Vercel

- `npm run build:vercel`

### References

- https://github.com/sveltejs/kit/pull/9787#issuecomment-1572876158
- https://github.com/Rich-Harris/sveltesnaps
- https://github.com/hartwm/vercel-images-sveltekit

### Possibly related?

- https://kit.svelte.dev/docs/images#sveltejs-enhanced-img

---

# Image Optimization and Cache Control with SvelteKit

### Notes on How `304` Caching Works

I noticed a difference in the response from optimized vs non-optimized links, and that lead me down the path of questioning how caching works with the whole `304` response strategy, and if that can be changed.

Here are some notes to self that may be useful for anyone else not familiar with how the `304` caching works on Vercel, or how to modify it so that the browser caches in a more traditional/familiar manner, and then falls back to making that network request.

---

### Linking WITH Vercel Image Optimization:

```html
<img src="/_vercel/image?url=%2Fsvg%2Frefs%2Fcard.svg&amp;w=300&amp;q=100">
```

#### Response headers with browser cache cleaned:

![image](https://github.com/vercel/community/assets/990216/86a201d1-1f98-462c-8ba5-108b5a7c4675)

NOTICE: Responds with `Last-Modified` and `HIT`.

#### Subsequent request:

![image](https://github.com/vercel/community/assets/990216/e853c109-8b7c-4267-ba66-3240f05f4bbd)

---

### Linking WITHOUT Vercel Image Optimization:

```html
<img src="/svg/refs/card.svg">
```

#### Response headers with browser cache cleaned:

![image](https://github.com/vercel/community/assets/990216/3435ad6d-73a8-4aa8-ad4d-c6f1ee7bb091)

NOTICE: Responds with `Etag` and `BYPASS`.

#### Subsequent request:

![image](https://github.com/vercel/community/assets/990216/9e9abaf1-4548-4387-8ec5-87aca78dcc06)

---

### Notice `HIT` vs `BYPASS`

Initially I was worried `BYPASS` instead of `HIT` for `X-Vercel-Cache` on the "non-optimized" SVG meant the cache at the edge was bypassed, but the following proves the CDN is still being used in both cases:

![image](https://github.com/vercel/community/assets/990216/54409e4a-1fd8-4d1e-8fe0-cc21a959b56e)

Because these `304` responses are less than the actual non-cached file size of `1.3 kB`, I have learned this means that Vercel is telling the browser the asset has not changed, and so the browser should go ahead and load the requested unchanged asset from its cache instead of re-downloading an updated version of the file.

From what I understand, observing the file size difference and `304` status is the best way to confirm that caching is working when the strategy is this `304` call-and-response, where the browser asks the server if its cache is still valid.

---

### `If-None-Match`/`Etag` vs `If-Modified-Since`/`Last-Modified`

#### Non-Optimized Request (`If-None-Match`/`Etag`)

I have learned that for "non-optimized" links like `*.vercel.app/svg/card.svg`, the request is sent with:

```
If-None-Match: W/"f38ba94d109a22a7b5f722a607dc0a6a"
```

This is an `Etag` that Vercel will use to decide if it should send a `304`, instead of `200` with the full file.

This is on a per-file basis; re-deploy to Vercel does not result in `200` for the asset unless the asset was itself modified as part of the re-deploy.

When it is a `304` the browser devtools will say "not from cache" when inspecting the `304` response in Network. This can be confusing at first, as the asset loads on the site so it must come from somewhere despite the browser saying this request was NOT served from a cache. There is obviously an underlying fact that the image is stored and pulled from a cache somewhere in the browser. It seems if you see an `Etag` was sent as part of the request header you can know that value is coming from an asset stored in the browser cache.

For this "non-optimized" request, I can see that `X-Vercel-Cache: BYPASS` is in the response, which is concerning if we are wanting be sure the Vercel edge cache is being used to serve the file. However if we do a hard reload, we get a `200 OK` response and this time it is `X-Vercel-Cache: HIT` so it looks like `BYPASS` only happens when it is a `304` which probably is just an internal implementation difference compared to "optimized" image request.

#### Optimized Request (`If-Modified-Since`/`Last-Modified`)

I have learned that for "optimized" links like `*.vercel.app/_vercel/image?url=%2Fsvg%2Fcard.svg&w=300&q=100`, the request is sent with:

```
If-Modified-Since: Thu, 15 Feb 2024 12:26:16 GMT
```

And so the strategy to check for file difference here is to use a date check instead of `Etag`.

The response regardless of `304` or `200` always contains `X-Vercel-Cache: HIT`, which is a bit different when compared to the "non-optimized" response which is `HIT` for `200` and `BYPASS` for `304`.

---

### Avoiding `304` Network Requests

> The If-Modified-Since header is used to specify the time at which the browser last received the requested resource. The If-None-Match header is used to specify the entity tag that the server issued with the requested resource when it was last received.

So, the browser stores which ever strategy (`If-None-Match` vs `If-Modified-Since`) it received originally with the initial cached file. Then, for future requests of that file, sends the `Etag` or `Last-Modified` value along to the Vercel CDN which can then reply with an `304` if the file has not changed.

But, what if we know a cached file like an SVG in this case will never change? Perhaps that SVG is referenced in multiple places (like an SVG sprite) and thus would incur multiple network requests and 304 responses...

In this case, we may want to tell visiting browsers to always just load from the local browser cache instead of pinging the Vercel CDN. That can be done by adding some configuration like the following to `vercel.json`:

```json
{
	"routes": [
		{
			"src": "/svg/.+",
			"headers": {
				"cache-control": "public, immutable, max-age=31536000"
			}
		}
	]
}
```

Note that a `vercel.json` in the root of the project does still get picked up by Vercel, and these setting will be taken in addition to the [build output](https://vercel.com/docs/build-output-api/v3/configuration) config that is generated by the Vercel adapter.

Now, when inspecting the Network requests for files under `/svg`, it will say `(disk cache)` for `Size` and `200` for `Status` instead of `~70 B` and `304`.

Make sure this configuration is added before any catch-all route, otherwise it will get swallowed, and not work.

### Conclusion

I can confirm that the edge cache is sending `304` for unmodified assets, and the browser does not re-download the asset file over the network. Furthermore, it is possible to tell Vercel CDN to send `Cache-Control` headers for certain requests, which allows me to tell the browser to cache the file locally and avoid the `304` roundtrip. Finally, seeing `BYPASS` for `X-Vercel-Cache` on a `304` response is not something to be worried about.
