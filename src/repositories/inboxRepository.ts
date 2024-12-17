import { AppDataSource } from "../configs/db";
import { Inbox } from "../entities/inbox";

export default class InboxRepository {
    private repository = AppDataSource.getRepository(Inbox);

    async createInbox(inbox: Inbox): Promise<Inbox> {
        return this.repository.save(inbox);
    }
}