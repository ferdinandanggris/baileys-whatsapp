interface ISessionService {
    removeSession(jid : string): Promise<void>;
}