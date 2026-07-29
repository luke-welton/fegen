export interface RosterCardProps {
	name: string;
	meta: string;
	/** Optional extra line (e.g. Awakening's "Parents: X & Y"). */
	note?: string;
	/** Optional extra class name for game-specific styling hooks. */
	className?: string;
}

/**
 * Generic roster card: a unit's name, a meta line (e.g. gender/class), and
 * an optional extra note line. Fully game-agnostic — games that need
 * additional per-unit content/props should wrap this with their own
 * component (e.g. `AwakeningRosterCard`) rather than modifying it.
 */
export function RosterCard({ name, meta, note, className }: RosterCardProps) {
	return (
		<li className={`roster-card${className ? ` ${className}` : ""}`}>
			<div className="roster-card-name">{name}</div>
			{meta && <div className="roster-card-meta">{meta}</div>}
			{note && <div className="roster-card-note">{note}</div>}
		</li>
	);
}
