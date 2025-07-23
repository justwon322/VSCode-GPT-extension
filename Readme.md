# VSCode GPT Extension

This extension provides a simple chat interface with a locally served Large Language Model (LLM) that is compatible with the OpenAI API. It collects the contents of all visible files in the workspace and sends them as context when querying the LLM.

## Features
- Command `Chat with LLM` accessible from the Command Palette.
- Sends open file contents to a local server running at `http://localhost:8000/v1/chat/completions`.

## Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile TypeScript:
   ```bash
   npm run compile
   ```
3. Open this folder in VS Code and press `F5` to launch the extension for debugging.

The local server must implement the OpenAI chat completion API.
