import { AuthType, type SyncEvent } from "smart-tutoring-shared";

export const receivers: Record<string, AuthType[]> = {
    //da mettere chi deve vedere gli aggiornamenti PER OGNI TIPO DI EVENTO
} satisfies Record<SyncEvent["type"], AuthType[]>;