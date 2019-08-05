/**
     * This returns start of day and end of day
     * @returns {string} random string
     */
export const startOfDay = () => new Date(new Date().setHours(0, 0, 0, 0));

export const endOfDay = () => new Date(new Date().setHours(23, 59, 59, 999));
