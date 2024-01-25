import { IAction, SpeakAction } from "../interfaces/IAction";

export const isSpeakAction = (action: IAction): action is SpeakAction => {
    return (action.name as string) in {
        'speak-before': true,
        'speak-after': true,
        'speak-during': true,
    };
}

// type guard to convert an array of IAction to an array of SpeakAction
export const convertActionsToSpeakActions = (actions: Array<IAction>): Array<SpeakAction> => {
    return actions.filter(isSpeakAction);
}