import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log("Log Outline Extension activated");
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'log', scheme: 'file' },
            new LogTestSymbolProvider()
        )
    );
}

export function deactivate() {}

class LogTestSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        const testRegex = /^\s*\d{2}:\d{2}:\d{2}\.\d{3}\s*---\s*STARTING TEST\s+(.+?)(?:\s*---|$)/;
        const sequenceRegex = /^\s*\d{2}:\d{2}:\d{2}\.\d{3}\s*---\s*TEST SEQUENCE\s+(.+?)\s*---$/;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match = testRegex.exec(line.text);
            if (match) {
                const testName = match[1].trim();
                symbols.push(new vscode.DocumentSymbol(
                    testName,
                    '',
                    vscode.SymbolKind.Namespace,
                    line.range,
                    line.range
                ));
                continue;
            }

            match = sequenceRegex.exec(line.text);
            if (match) {
                const seqName = match[1].trim();
                symbols.push(new vscode.DocumentSymbol(
                    seqName,
                    '',
                    vscode.SymbolKind.Namespace,
                    line.range,
                    line.range
                ));
            }
        }
        return symbols;
    }
}
