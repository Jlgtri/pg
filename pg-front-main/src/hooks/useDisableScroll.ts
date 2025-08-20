export const disableScroll = () => {
	document.documentElement.style.height = '100vh';
	document.body.style.height = '100vh';
	document.body.style.overflow = 'hidden';
};

export const enableScroll = () => {
	document.documentElement.style.height = '';
	document.body.style.height = '';
	document.body.style.overflow = '';
};

export const useDisableScroll = () => {
	return { enableScroll, disableScroll };
};
