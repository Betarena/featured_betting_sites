import App from './App.svelte';

const app = new App({
	target: document.querySelector("#sveltead"),
	props: {
		name: 'world'
	}
});

export default app;