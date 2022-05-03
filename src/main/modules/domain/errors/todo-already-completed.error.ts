import { Todo } from "../models/todo.entity";

export class TodoAlreadyCompletedError extends Error {
    constructor(todo: Todo) {
        super(`${todo.getTitle()} already completed.`);
    }
}
