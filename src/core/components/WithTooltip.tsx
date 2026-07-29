import type { ReactNode } from "react";
import { InfoTooltip } from "./InfoTooltip";

interface WithTooltipProps {
	tooltip: string;
	children: ReactNode;
}

/**
 * Lays `children` (e.g. a checkbox/radio `<label>`) out inline with a
 * trailing `InfoTooltip`, without nesting the tooltip inside `children`
 * itself (which matters when `children` is a `<label>`, since a nested
 * tooltip would otherwise toggle the label's control on click). Generic/
 * game-agnostic — use this instead of hand-rolling the wrapper span.
 */
export function WithTooltip({ tooltip, children }: WithTooltipProps) {
	return (
		<span className="tooltip-row">
			{children}
			<InfoTooltip text={tooltip} />
		</span>
	);
}
