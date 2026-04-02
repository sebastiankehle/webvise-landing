"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface FooterCtaConfig {
	headline?: string;
	subtext?: string;
	buttonText?: string;
	buttonHref?: string;
	secondaryButtonText?: string;
	secondaryButtonHref?: string;
	hidden?: boolean;
}

const FooterCtaContext = createContext<FooterCtaConfig>({});

export function FooterCtaProvider({
	value,
	children,
}: {
	value: FooterCtaConfig;
	children: ReactNode;
}) {
	return (
		<FooterCtaContext.Provider value={value}>
			{children}
		</FooterCtaContext.Provider>
	);
}

export function useFooterCta() {
	return useContext(FooterCtaContext);
}
