# The logic for the bot

-   The json files in the /lang folder contains all content for what will be static in bot commands.
    The reason for the /lang folder is to support multiple languages in the bot, which might be implemented in the
    future depending on how popular the bot is. Things like button texts should also go in it.
-   The constants folder in /src is for storing hard-coded things, like cards' suits and ranks.
-   The jobs folder is for most functions, like creating poker decks and generating memes
-   The lang.ts file is used for fetching things from the /lang folder

## The process of making a command

-   Make the file in /src/commands/chat
-   To start off, you can reference the test command, where the bare minimum sits.
-   If you want to send stuff in other forms, look in /services
-   Export the command from /commands/chat/index.ts
-   Import the command in start-bot.ts, and put a new instance of it inside the start() function

# Changelog

-   25/6/2023 (Elbert): Adding the main logic for poker card games, and added blackjack command.
    TODO: Add the logic for blackjack and work on other poker commands like texas hold'em.
