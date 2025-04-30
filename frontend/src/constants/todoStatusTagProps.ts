import { StatusColorNames } from "@/styles/colors";
import { TodoStatus } from "../client/types.gen";

export const TodoStatusColoredTagProps: Record<TodoStatus, { colored: StatusColorNames | "primary"; defaultText: string }> = {
    new: {
        colored: "success",
        defaultText: "New",
    },
    in_progress: {
        colored: "warning",
        defaultText: "In progress",
    },
    done: {
        colored: "neutral",
        defaultText: "Done",
    }
};