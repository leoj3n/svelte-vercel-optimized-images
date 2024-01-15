# svelte-vercel-optimized-images Demo App

This Svelte app demonstrates how you might setup optimized images using Vercel.

## The basic idea is taken from:

- https://github.com/sveltejs/kit/pull/9787#issuecomment-1572876158
- https://github.com/Rich-Harris/sveltesnaps
- https://github.com/hartwm/vercel-images-sveltekit

## Steps taken to generate app

- `npm create svelte@latest svelte-vercel-optimized-images`

<details>
  <summary>Command output</summary>
  
```
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
- `git init && git add -A && git commit -m 'init'`
- Go to your GitHub profile page and select the "+" in top right to click "New repository".
- Name repository like "svelte-vercel-optimized-images".
- `git remote add origin https://github.com/<username>/svelte-vercel-optimized-images.git`
- `git branch -M main && git push -u origin main`
- `git push`

# Adding Vercel Optimized Image Code

## Setup Vercel

- Go to https://vercel.com/signup
- Continue with GitHub
- Select "Import Project"
- Import "svelte-vercel-optimized-images"
- Click "Deploy"

## Edit project in Visual Studio Code

The generated svelte app is now pushed to a GitHub repository and hosted on Vercel.

The next steps are to add some images and use them in the app, and then make them optimized by Vercel.

### Add some cat images to the app

- Go to <https://placekitten.com> and right-click download any three cat images.
- Save the images to the project under the `./static` directory and name them `cat1.jpeg`, `cat2.jpeg`, `cat3.jpeg`.
- Now add a cat image to the app page...
  - Edit `./src/routes/+page.svelte` and add an `img` tag pointing to `/cat1.jpeg` as well as import `./styles.css` which will be created next:

```html
<script>
  import './styles.css';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>
    <img src="./cat1.jpeg" alt="Cat One" />
</p>
```
  - Create `./src/routes/styles.css` with code:

```css
h1 {
  background-image: url(/cat2.jpeg);
}
```

- Preview to see the unoptimized cat images by running `npm run preview -- --open`
  - You should see a repeating cat image behind the H1 text, and the other cat image below the welcome paragraph.

### Publish to Vercel

Now let's publish the app to Vercel again with these unoptimized cat images.

Simply add the changes to git and push to GitHub to trigger a new Vercel build...

- `git add -A && git commit -m 'add unoptimized cat images' && git push
- Go to Vercel dashboard and click "Visit" for the deployed app (once it is done building and deploying).
- You should see the two cat images on a domain like `https://svelte-vercel-optimized-images.vercel.app/`

### Tell Vercel to generate optimized images

In order to optimize the cat images, we will need to add some dependencies using `npm`, create some new script files, and edit our `img` tags to use a new custom component we will create.

First, edit `package.json` and add to the `scripts` section after the `build` entry the following:

```
"build:vercel": "PUBLIC_BUILD_VERCEL=true vite build && node scripts/add-optimized-images-to-vercel-output-config",
```

This calls a script post build named `./scripts/add-optimized-images-to-vercel-output-config.js`. Let's create that directory and file now with contents:

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

What this script does is modify the `.vercel/output/config.json` which is generated during the `vite build` command.

This `config.json` is what Vercel uses to configure the deployed app, and our `./scripts/add-optimized-images-to-vercel-output-config.js` adds the outlined configuration options to the JSON object.

You will need to change the `svelte-vercel-optimized-images.vercel.app` domain to match what you named your app/project.

What this configuration addition does is tell Vercel to generate optimized images at sizes `640, 960, 1280` with file formats `'image/avif', 'image/webp'`. We will specify and utilize these in an `srcset` within our app.

Vercel doesn't know to run our new `build:vercel` command that we added to the scripts section of `package.json`, so visit the Vercel dashboard for the project and go to "Settings".

Under "Build and Output Settings" > "Build Command" select the OVERRIDE toggle and change the build command to `npm run build:vercel` and save.

At this point we are telling Vercel to generate the optimized images but are not making use of them in our app yet.

### Use the Vercel generated optimized images in our app

The optimized images will be available behind a special URL provided by Vercel when the images config is provided like we have done.

This url looks something like: `<your-app-name>.vercel.app/_vercel/image?url=%2Fcat1.jpeg&w=1280&q=42`

Notice you can additionally specify the size and quality which we will make use of soon using `srcset` for the HTML `img` tag.

You can read more about `srcset` on MDN: <https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images>

We will create a new custom Svelte component to generate an `<img>` tag that contains the `srcset` correlating to what we know Vercel will generate for us.

Additionally, we will use the `PUBLIC_BUILD_VERCEL=true` environment variable we set as part of the `vercel:build` npm run script to not have broken images when previewing the app locally.

#### Create a new component called `Image.svelte`

Create a new folder under `./lib` called `components` and a new file under that called `Image.svelte`.

In this new file `./src/lib/components/Image.svelte` paste the following:

```svelte
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

Looking closely you will see this produces `<img srcset=... sizes=... loading=... />` and uses a function imported from a file `$lib/vercel-image`.

We need to create `$lib/vercel-image` by making a new file at `./src/lib/vercel-image.js` with contents:

```js
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
```

What the exported `srcset` function does is for hard-coded sizes `[640, 960, 1280]` with default quality `90`, generate the `srcset` html which ends up looking like:

```html
srcset="/_vercel/image?url=%2Fcat1.jpeg&amp;w=640&amp;q=42 640w, /_vercel/image?url=%2Fcat1.jpeg&amp;w=960&amp;q=42 960w, /_vercel/image?url=%2Fcat1.jpeg&amp;w=1280&amp;q=42 1280w"
```

Notice the `if (dev || PUBLIC_BUILD_VERCEL !== 'true') return src;` line which shortcircuits producing an `srcset` for the normal resolution image when previewing locally or not on Vercel.

Now we can utilize this new `Image.svelte` component in our app.

#### Use our new `Image.svelte` component

To use it, edit `+page.svelte` and in the `<script>` tag add:

```svelte
<script>
  import './styles.css';
  import Image from '$lib/components/Image.svelte';
</script>
```

Then where we had `<img src="./cat1.jpeg" alt="Cat One" />` replace that with:

```svelte
<Image src="/cat1.jpeg" alt="Cat One" quality={42} />
```

Notice the forward slash before the `/cat1.jpeg` src attribute; this will be automatically changed to point to `/_vercel/image?url=...` by our `srcset` function in `./lib/vercel-image.js`.

When not a `PUBLIC_BUILD_VERCEL`, this will simply point to our static `/cat1.jpeg` image.

We can also use the vercel optimized image using this pattern in the CSS stylesheet:

```css
.vercel-build h1 {
  background-image: url(/_vercel/image?url=%2Fimages%2Fangle-envelope.png&w=1280&q=80);
}
```

## Commands to build and preview

- `npm run dev -- --open`
- `npm run build`
- `npm run preview -- --open`

- `npm run build:vercel`

## Possibly related

- https://kit.svelte.dev/docs/images#sveltejs-enhanced-img

