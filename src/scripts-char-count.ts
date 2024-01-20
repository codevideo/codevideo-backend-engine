import { loadSteps } from "./io/loadSteps";

const scriptChartCount = () => {
  // load in the steps.json file
  const { steps } = loadSteps();

  // use reduce to count the characters in each 'script' property
  const characterCount = steps.reduce(
    (acc: any, step: { script: string | any[] }) => {
      return acc + step.script.length;
    },
    0
  );

  const wordCount = Math.round(characterCount / 5);
  const pageCount = (wordCount / 500).toFixed(1);

  // log the results
  console.log(`Total character count in scripts: ${characterCount}`);
  console.log(`Total word count in scripts: ${wordCount}`);
  console.log(`Total page count in scripts: ${pageCount}`);
};

scriptChartCount();
