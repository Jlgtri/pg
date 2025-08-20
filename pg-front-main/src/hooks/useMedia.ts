'use client';
import { useMediaQuery } from 'react-responsive';

export const useMedia = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 480px)' });
	const isTablet = useMediaQuery({
		query: '(min-width: 480px) and (max-width: 1024px)'
	});
	const isMobileBig = useMediaQuery({
		query: '(min-width: 480px) and (max-width: 768px)'
	});

	return { isMobile, isMobileBig, isTablet, isDesktop: !isMobile && !isTablet };
};
