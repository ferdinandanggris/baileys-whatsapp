import { AppDataSource } from "../../../configs/db";
import { InboxGriyabayar } from "../../../entities/inboxGriyabayar";


export default class InboxGriyabayarService {
    private repository = AppDataSource.getRepository(InboxGriyabayar);

    async createInbox(inbox: InboxGriyabayar): Promise<InboxGriyabayar> {
        return this.repository.save(inbox);
    }
}