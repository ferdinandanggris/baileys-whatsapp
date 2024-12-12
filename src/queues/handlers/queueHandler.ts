import Imcenter from "../../entities/imcenter";
import { InstanceManager } from "../../modules/whatsapp/instanceManagerService";
import { WhatsappService } from "../../modules/whatsapp/whatsappService";
const instanceManager : InstanceManager = require('../../modules/whatsapp/instanceManagerService');

export const handleLoginMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : WhatsappService = instanceManager.getInstance(imcenter.id);
    await socket.connect();
  };

  export const handleLoginAllMessage = async () => {
    console.log('Processing user message: login all');
    await instanceManager.loginAllSessions();
  };

  export const handleLogoutMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : WhatsappService = instanceManager.getInstance(imcenter.id);
    await socket.logout();
    await instanceManager.removeInstance(imcenter.id);
  }

  export const handleLogoutAllMessage = async () => {
    console.log('Processing user message: logout all');
    await instanceManager.logoutAll();
  }

  export const handleUpdateStatusMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : WhatsappService = instanceManager.getInstance(imcenter.id);
    await socket.updateProfileStatus();
  }