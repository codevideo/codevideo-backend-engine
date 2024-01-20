export interface IStep {
    id: number;
    action: string;
    filename: string;
    script: string;
    scriptStart?: 'before' | 'during' | 'after';
    oldCode?: string;
    code?: string;
}