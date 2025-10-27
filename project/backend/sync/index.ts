import type { SyncEvent } from "smart-tutoring-shared";
import { receivers } from "~/lib/sync/config";
import { socket } from "~/socket";


export const sync = {
  publish: (lessonId: string, event: SyncEvent) => {
    const roles = receivers[event.type];
    if (typeof roles == "undefined") {
      throw new Error("No roles for event type");
    }

    socket.toLesson(lessonId, roles).emit("sync", event);
  },
};
