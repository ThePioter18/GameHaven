const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
	baseURL: isLocalhost ? 'http://localhost:5000' : process.env.RENDER_API_URL || '',
};

export default CONFIG;
