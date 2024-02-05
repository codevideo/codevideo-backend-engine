import * as fs from 'fs';
import * as path from 'path';

export const findFileWithCharacters = (directory: string, characters: string) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file.includes(characters)) {
            return path.join(directory, file);
        }
    }

    return null;
}