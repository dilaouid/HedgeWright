import { BaseSerializedModel, BaseSerializedNamedModel } from './base';

export interface SerializedCrossExamination extends BaseSerializedNamedModel {
  witnessId: string;
  introDialogueId?: string;
  loopIntroDialogueId?: string;
  successDialogueId?: string;
  failureDialogueId?: string;
  position: number;
}

export interface SerializedCrossExaminationBubbleSettings extends BaseSerializedModel {
  crossExaminationId: string;
  bubbleSetId: string;
  objectionBubbleId?: string;
  holdItBubbleId?: string;
}

export interface SerializedStatement extends BaseSerializedNamedModel {
  text: string;
  messageId: string;
  pressDialogueId?: string;
  crossExaminationId: string;
  index: number;
  isContradiction: boolean;
  evidenceId?: string;
  profileId?: string;
}

export interface SerializedContradiction extends BaseSerializedModel {
  statementId: string;
  evidenceId?: string;
  profileId?: string;
  dialogueId: string;
  endsTestimony: boolean;
  switchToActivate?: string;
} 