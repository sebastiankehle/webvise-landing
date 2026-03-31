type TrackProperties = Record<string, string | number | boolean | null>;

export function track(_event: string, _properties?: TrackProperties) {
	// no-op: analytics provider removed
}
