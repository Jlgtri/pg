import { useEffect, useState } from 'react';

export const useWindowSize = () => {
	const [size, setSize] = useState([500, 500]);

	useEffect(() => {
		const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		width: size[0],
		height: size[1]
	};
};
