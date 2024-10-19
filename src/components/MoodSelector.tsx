import React, { useState, useEffect, useMemo } from "react";
import { Theme } from "@radix-ui/themes";

import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
	Box,
	Card,
	Flex,
	Heading,
	Text,
	Grid,
	Button,
	ScrollArea,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface Mood {
	name: string;
	emoji: string;
}

interface MoodSelectorProps {
	onMoodSelect: (mood: string, genres: string[]) => void;
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
];

const genres = [
	"Pop",
	"Rock",
	"Hip-Hop",
	"R&B",
	"Country",
	"Jazz",
	"Blues",
	"Electronic",
	"Experimental",
	"Reggae",
	"Ska",
	"Grunge",
	"Psychedelic",
	"Post-Rock",
	"Progressive Rock",
	"Dream Pop",
	"Ambient",
	"Classical",
	"Trip-Hop",
	"Gospel",
	"Folk",
	"Indie",
	"Alternative",
	"Punk",
	"Metal",
	"Funk",
	"Soul",
	"Dance",
	"Techno",
	"Acoustic",
	"House",
	"Dubstep",
	"Latin",
	"Salsa",
	"K-pop",
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
	const [input, setInput] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

	const moodSuggestions = useMemo(
		() => [
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
		],
		[]
	);

	useEffect(() => {
		if (input.length > 0) {
			const filtered = moodSuggestions.filter((suggestion) =>
				suggestion.toLowerCase().includes(input.toLowerCase())
			);
			setSuggestions(filtered.slice(0, 5));
		} else {
			setSuggestions([]);
		}
	}, [input, moodSuggestions]);

	const handleSubmit = () => {
		if (input.trim()) {
			onMoodSelect(input.trim(), selectedGenres);
		}
	};

	const handleEmojiSelect = (mood: Mood) => {
		setInput(`${mood.emoji} ${mood.name}`);
	};

	const handleGenreToggle = (genre: string) => {
		setSelectedGenres((prev) =>
			prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
		);
	};

	const handleStartOver = () => {
		setInput("");
		setSelectedGenres([]);
	};

	return (
		<Theme accentColor="teal">
			<Card size="3" style={{ padding: "24px" }}>
				<Flex direction="column" gap="6">
					<Flex align="center" justify="between">
						<Heading as="h2" size="6" trim="both">
							Create a playlist
						</Heading>
						<Flex gap="2">
							<Button variant="soft" onClick={handleStartOver}>
								Start over
							</Button>
							<Button onClick={handleSubmit}>Make playlist</Button>
						</Flex>
					</Flex>

					<Box>
						<Heading as="h3" size="4" mb="3">
							How are you feeling?
						</Heading>
						<Grid columns="4" gap="4">
							{moods.map((mood) => (
								<Flex key={mood.name} direction="column" align="center" gap="2">
									<motion.button
										onClick={() => handleEmojiSelect(mood)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="p-4 text-4xl bg-card hover:bg-accent rounded-full shadow-sm hover:shadow-md transition-all duration-200"
										aria-label={`Select ${mood.name} mood`}>
										{mood.emoji}
									</motion.button>
									<Text size="2">{mood.name}</Text>
								</Flex>
							))}
						</Grid>
					</Box>

					<Box position="relative">
						<Heading as="h3" size="4" mb="3">
							Or describe your mood/activity
						</Heading>
						<Flex align="center" gap="2">
							<Box flexGrow="1">
								<Input
									type="text"
									placeholder="e.g., energetic workout, relaxing evening..."
									value={input}
									onChange={(e) => setInput(e.target.value)}
									className="w-full p-3 text-base pr-10"
								/>
							</Box>
							<Box
								position="absolute"
								right="3"
								top="50%"
								style={{ transform: "translateY(-50%)" }}>
								<MagnifyingGlassIcon width="20" height="20" />
							</Box>
						</Flex>
						<AnimatePresence>
							{suggestions.length > 0 && (
								<motion.ul
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1">
									{suggestions.map((suggestion, index) => (
										<motion.li
											key={suggestion}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}
											className="cursor-pointer p-2 hover:bg-accent transition-colors duration-200"
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
					</Box>

					<Box>
						<Flex justify="between" align="baseline" mb="3">
							<Heading as="h3" size="4">
								Select Genres
							</Heading>
							<Text size="2" color="gray">
								{selectedGenres.length} selected
							</Text>
						</Flex>
						<ScrollArea style={{ height: "200px" }}>
							<Grid columns="3" gap="2">
								{genres.map((genre) => (
									<Button
										key={genre}
										size="2"
										variant={selectedGenres.includes(genre) ? "solid" : "soft"}
										onClick={() => handleGenreToggle(genre)}>
										{genre}
									</Button>
								))}
							</Grid>
						</ScrollArea>
					</Box>
				</Flex>
			</Card>
		</Theme>
	);
};

export default MoodSelector;
