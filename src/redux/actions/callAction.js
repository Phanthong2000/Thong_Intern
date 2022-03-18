import {
  ME,
  CALL,
  STREAM,
  CALL_ACCEPTED,
  CALL_ENDED,
  NAME,
  REMOTE_STREAM,
  CONNECTION,
  MODAL_RECEIVING,
  AUDIO,
  VIDEO,
  AUDIO_OTHER,
  VIDEO_OTHER,
  START_COUNT
} from './types';

export const actionMe = (data) => ({
  type: ME,
  payload: data
});
export const actionCall = (data) => ({
  type: CALL,
  payload: data
});
export const actionCallAccepted = (data) => ({
  type: CALL_ACCEPTED,
  payload: data
});
export const actionCallEnded = (data) => ({
  type: CALL_ENDED,
  payload: data
});
export const actionStream = (data) => ({
  type: STREAM,
  payload: data
});
export const actionName = (data) => ({
  type: NAME,
  payload: data
});
export const actionRemoteStream = (data) => ({
  type: REMOTE_STREAM,
  payload: data
});
export const actionConnection = (data) => ({
  type: CONNECTION,
  payload: data
});
export const actionModalReceiving = (data) => ({
  type: MODAL_RECEIVING,
  payload: data
});
export const actionAudio = (data) => ({
  type: AUDIO,
  payload: data
});
export const actionVideo = (data) => ({
  type: VIDEO,
  payload: data
});
export const actionAudioOther = (data) => ({
  type: AUDIO_OTHER,
  payload: data
});
export const actionVideoOther = (data) => ({
  type: VIDEO_OTHER,
  payload: data
});
export const actionStartCount = (data) => ({
  type: START_COUNT,
  payload: data
});
