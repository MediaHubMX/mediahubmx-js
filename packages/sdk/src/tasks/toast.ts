import { CacheHandler } from "@mediahubmx/cache";
import { TaskToastRequest } from "@mediahubmx/schema";
import { Responder, sendTask } from "./engine";
import { ToastFn } from "./types";

export const createTaskToast = (
  testMode: boolean,
  responder: Responder,
  cache: CacheHandler
) => {
  const toast: ToastFn = async (text, timeout = 60 * 1000) => {
    if (testMode) {
      throw new Error("Task toast is not available in test mode");
    }
    const task = <TaskToastRequest>{ text, type: "toast" };
    await sendTask(testMode, responder, cache, task, timeout);
  };
  return toast;
};
