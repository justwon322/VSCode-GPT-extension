# VSCode GPT Extension

This extension provides a simple chat interface that streams responses from a local Python script using the OpenAI API. It collects the contents of all visible files in the workspace and sends them as context when querying the LLM.

## Features
- Command `Chat with LLM` accessible from the Command Palette.
- Streams responses from `py/chat.py` which calls the OpenAI API.

## Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Python requirements:
   ```bash
   pip install openai
   ```
3. Compile TypeScript:
   ```bash
   npm run compile
   ```
4. Set the `OPENAI_API_KEY` environment variable.
5. Open this folder in VS Code and press `F5` to launch the extension for debugging.

The Python script uses the OpenAI chat completion API and streams tokens back to VS Code.
