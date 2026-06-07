type FeatureFlagGroups = Record<string, Record<string, boolean>>;

export const featureFlags = {
	marketing: {
		aboutNetworkSection: false,
	},
} as const satisfies FeatureFlagGroups;
