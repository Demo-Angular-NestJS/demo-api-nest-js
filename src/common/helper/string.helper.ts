/**
 * Helper to turn camelCase or snake_case fields into "Capitalized Spaced" strings
 * Example: "userEmail" -> "User Email"
 */
export const formatStringName = (field: string): string => {
    if (!field) return 'Field';
    const result = field.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ');
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
};
