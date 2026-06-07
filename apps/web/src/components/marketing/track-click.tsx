"use client";

import {
	Children,
	cloneElement,
	isValidElement,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from "react";
import { track } from "@/lib/track";

interface TrackClickProps {
	children: ReactNode;
	event: string;
	properties?: Record<string, string | number | boolean | null>;
}

interface ClickableProps {
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function TrackClick({ event, properties, children }: TrackClickProps) {
	const childArray = Children.toArray(children);
	if (childArray.length !== 1) {
		return <>{children}</>;
	}
	const child = childArray[0];
	if (!isValidElement<ClickableProps>(child)) {
		return <>{children}</>;
	}
	const existing = child.props.onClick;
	return cloneElement(child as ReactElement<ClickableProps>, {
		onClick: (e: MouseEvent<HTMLElement>) => {
			track(event, properties);
			existing?.(e);
		},
	});
}
