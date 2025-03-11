import { filterAuthorActions } from "@fullstackcraftllc/codevideo-types";
import { loadActions } from "../io/loadActions.js";

const scriptChartCount = async () => {
  // load in the steps.json file
  const { actions } = await loadActions();

  const speakActions = filterAuthorActions(actions);

  // use reduce to count the characters in the'value' property of each speak action
  const characterCount = speakActions.map(a => a.value).reduce((a, b) => a + b.length, 0);
  const wordCount = Math.round(characterCount / 5);
  const pageCount = (wordCount / 500).toFixed(1);

  // log the results
  console.log(`Total character count in scripts: ${characterCount}`);
  console.log(`Total word count in scripts: ${wordCount}`);
  console.log(`Total page count in scripts: ${pageCount}`);
};

scriptChartCount();
