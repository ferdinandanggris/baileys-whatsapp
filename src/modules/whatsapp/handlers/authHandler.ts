import { AuthenticationCreds, AuthenticationState, BufferJSON, initAuthCreds, proto, SignalDataTypeMap } from "baileys";
import SessionService from "../services/sessionService";

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
    "pre-key": "preKeys",
    session: "sessions",
    "sender-key": "senderKeys",
    "app-state-sync-key": "appStateSyncKeys",
    "app-state-sync-version": "appStateVersions",
    "sender-key-memory": "senderKeyMemory",
  };
  
  export default class AuthHandler {
    constructor(private imcenter_id: number) {}
    private repos = {
      auth: new SessionService()
    };
  
    useAuthHandle = async (): Promise<{
      state: AuthenticationState;
      saveState: () => Promise<any>;
    }> => {
      let creds: AuthenticationCreds;
      let keys: any = {};
  
      var existingAuth = await this.repos.auth.getSession(this.imcenter_id);
      ({ creds, keys } =
        existingAuth && existingAuth.auth
          ? JSON.parse(existingAuth.auth, BufferJSON.reviver)
          : {
              creds: initAuthCreds(),
              keys: {},
            });
  
      const saveState = async () =>
        this.repos.auth.saveUpsertSession(this.imcenter_id,creds?.me?.id, JSON.stringify({ creds, keys })
        );
  
      return {
        state: {
          creds,
          keys: {
            get: (type, ids) => {
              const key = KEY_MAP[type];
              return ids.reduce((dict, id) => {
                let value = keys[key]?.[id];
                if (value) {
                  if (type === "app-state-sync-key")
                    value = proto.Message.AppStateSyncKeyData.fromObject(value);
                  dict[id] = value;
                }
                return dict;
              }, {});
            },
            set: async (data) => {
              for (const _key in data) {
                const key = KEY_MAP[_key as keyof SignalDataTypeMap];
                keys[key] = keys[key] || {};
                Object.assign(keys[key], data[_key]);
              }
  
              await saveState();
            },
          },
        },
        saveState,
      };
    };
  }