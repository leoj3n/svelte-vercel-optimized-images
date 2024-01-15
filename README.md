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

- `git add -A && git commit -m 'add unoptimized cat images'
- Go to Vercel dashboard and click "Visit" for the deployed app once it is done building.

### Optimize the images using Vercel

- Under "Build and Output Settings" > "Build Command" select the OVERRIDE toggle and change the build command to `npm run build:vercel`.

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

