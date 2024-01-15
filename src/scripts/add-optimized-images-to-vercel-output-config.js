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