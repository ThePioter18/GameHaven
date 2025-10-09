const isNetlify = window.location.hostname.includes('netlify.app');
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
	baseURL: isNetlify
		? '/.netlify/functions' // Netlify Functions
		: isLocalhost
		? 'http://localhost:5000' // local Express backend
		: 'https://gamehaven-fvun.onrender.com/api', // production Render with the prefix /api
};

export default CONFIG;
