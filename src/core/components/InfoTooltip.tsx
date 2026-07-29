import { useEffect, useRef, useState } from "react";

interface InfoTooltipProps {
	text: string;
}

/**
 * Small "info" indicator that shows `text` in a tap/click-to-toggle bubble.
 * Works on both desktop (click) and mobile/touch (tap), unlike a plain
 * `title` attribute which most mobile browsers never surface. Generic/
 * game-agnostic. If rendered inside a `<label>`, stops the click from
 * bubbling so it doesn't also toggle the label's associated control.
 */
export function InfoTooltip({ text }: InfoTooltipProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (e: PointerEvent) => {
			if (!ref.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open]);

	const toggle = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
		e.preventDefault();
		e.stopPropagation();
		setOpen((prev) => !prev);
	};

	return (
		<span
			ref={ref}
			className="info-tooltip"
			tabIndex={0}
			role="button"
			aria-expanded={open}
			aria-label={text}
			onClick={toggle}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") toggle(e);
			}}
		>
			ⓘ
			{open && <span className="info-tooltip-bubble">{text}</span>}
		</span>
	);
}
