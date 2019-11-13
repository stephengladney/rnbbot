## Slash commands

Slash command syntax:

/rnbot command params

Commands:

* ignore [number/string, ...] all

Instruct the bot to ignore a particular card in its current status and not send stagnation alerts. You can identify the card to ignore with partial title or card number. You can also search for multiple cards and mix strings and numbers across your queries.

Example: You are intentionally leaving a card in Ready for Merge)

/rnbot ignore 123456
/rnbot ignore lorem ipsum
/rnbot ignore all 


* stagnant [n hours]

Ask the bot to list all cards that have been stagnant for n hours. If no age is entered, the bot returns all cards it's currently monitoring.
