import * as vscode from 'vscode';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('vscode-gpt-extension.chat', async () => {
    const question = await vscode.window.showInputBox({
      prompt: 'Ask LLM a question'
    });
    if (!question) {
      return;
    }

    const editors = vscode.window.visibleTextEditors;
    const files = editors.map(e => ({ path: e.document.fileName, content: e.document.getText() }));

    const messages = [
      { role: 'system', content: 'You are a coding assistant. Use project context to help.' },
      { role: 'user', content: question },
      { role: 'system', content: 'Project files: ' + files.map(f => `${f.path}:\n${f.content}`).join('\n\n') }
    ];

    const output = vscode.window.createOutputChannel('LLM Chat');
    output.show(true);
    output.appendLine('Streaming response...');

    const python = spawn('python3', [context.asAbsolutePath('py/chat.py')]);
    const payload = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages
    });
    python.stdin.write(payload);
    python.stdin.end();

    let result = '';
    python.stdout.on('data', (data) => {
      const text = data.toString();
      result += text;
      output.append(text);
    });

    python.stderr.on('data', (data) => {
      output.append('\n[stderr] ' + data.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) {
        vscode.window.showErrorMessage('LLM process exited with code ' + code);
      } else {
        vscode.window.showInformationMessage(result || 'No response');
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

