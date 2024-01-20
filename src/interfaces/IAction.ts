import { Page } from "puppeteer";
import { IStep } from "./IStep";

// export the contract for an action.
// an action is a function that takes a page and a step and performs some (async) action on the page
export interface IAction {
    (page: Page, step: IStep): Promise<void>;
}