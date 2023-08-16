import App from './App.svelte';
import * as buffer from 'buffer/';
window.Buffer = buffer.Buffer ;

const app = new App({
	target: document.body
});

export default app;