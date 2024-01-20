import { preprocessStringForComparison } from "./utils/preprocessStringForComparison";
import { loadSteps } from "./io/loadSteps";
import { speechToText } from "./openai/speechToText";
import { levenshteinDistance } from "./utils/levenshteinDistance";
import { convertScriptPropertiesToAudio } from "./audio/convertScriptPropertiesToAudio";
import { IStep } from "./interfaces/IStep";

const scriptsHealthCheck = async () => {
  // load in the steps.json file
  const { steps, stepsAudioPath } = loadSteps();

  // for each script, generate the transcript with OpenAI whisper, then compare the original text with the resulting transcript using levenshtein distance
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    await checkForArtifacts(step, stepsAudioPath);
  }
};

const checkForArtifacts = async (step: IStep, stepsAudioPath: string) => {
  // generate transcript
  const transcript = await speechToText(`${stepsAudioPath}/${step.id}.mp3`);
  if (!transcript) {
    console.log(
      `Script step ID ${step.id}: Error creating transcript from audio file (${stepsAudioPath}/${step.id}.mp3)`
    );
    return;
  }
  // first preprocess the texts (all to lowercase and removing any non a-z0-9 characters) compare with levenshtein distance
  const distance = levenshteinDistance(
    preprocessStringForComparison(step.script),
    preprocessStringForComparison(transcript)
  );
  // if the levenstein distance is greater than 5, log the results
  if (distance > 5) {
    console.log("WARNING - POTENTIAL ARTIFACT DETECTED!");
    console.log(
      `Script step ID ${step.id}:\nOriginal: ${step.script}\nTranscript: ${transcript}\nLevenshtein distance: ${distance}`
    );
    // and regenerate the audio for this step
    console.log(`Regenerating audio for step ${step.id}...`)
    await convertScriptPropertiesToAudio([step], stepsAudioPath, true)
  } else {
    console.log(
      `Script step ID ${step.id}: No artifacts detected. (Levenshtein distance: ${distance})`
    );
  }
}

scriptsHealthCheck();
