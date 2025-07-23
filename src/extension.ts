import * as vscode from 'vscode';
import fetch from 'node-fetch';

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

    try {
      const response = await fetch('http://localhost:8000/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages
        })
      });
      const json = await response.json();
      const answer = json.choices?.[0]?.message?.content || 'No response';
      vscode.window.showInformationMessage(answer);
    } catch (err: any) {
      vscode.window.showErrorMessage('Error querying LLM: ' + err.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
