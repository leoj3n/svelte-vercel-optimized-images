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
