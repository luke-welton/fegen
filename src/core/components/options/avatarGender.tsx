const genderOptions = ["M", "F", "random"] as const;
export type GenderOptions = typeof genderOptions[number];

export function AvatarGenderOption(props: {
	avatarName: string;
	value: GenderOptions;
	onChange: (value: GenderOptions) => void;
}) {
	return (
		<div className="option-group">
			<span className="group-label">{props.avatarName}'s Gender</span>
			<div className="radio-row">
				{genderOptions.map((value) => (
					<label key={value} className="radio-option">
						<input
							type="radio"
							name="avatar-gender"
							value={value}
							checked={props.value === value}
							onChange={() => props.onChange(value)}
						/>
						{value === "random" ? "Random" : value === "M" ? "Male" : "Female"}
					</label>
				))}
			</div>
		</div>
	);
}
