import * as vscode from "vscode";
import { generateCommentsFromText } from "@nodefactory/solidity-comments-core";

export function activate(ctx: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "helloworld-sample" is now active!');

  vscode.commands.registerCommand("extension.addSolidityComments", () => {
    var lang = vscode.window.activeTextEditor.document.languageId;
    if (lang == "solidity") {
      const document = vscode.window.activeTextEditor.document;

      //currently we work on the whole document
      var selection = new vscode.Selection(
        document.positionAt(0),
        document.positionAt(document.getText().length)
        )
      //TODO: selection ain't working since solidity parser fails
      // selection = selection.isEmpty
      //   ? new vscode.Selection(
      //       document.positionAt(0),
      //       document.positionAt(document.getText().length)
      //     )
      //   : selection;
      // var selectedText = vscode.window.activeTextEditor.document.getText(
      //   selection
      // );
      const selectedText = vscode.window.activeTextEditor.document.getText()
      var outputMessage: string = "Empty text";

      if (selectedText.length === 0) {
        console.log("empty text", selection)
        vscode.window.showInformationMessage(outputMessage);
        return;
      }

      let withComments = ""
      try
      {
        withComments = generateCommentsFromText(selectedText)

      }
      catch(e:Error) {
        console.log("Failed to parse solidity",e, selectedText)
        throw e
      }
      if (withComments.length > 0) {
        vscode.window.activeTextEditor
          .edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(selection, withComments);
          })
          .then(() => {});
      }
    }
  });
}
