const vscode = require('vscode');

function activate(context) {
    console.log("Log Outline Extention activated")
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'log', scheme: 'file' },
            new LogTestSymbolProvider()
        )
    );
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

class LogTestSymbolProvider {
    provideDocumentSymbols(document) {
        const symbols = [];

        const testRegex =     /^\s*\d{2}:\d{2}:\d{2}[.:]\d{2,3}\s*-+\s*STARTING TEST\s+(.+?)(?:\s*-+|$)/;
        const sequenceRegex = /^\s*\d{2}:\d{2}:\d{2}[.:]\d{2,3}\s*-+\s*TEST SEQUENCE\s+(.+?)\s*-+$/;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);

            // Cerca match per 'STARTING TEST'
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
                continue; // passa alla prossima riga
            }

            // Cerca match per 'TEST SEQUENCE'
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

            // Aggiungere qui ulteriori match
        }
        return symbols;
    }
}
