import { Page } from "puppeteer";

export const playAudioInPuppeteer = async (
    page: Page,
    audioHash: string,
    filePath: string
  ): Promise<number> => {
    const scriptContent = `
    window.audioPlaybackPromiseResolved = false;
    const audio${audioHash} = new Audio('${filePath}');
    const playPromise${audioHash} = audio${audioHash}.play();

    audio${audioHash}.addEventListener('ended', () => {
      window.audioPlaybackPromiseResolved = true;
    });
  `;

    // Add the script tag to the page
    await page.addScriptTag({ content: scriptContent });

    // add the start time to the array
    const audioStartTime = Math.round(performance.now());
    console.log(
      `audio ${audioHash} (${filePath}) start time set to: ${audioStartTime}`
    );
    
    // Wait for the audio playback to complete
    await page.waitForFunction(
      () => (window as any).audioPlaybackPromiseResolved === true
    );

    return audioStartTime;
  };