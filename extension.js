// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
//const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('panconvert.convert', async function () {
		// The code you place here will be executed every time your command is executed
		
		let selectedOutputFormat = await vscode.window.showQuickPick(['md', 'html', 'latex', 'beamer',
		 'docbook', 'mediawiki','docx','odt','pdf','epub','asciidoc','markua']);
		
		let sourcePathFileName = vscode.window.activeTextEditor.document.fileName;
		let sourcePathExtension = sourcePathFileName.split('.').pop();
		let targetPathFileName = path.dirname(sourcePathFileName) + path.sep + path.basename(sourcePathFileName, '.' + sourcePathExtension) + '.'+selectedOutputFormat;

		execFile('pandoc', 
			['-s', vscode.window.activeTextEditor.document.fileName , '-o', targetPathFileName], 
			(error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(error.toString());
				//console.error(`exec error: ${error}`);
				return;
			}
			vscode.window.showInformationMessage(`${targetPathFileName} created`);
			vscode.window.showTextDocument(vscode.Uri.file(targetPathFileName));
			//console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		});

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
