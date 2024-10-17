import { Theme } from "@radix-ui/themes";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

<Card size="3">
	<Flex align="center" justify="between" mb="5">
		<Heading as="h3" size="4" trim="both">
			History
		</Heading>

		<Flex my="-1" gap="4">
			<Button size="2" variant="ghost">
				Clear
			</Button>
		</Flex>
	</Flex>

	<Flex direction="column" gap="4">
		{songsHistory.map((song, i) => (
			<Flex align="center" gap="3" key={song.name}>
				<Box asChild width="48px" height="48px">
					<img
						src={song.cover}
						style={{
							objectFit: "cover",
							borderRadius: "var(--radius-2)",
						}}
					/>
				</Box>
				<Box flexGrow="1" width="0">
					<Text as="div" size="2" truncate>
						{song.name}
					</Text>
					<Text as="div" size="1" color="gray" truncate>
						{song.artist} – {song.album}
					</Text>
				</Box>
				<Box>
					<Text as="div" size="2" color="gray">
						{song.length}
					</Text>
				</Box>
			</Flex>
		))}
	</Flex>
</Card>;
