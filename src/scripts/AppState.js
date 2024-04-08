import { constants } from "./constants.js";

// destructure syntax to get defaults
const { DEFAULT_COMING_SOON, DEFAULT_CURRENT_SELECT, DEFAULT_LOADING_STATE } =
    constants;

// object to represent state of application (more properties can be added as needed)
export const AppState = {
    loading: DEFAULT_LOADING_STATE,
    showComingSoon: DEFAULT_COMING_SOON,
    currentSelection: DEFAULT_CURRENT_SELECT,
};
