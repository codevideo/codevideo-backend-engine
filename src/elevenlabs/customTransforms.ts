// eleven lab's can't handle reading of certain words very well
export const customTransforms: Record<string, string> = {
    "C#": "C sharp",
    'areEqual': 'are equal',
    ".NET": "dot net",
    "C++": "C plus plus",
    "_": " underscore ",
};