This is a simple project for learning how to query APIs and work with LLM models. 

The current version creates a locally hosted website where a user enters the name of a character from Lord of the Rings. The application queries the Lord of the Rings fan API and if the name matches an entry in the API, it is sent off to the OpenAI API as part of a prompt requesting information about the character in a lore-friendly voice. 

Future features:
- ensure the user can type in natural language and not just a single word that needs to match the name of a character.
- query additional information beyond character names from the LOTR API and store them in a cache to increase responsiveness and expand what the app can talk about.
- cross reference any found objects, and update the prompt instructions for the agent to detail the relationships between those objects. 
- convert from a single entry to a chatbot style user interaction. 
- create terraform code for a cloud deployment option.