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
