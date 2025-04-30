export type SpaceValues =
    | "$1"
    | "$2"
    | "$4"
    | "$6"
    | "$8"
    | "$10"
    | "$12"
    | "$16"
    | "$24"
    | "$32"
    | "$40"
    | "$48"
    | "$56"
    | "$72"
    | "$80"
    | "$140";

export const valueToSpaceVar = (value: SpaceValues | string | number): string => {
    if (typeof value === "number") {
        return `${value}px`; // Convert numbers to px
    }
    if (value.startsWith("$")) {
        return `var(--space-${value.replace("$", "")})`; // Map $-prefixed values to CSS variables
    }
    return value; // Default to 0 or use the provided string value
};
