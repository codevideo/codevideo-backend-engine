import { loadActions } from "../io/loadActions.js";
import { identifyAndValidate } from "@fullstackcraftllc/syntax-spy";
import { convertActionsToCodeActions } from "@fullstackcraftllc/codevideo-types";
import { VirtualCodeBlock } from "@fullstackcraftllc/virtual-code-block";

const codeHealthCheck = async () => {
  // load in the steps.json file
  const { actions } = await loadActions();

  // get code actions
  const codeActions = convertActionsToCodeActions(actions);

  // create a virtual code block and apply the code actions to it
  const virtualCodeBlock = new VirtualCodeBlock([]);
  virtualCodeBlock.applyActions(codeActions);
  const finalCode = virtualCodeBlock.getCode();

  // use syntax-spy to identify and validate the code
  const { language, isValid, error } = await identifyAndValidate(finalCode);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Detected language:", language);
    console.log("Syntax is valid:", isValid);
  }
};


codeHealthCheck();
