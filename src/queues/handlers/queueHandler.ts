import Imcenter from "../../entities/imcenter";
import  { IWhatsappService,Message, OTP } from "../../interfaces/whatsapp";
import { InstanceManager } from "../../modules/whatsapp/instanceManagerService";
import { ImCenterService } from "../../modules/whatsapp/services/imcenterService";
import { publishToMessageImcenterQueue } from "../publishers/messageToImcenterPublisher";
const instanceManager : InstanceManager = require('../../modules/whatsapp/instanceManagerService');
const imcenterService = new ImCenterService();

export const handleLoginMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : IWhatsappService =await instanceManager.getInstance(imcenter.id);
    await socket.connect();
  };

  export const handleLoginAllMessage = async () => {
    console.log('Processing user message: login all');
    await instanceManager.loginAllSessions();
  };

  export const handleLogoutMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : IWhatsappService = await instanceManager.getInstance(imcenter.id);
    await socket.connectionHandler.logout();
    await instanceManager.removeInstance(imcenter.id);
  }

  export const handleLogoutAllMessage = async () => {
    console.log('Processing user message: logout all');
    await instanceManager.logoutAll();
  }

  export const handleUpdateStatusMessage = async (imcenter: Imcenter) => {
    console.log('Processing user message:', imcenter);
    const socket : IWhatsappService = await instanceManager.getInstance(imcenter.id);
    await socket.profileHandler.updateProfileStatus();
  }

  export const handlePublishToMessageImcenter = async (message: Message) => {
    console.log('Processing user message:', message);
    const imcenter = await imcenterService.getImcenterByNumberPhone(message.sender)
    if(imcenter.id){
        await publishToMessageImcenterQueue(imcenter, message);
    }
  }

  export const handleImcenterSendMessage = async (imcenter : Imcenter,message: Message) => {
    console.log('Processing user message:', message);
    if(imcenter.id){
        const socket : IWhatsappService = await instanceManager.getInstance(imcenter.id);
        await socket.messageHandler.sendMessage(message);
    }
  }

  export const handleSendOTPMessage = async (otpProps : OTP) => {
    console.log('Processing user message:', otpProps);
    const imcenters = await imcenterService.fetchImcenterHasLoginAndIsGriyabayar(otpProps.griyabayar);
    const imcenterReady = instanceManager.getActiveSessions();
    const imcenter = imcenters.find((imcenter) => imcenterReady.includes(imcenter.id));
    if(imcenter){
        const socket : IWhatsappService = await instanceManager.getInstance(imcenter.id);
        await socket.messageHandler.sendOTP(otpProps);
    }
  }