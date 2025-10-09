const fs = require('fs');

if (!process.env.RENDER_API_URL) {
	console.error('❌ Brak zmiennej środowiskowej RENDER_API_URL!');
	process.exit(1);
}

const env = {
	baseURL: process.env.RENDER_API_URL,
};

const content = `window.CONFIG = ${JSON.stringify(env)};`;

fs.writeFileSync('public/env.js', content);
console.log('✅ env.js generated');
