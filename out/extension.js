"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log("Log Outline Extension activated");
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'log', scheme: 'file' }, new LogTestSymbolProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
class LogTestSymbolProvider {
    provideDocumentSymbols(document) {
        const symbols = [];
        // Matches lines like: "12:34:56.789 --- STARTING TEST TestName ---" or "12:34:56.789 --- STARTING TEST TestName"
        // Captures the test name after "STARTING TEST"
        const testRegex = /^\s*\d{2}:\d{2}:\d{2}\.\d{3}\s*---\s*STARTING TEST\s+(.+?)(?:\s*---|$)/;
        // Matches lines like: "12:34:56.789 --- TEST SEQUENCE SequenceName ---"
        // Captures the sequence name after "TEST SEQUENCE"
        const sequenceRegex = /^\s*\d{2}:\d{2}:\d{2}\.\d{3}\s*---\s*TEST SEQUENCE\s+(.+?)\s*---$/;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match = testRegex.exec(line.text);
            if (match) {
                const testName = match[1].trim();
                symbols.push(new vscode.DocumentSymbol(testName, '', vscode.SymbolKind.Function, line.range, line.range));
                continue;
            }
            match = sequenceRegex.exec(line.text);
            if (match) {
                const seqName = match[1].trim();
                symbols.push(new vscode.DocumentSymbol(seqName, '', vscode.SymbolKind.Method, line.range, line.range));
            }
        }
        return symbols;
    }
}
//# sourceMappingURL=extension.js.map