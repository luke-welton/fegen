import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type { Unit } from "./core/types";
import type { GenerationOptions, GenerationResults, TeamMember } from "./core/types/generation";
import { games, getGameModule } from "./games";

function App() {
	const [gameId, setGameId] = useState(games[0].id);
	const gameModule = useMemo(() => getGameModule(gameId), [gameId]);

	const [options, setOptions] = useState<GenerationOptions>(() => gameModule.defaultOptions);
	const [results, setResults] = useState<GenerationResults<Unit, TeamMember<Unit>> | null>(null);

	const forceableUnits = useMemo(() => gameModule.data.units.filter((u) => u.forcedDeploy), [gameModule]);

	// Reset options (and any generated results) whenever the game changes, since
	// option shapes, team size, and unit ids aren't shared across games.
	useEffect(() => {
		setOptions(gameModule.defaultOptions);
		setResults(null);
	}, [gameModule]);

	const toggleForcedUnit = (id: string, checked: boolean) => {
		setOptions((prev) => ({
			...prev,
			forcedUnitIds: checked ? [...prev.forcedUnitIds, id] : prev.forcedUnitIds.filter((x) => x !== id),
		}));
	};

	const handleGenerate = () => {
		setResults(gameModule.generate(options));
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>Fire Emblem Team Generator</h1>
				<p className="subtitle">Randomly assemble a squad &mdash; built to grow beyond Awakening.</p>
			</header>

			<section className="options-panel">
				<div className="option-group">
					<label htmlFor="game-select">Game</label>
					<select id="game-select" value={gameId} onChange={(e) => setGameId(e.target.value)}>
						{games.map((g) => (
							<option key={g.id} value={g.id}>
								{g.name}
							</option>
						))}
					</select>
				</div>

				<gameModule.OptionsFields value={options} onChange={setOptions} />

				{forceableUnits.length > 0 && (
					<div className="option-group">
						<span className="group-label">Forced Deploys</span>
						<div className="radio-row">
							{forceableUnits.map((u) => (
								<label key={u.id} className="checkbox-option">
									<input
										type="checkbox"
										checked={options.forcedUnitIds.includes(u.id)}
										onChange={(e) => toggleForcedUnit(u.id, e.target.checked)}
									/>
									Force {u.name} to deploy
								</label>
							))}
						</div>
					</div>
				)}

				<button className="generate-button" onClick={handleGenerate}>
					Generate Team
				</button>
			</section>

			{results && <gameModule.Results gameData={gameModule.data} results={results} />}
		</div>
	);
}

export default App;

