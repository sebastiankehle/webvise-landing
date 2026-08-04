type FeatureFlagGroups = Record<string, Record<string, boolean>>;

export const featureFlags = {
	marketing: {
		aboutNetworkSection: true,
	},
} as const satisfies FeatureFlagGroups;
