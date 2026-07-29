import { WithTooltip } from "../../../core/components/WithTooltip";
import { Gender } from "../../../core/types";
import type { AwakeningOptions } from "../types";

interface AwakeningOptionsFieldsProps {
	value: AwakeningOptions;
	onChange: (value: AwakeningOptions) => void;
}

function genderLabel(gender: Gender): string {
	return gender === "M" ? "Male" : "Female";
}

/**
 * Awakening-specific option controls: the avatar (Robin)'s gender, and
 * whether to roll marriage pairings (which determines children's class
 * options). Not every FE game has either of these mechanics.
 */
export function AwakeningOptionsFields({ value, onChange }: AwakeningOptionsFieldsProps) {
	return (
		<>
			<div className="option-group">
				<span className="group-label">Robin's Gender</span>
				<div className="radio-row">
					{(["random", "M", "F"] as const).map((gender) => (
						<label key={gender} className="radio-option">
							<input
								type="radio"
								name="avatar-gender"
								value={gender}
								checked={value.avatarGender === gender}
								onChange={() => onChange({ ...value, avatarGender: gender })}
							/>
							{gender === "random" ? "Random" : genderLabel(gender)}
						</label>
					))}
				</div>
			</div>

			<div className="option-group">
				<label className="checkbox-option">
					<input
						type="checkbox"
						checked={value.rollPairings}
						onChange={(e) => onChange({ ...value, rollPairings: e.target.checked })}
					/>
					Roll Pairings
				</label>

				<WithTooltip tooltip="The algorithm determines characters before pairings. This will make it favor pairing children's fixed parents with a potential parent already on the roster, when possible.">
					<label className="checkbox-option">
						<input
							type="checkbox"
							checked={value.preferRosterParents}
							onChange={(e) => onChange({ ...value, preferRosterParents: e.target.checked })}
						/>
						Prefer Roster Parents
					</label>
				</WithTooltip>
			</div>
		</>
	);
}
