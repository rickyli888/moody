import React, { useState } from "react";
import { moodMap } from "../app/api/spotify";

interface MoodSelectorProps {
	onMoodSelect: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
	const [selectedMood, setSelectedMood] = useState<string | null>(null);

	const handleMoodSelect = (mood: string) => {
		setSelectedMood(mood);
		onMoodSelect(mood);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{Object.entries(moodMap).map(([mood, { name }]) => (
					<button
						key={mood}
						className={`p-2 rounded-md ${
							selectedMood === mood
								? "bg-blue-500 text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
						onClick={() => handleMoodSelect(mood)}>
						{name}
					</button>
				))}
			</div>
			{selectedMood && (
				<p className="mt-4">You selected: {moodMap[selectedMood].name}</p>
			)}
		</div>
	);
};

export default MoodSelector;
