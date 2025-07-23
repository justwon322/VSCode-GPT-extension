# GPT Coding Assistant

This VS Code extension provides a simple interface to OpenAI's chat completions API with streaming responses. The extension allows switching between **coding** and **question** mode. In coding mode, all files from the current workspace are appended to your prompt so the model can reference your codebase.

## Features

- Streaming responses using OpenAI API.
- Toggle between coding and question mode using the command palette (`GPT: Toggle Mode`).
- Ask a question via `GPT: Ask` and optionally insert the streamed answer directly into the active editor.

## Usage

1. Set an `OPENAI_API_KEY` environment variable available to VS Code.
2. Run `npm run compile` to build the extension.
3. Launch the extension in the Extension Development Host.

In coding mode the extension reads all files under the first workspace folder (up to 50 KB each) and sends their contents along with your prompt.
