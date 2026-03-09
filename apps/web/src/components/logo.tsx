export default function Logo({
	className,
	animated,
}: { className?: string; animated?: boolean }) {
	return (
		<svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`${animated ? "logo-animated" : ""} ${className ?? ""}`}
			aria-hidden="true"
		>
			<polygon className={animated ? "logo-seg logo-seg-1" : undefined} points="16,2 8,10 16,12" fill="#f97316" style={animated ? { ['--seg-opacity' as string]: 0.9 } : undefined} opacity={animated ? undefined : 0.9} />
			<polygon className={animated ? "logo-seg logo-seg-2" : undefined} points="16,2 24,10 16,12" fill="#fb923c" style={animated ? { ['--seg-opacity' as string]: 0.85 } : undefined} opacity={animated ? undefined : 0.85} />
			<polygon className={animated ? "logo-seg logo-seg-3" : undefined} points="8,10 4,18 16,12" fill="#fdba74" style={animated ? { ['--seg-opacity' as string]: 0.8 } : undefined} opacity={animated ? undefined : 0.8} />
			<polygon className={animated ? "logo-seg logo-seg-4" : undefined} points="24,10 28,18 16,12" fill="#f97316" style={animated ? { ['--seg-opacity' as string]: 0.75 } : undefined} opacity={animated ? undefined : 0.75} />
			<polygon className={animated ? "logo-seg logo-seg-5" : undefined} points="16,12 4,18 10,26" fill="#fb923c" style={animated ? { ['--seg-opacity' as string]: 0.9 } : undefined} opacity={animated ? undefined : 0.9} />
			<polygon className={animated ? "logo-seg logo-seg-6" : undefined} points="16,12 28,18 22,26" fill="#fdba74" style={animated ? { ['--seg-opacity' as string]: 0.85 } : undefined} opacity={animated ? undefined : 0.85} />
			<polygon className={animated ? "logo-seg logo-seg-7" : undefined} points="16,12 10,26 16,30" fill="#f97316" style={animated ? { ['--seg-opacity' as string]: 0.8 } : undefined} opacity={animated ? undefined : 0.8} />
			<polygon className={animated ? "logo-seg logo-seg-8" : undefined} points="16,12 22,26 16,30" fill="#fb923c" style={animated ? { ['--seg-opacity' as string]: 0.75 } : undefined} opacity={animated ? undefined : 0.75} />
		</svg>
	);
}
