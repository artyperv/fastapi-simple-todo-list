from enum import Enum as PythonEnum


class TodoStatus(PythonEnum):
    NEW = 'new'
    IN_PROGRESS = 'in_progress'
    DONE = 'done'
