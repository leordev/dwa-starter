import { useWeb5 } from "@/web5/Web5Provider";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toastError, toastSuccess } from "@/lib/utils";

interface Task {
  id?: string;
  title: string;
  completed: boolean;
}

const TASK_SCHEMA = "https://schema.org/TaskSample";

export const TodoList = () => {
  const { web5Connection, did } = useWeb5();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, [web5Connection, did]);

  const loadTasks = async () => {
    if (!web5Connection || !did) {
      return setTasks([]);
    }

    const { web5 } = web5Connection;

    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: TASK_SCHEMA,
          dataFormat: "application/json",
        },
      },
    });

    if (!records) {
      return setTasks([]);
    }

    try {
      const tasksRecords: Task[] = await Promise.all(
        records.map(async (r) => {
          const { title, completed } = await r.data.json();
          return {
            id: r.id,
            title,
            completed,
          };
        })
      );

      const tasks = tasksRecords.map((r) => ({
        id: r.id,
        title: r.title,
        completed: r.completed,
      }));

      setTasks(tasks);
    } catch (error) {
      console.error(error);
      setTasks([]);
      toastError("Error loading tasks", error);
    }
  };

  const handleTaskSubmit = async (
    formEvent: React.FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();

    if (!web5Connection) {
      toastError("Web5 connection not found");
      return;
    }

    const { record } = await web5Connection.web5.dwn.records.create({
      data: { title: "My todo task", completed: false },
      message: {
        schema: TASK_SCHEMA,
        dataFormat: "application/json",
        published: true,
      },
    });

    console.info({ record });
    toastSuccess("Task created successfully");

    loadTasks();
  };

  const handleDeleteTask = async (recordId: string) => {
    if (!web5Connection) {
      toastError("Web5 connection not found");
      return;
    }
    await web5Connection.web5.dwn.records.delete({ message: { recordId } });
    toastSuccess("Task deleted successfully");
    loadTasks();
  };

  const handleToggleTaskCompletion = async (recordId: string) => {
    if (!web5Connection) {
      toastError("Web5 connection not found");
      return;
    }
    const { record } = await web5Connection.web5.dwn.records.read({
      message: {
        filter: {
          recordId,
        },
      },
    });
    if (!record) {
      toastError("Task not found");
      return;
    }
    const data: Task = await record.data.json();
    const { status } = await record.update({
      data: { ...data, completed: !data.completed },
    });
    if (status.code !== 202) {
      console.info({ status });
      toastError("Error updating task", status.detail);
      return;
    } else {
      toastSuccess("Task updated successfully");
      loadTasks();
    }
  };

  return (
    <div className="space-y-8">
      <Typography variant="h1">My Tasks</Typography>
      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="mb-2 flex items-center pb-2 last:mb-0 last:pb-0"
          >
            <div
              className="flex cursor-pointer"
              onClick={() => handleToggleTaskCompletion(task.id!)}
            >
              <Checkbox checked={task.completed} className="w-8 h-8" />
              <p
                className={`text-lg font-medium ml-2 ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </p>
            </div>
            <Button variant="ghost" className="ml-4" size="icon">
              <PencilIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              size="icon"
              onClick={() => handleDeleteTask(task.id!)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <form onSubmit={handleTaskSubmit}>
        <Button type="submit">Add Task</Button>
      </form>
    </div>
  );
};
