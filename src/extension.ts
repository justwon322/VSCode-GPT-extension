import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

let mode: 'coding' | 'question' = 'question';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('gptExtension.toggleMode', () => {
            mode = mode === 'coding' ? 'question' : 'coding';
            vscode.window.showInformationMessage(`GPT mode switched to ${mode}`);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('gptExtension.ask', async () => {
            const prompt = await vscode.window.showInputBox({ prompt: `Ask (${mode} mode)` });
            if (!prompt) { return; }
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                vscode.window.showErrorMessage('OPENAI_API_KEY not set');
                return;
            }
            let contextText = '';
            if (mode === 'coding' && vscode.workspace.workspaceFolders) {
                const files = await getAllFiles(vscode.workspace.workspaceFolders[0].uri.fsPath);
                for (const file of files) {
                    if (fs.statSync(file).size > 50000) continue;
                    contextText += `FILE: ${file}\n` + fs.readFileSync(file, 'utf8') + '\n';
                }
            }
            const body = {
                model: 'gpt-3.5-turbo',
                stream: true,
                messages: [
                    { role: 'system', content: 'You are a coding assistant.' },
                    { role: 'user', content: prompt + '\n' + contextText }
                ]
            };
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            });
            if (!response.body) { vscode.window.showErrorMessage('No response body'); return; }
            const decoder = new TextDecoder('utf8');
            let output = '';
            const reader = (response.body as unknown as Readable).on('data', (chunk) => {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.replace('data:','').trim();
                        if (data === '[DONE]') return;
                        try {
                            const json = JSON.parse(data);
                            const text = json.choices[0]?.delta?.content || '';
                            output += text;
                            vscode.window.activeTextEditor?.edit(edit => {
                                edit.insert(vscode.window.activeTextEditor!.selection.active, text);
                            });
                        } catch {}
                    }
                }
            });
            await new Promise(resolve => reader.on('end', resolve));
            vscode.window.showInformationMessage('Response received');
        })
    );
}

async function getAllFiles(dir: string): Promise<string[]> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getAllFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

export function deactivate() {}
