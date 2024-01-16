[![image](https://github.com/leoj3n/svelte-vercel-optimized-images/assets/990216/8d466747-7d1f-4f69-bf16-e0f3b307d7ab)](https://svelte-vercel-optimized-images.vercel.app/)

# svelte-vercel-optimized-images

This project demonstrates how you might configure Vercel to generate optimized images for SvelteKit.

- [Create a SvelteKit App and Deploy to Vercel](#create-a-sveltekit-app-and-deploy-to-vercel)
  * [Create a SvelteKit Skeleton Project](#create-a-sveltekit-skeleton-project)
  * [Push to GitHub](#push-to-github)
  * [Deploy to Vercel](#deploy-to-vercel)
- [Add Some Images and Deploy Again](#add-some-images-and-deploy-again)
  * [Add Some Images](#add-some-images)
  * [Deploy Again](#deploy-again)
- [Configure Vercel to Generate Optimized Images](#configure-vercel-to-generate-optimized-images)
  * [New Build Command](#new-build-command)
  * [Configuration Modification Script](#configuration-modification-script)
- [Use the Vercel Generated Optimized Images](#use-the-vercel-generated-optimized-images)
  * [Create `Image.svelte`](#create-imagesvelte)
  * [Using `Image.svelte`](#using-imagesvelte)
  * [Using `PUBLIC_BUILD_VERCEL` in CSS](#using-public_build_vercel-in-css)
- [Test on Vercel](#test-on-vercel)
  * [Command Reference](#command-reference)
    + [Build and Preview](#build-and-preview)
    + [`dev` Mode](#dev-mode)
    + [Optomized Images on Vercel](#optomized-images-on-vercel)
  * [References](#references)
  * [Possibly related?](#possibly-related)

## Create a SvelteKit App and Deploy to Vercel

If you haven't got a SvelteKit app already deployed to Vercel, follow these steps...

### Create a SvelteKit Skeleton Project

- `npm create svelte@latest svelte-vercel-optimized-images`
  <details>
    <summary>(click here to see selected creation options)</summary>
    
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

## Use the Vercel Generated Optimized Images

The optimized images will be available behind a special URL provided by Vercel which looks something like:

- `<your-app-name>.vercel.app/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=42`

Notice you can additionally specify the size and quality like `&w=1280&q=42` which we will make use of for `srcset` ([`srcset` on MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)).

Additionally, we will use the `PUBLIC_BUILD_VERCEL=true` environment variable we set as part of the `vercel:build` npm run script to not have broken images when previewing the app locally.

### Create `Image.svelte`

Create a new folder under `./lib` called `components` and a new file under that called `Image.svelte`.

In this new file (`./src/lib/components/Image.svelte`) paste the following:

```svelte
// Image.svelte

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
	sizes="(max-width: 640px) 640px,
           (max-width: 960px) 960px,
            1280px"
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

```html
srcset="
  /_vercel/image?url=%2Fcat1.jpeg&amp;w=640&amp;q=90 640w,
  /_vercel/image?url=%2Fcat1.jpeg&amp;w=960&amp;q=90 960w,
  /_vercel/image?url=%2Fcat1.jpeg&amp;w=1280&amp;q=90 1280w"
```

Putting this all together, our `Image` component results in an `<img />` element like:

```html
<img alt="Third photo"
  srcset="
    /_vercel/image?url=%2Fcat1.jpeg&amp;w=640&amp;q=90 640w,
    /_vercel/image?url=%2Fcat1.jpeg&amp;w=960&amp;q=90 960w,
    /_vercel/image?url=%2Fcat1.jpeg&amp;w=1280&amp;q=90 1280w"
  sizes="(max-width: 640px) 640px,
       (max-width: 960px) 960px,
        1280px"
  loading="lazy" />
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

When not a `PUBLIC_BUILD_VERCEL`, this will simply point to our static `/cat1.jpeg` image.

### Using `PUBLIC_BUILD_VERCEL` in CSS

We can also use the vercel optimized image using this pattern in the CSS stylesheet:

```css
h1 {
  background-image: url(/cat1.jpeg);
}

.vercel-build h1 {
  background-image: url(/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=80);
}
```

Yes, you do have to type `/_vercel/image?url=...` in a `.vercel-build` override CSS class, as needed, when doing CSS. This could perhaps be automated in with yet another processing step if desired/implemented.

In order for this CSS to work, we need to have `.vercel-build` injected onto some HTML element that wraps our app.

One way we can do this is to wrap the existing `+page.svelte` HTML in a `div` with dynamic `class:vercel-build` like so:

```svelte
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

