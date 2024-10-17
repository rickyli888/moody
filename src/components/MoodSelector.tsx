import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Mood {
	name: string;
	emoji: string;
}

interface MoodSelectorProps {
	onMoodSelect: (mood: string) => void;
}

const moods: Mood[] = [
	{ name: "Happy", emoji: "😊" },
	{ name: "Sad", emoji: "😢" },
	{ name: "Energetic", emoji: "⚡" },
	{ name: "Calm", emoji: "😌" },
	{ name: "Focused", emoji: "🧠" },
	{ name: "Excited", emoji: "🎉" },
	{ name: "Relaxed", emoji: "🌴" },
	{ name: "Angry", emoji: "😠" },
	{ name: "Romantic", emoji: "❤️" },
	{ name: "Nostalgic", emoji: "🕰️" },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
	const [input, setInput] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const moodSuggestions = [
		"energetic workout",
		"relaxing evening",
		"productive work session",
		"romantic dinner",
		"party night",
		"morning motivation",
		"study focus",
		"road trip",
		"meditation",
		"cooking session",
		"gaming marathon",
	];

	useEffect(() => {
		if (input.length > 0) {
			const filtered = moodSuggestions.filter((suggestion) =>
				suggestion.toLowerCase().includes(input.toLowerCase())
			);
			setSuggestions(filtered.slice(0, 5));
		} else {
			setSuggestions([]);
		}
	}, [input]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			onMoodSelect(input.trim());
		}
	};

	const handleEmojiSelect = (mood: Mood) => {
		onMoodSelect(`${mood.emoji} ${mood.name}`);
	};

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="grid grid-cols-5 gap-2">
				{moods.map((mood) => (
					<motion.button
						key={mood.name}
						onClick={() => handleEmojiSelect(mood)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className="p-2 text-2xl bg-card rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-card-foreground">
						{mood.emoji}
					</motion.button>
				))}
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="relative">
					<Input
						type="text"
						placeholder="Or describe your mood/activity..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full p-4 text-lg border-2 border-border rounded-lg focus:border-primary focus:ring focus:ring-primary-foreground transition duration-200"
					/>
					<AnimatePresence>
						{suggestions.length > 0 && (
							<motion.ul
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg mt-1">
								{suggestions.map((suggestion, index) => (
									<motion.li
										key={suggestion}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
										className="cursor-pointer p-2 hover:bg-muted text-muted-foreground transition duration-200"
										onClick={() => {
											setInput(suggestion);
											setSuggestions([]);
										}}>
										{suggestion}
									</motion.li>
								))}
							</motion.ul>
						)}
					</AnimatePresence>
				</div>
				<Button
					type="submit"
					className="w-full p-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold rounded-lg hover:from-primary hover:to-secondary transition duration-300">
					Generate Playlist
				</Button>
			</form>
		</div>
	);
};

export default MoodSelector;
