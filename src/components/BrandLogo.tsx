import { useMemo, useState } from 'react';
import { getBrandLogoKey } from '@/utils/brandMapping';

interface BrandLogoProps {
	name: string;
	imageUrl?: string;
	size?: 'sm' | 'md';
	className?: string;
}

// Import brand logos - Vite will handle these as static assets
import netflixLogo from '@/assets/logos/netflix.svg?url';
import spotifyLogo from '@/assets/logos/spotify.svg?url';
import adobeLogo from '@/assets/logos/adobe.svg?url';
import notionLogo from '@/assets/logos/notion.svg?url';
import figmaLogo from '@/assets/logos/figma.svg?url';
import slackLogo from '@/assets/logos/slack.svg?url';
import githubLogo from '@/assets/logos/github.svg?url';
import googleLogo from '@/assets/logos/google.svg?url';
import youtubeLogo from '@/assets/logos/youtube.svg?url';
import appleLogo from '@/assets/logos/apple.svg?url';
import dropboxLogo from '@/assets/logos/dropbox.svg?url';
import microsoftLogo from '@/assets/logos/microsoft.svg?url';
import openaiLogo from '@/assets/logos/openai.svg?url';
import amazonLogo from '@/assets/logos/amazon.svg?url';

// Map brand keys to imported logo URLs
const brandLogoImports: Record<string, string> = {
	netflix: netflixLogo,
	spotify: spotifyLogo,
	adobe: adobeLogo,
	notion: notionLogo,
	figma: figmaLogo,
	slack: slackLogo,
	github: githubLogo,
	google: googleLogo,
	youtube: youtubeLogo,
	apple: appleLogo,
	dropbox: dropboxLogo,
	microsoft: microsoftLogo,
	openai: openaiLogo,
	amazon: amazonLogo,
};

/**
 * BrandLogo component - displays brand logo or fallback letter avatar
 * Priority: imageUrl > brand logo > first letter fallback
 */
export function BrandLogo({ name, imageUrl, size = 'md', className = '' }: BrandLogoProps) {
	const brandKey = useMemo(() => getBrandLogoKey(name), [name]);
	const [imageError, setImageError] = useState(false);
	const [brandError, setBrandError] = useState(false);

	// Logo size: 16px inside 40px container (per Figma)
	const containerSize = size === 'sm' ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10';
	const logoSize = 'w-4 h-4'; // 16px

	const renderLogo = () => {
		// Priority 1: Use imageUrl if provided and no error
		if (imageUrl && !imageError) {
			return (
				<img
					src={imageUrl}
					alt={name}
					className={`${logoSize} object-contain`}
					onError={() => setImageError(true)}
				/>
			);
		}

		// Priority 2: Use brand logo if available and no error
		if (brandKey && brandLogoImports[brandKey] && !brandError) {
			return (
				<img
					src={brandLogoImports[brandKey]}
					alt={name}
					className={`${logoSize} object-contain`}
					onError={() => setBrandError(true)}
				/>
			);
		}

		// Priority 3: Fallback to first letter
		const firstLetter = name.charAt(0).toUpperCase();
		return (
			<span className={`${logoSize} flex items-center justify-center font-semibold text-text-primary text-xs`}>
				{firstLetter}
			</span>
		);
	};

	return (
		<div className={`${containerSize} bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-2 ${className}`}>
			{renderLogo()}
		</div>
	);
}
