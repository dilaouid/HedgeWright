/**
 * Définition de la structure d'un fichier .aalevel
 * Ce format est utilisé pour l'édition des niveaux
 */
export interface AALevelFile {
    // Métadonnées
    id: string;
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    author: string;
    description?: string;

    // Paramètres du jeu
    settings: {
        resolution: { width: number; height: number };
        defaultMusicId?: string;
        startingSceneId?: string;
    };

    // Données du jeu
    scenes: SceneData[];
    crossExaminations: CrossExaminationData[];
    dialogues: DialogueData[];
    evidence: EvidenceData[];
    profiles: ProfileData[];
    variables: VariableData[];

    // Structure de navigation
    timeline: {
        nodes: TimelineNodeData[];
        connections: TimelineConnectionData[];
    };

    // Extensions possibles pour les plugins ou modules additionnels
    extensions?: Record<string, unknown>;
}

/**
 * Représentation d'une scène
 */
export interface SceneData {
    id: string;
    customId: string;
    name: string;
    type: 'investigation' | 'courtroom' | 'cutscene';
    backgroundId: string;
    musicId?: string;
    
    // Zones examinables dans le mode d'investigation
    examinableAreas?: ExaminableAreaData[];
    
    // Personnages présents dans la scène
    characters?: CharacterPlacementData[];
    
    // Dialogues associés à la scène
    introDialogueId?: string;
    outroDialogueId?: string;
    
    // Conditions d'accès
    requiredVariables?: VariableCondition[];
    
    // Métadonnées
    metadata?: Record<string, unknown>;
}

/**
 * Zone examinable dans une scène
 */
export interface ExaminableAreaData {
    id: string;
    name: string;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    dialogueId: string;
    evidenceId?: string;  // Si besoin de présenter une preuve
    findableEvidenceId?: string;  // Si une preuve peut être découverte ici
    visitedVariableId?: string;  // Variable à changer quand examiné
    cursor: 'examine' | 'talk' | 'move' | 'present';
    highlightable: boolean;
}

/**
 * Placement d'un personnage dans une scène
 */
export interface CharacterPlacementData {
    characterId: string;
    position: {
        x: number;
        y: number;
    };
    scale?: number;
    pose: string;
    flipped?: boolean;
    zIndex?: number;
}

/**
 * Données d'un contre-interrogatoire
 */
export interface CrossExaminationData {
    id: string;
    customId: string;
    name: string;
    witnessId: string;  // ID du profil du témoin
    
    // Phases du contre-interrogatoire
    statements: StatementData[];
    contradictions: ContradictionData[];
    
    // Dialogues associés
    introDialogueId?: string;
    loopIntroDialogueId?: string;
    successDialogueId?: string;
    failureDialogueId?: string;
    
    // Paramètres du gameplay
    maxHealth: number;
    musicId?: string;
    pressedMusicId?: string;
    
    // Conditions & métadonnées
    requiredVariables?: VariableCondition[];
    metadata?: Record<string, unknown>;
}

/**
 * Déclaration d'un témoin pendant un contre-interrogatoire
 */
export interface StatementData {
    id: string;
    customId: string;
    index: number;
    text: string;
    dialogueId: string;
    pressDialogueId?: string;
    canPress: boolean;
    canPresent: boolean;
    correctEvidenceIds: string[];
    incorrectPresentationDialogueId?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Contradiction entre une preuve et une déclaration
 */
export interface ContradictionData {
    statementId: string;
    evidenceId: string;
    dialogueId: string;
    leadsToStatementId?: string;
    endsTestimony: boolean;
    damage: number;
    switchToActivate?: string;
}

/**
 * Dialogue avec séquence de texte et choix
 */
export interface DialogueData {
    id: string;
    customId: string;
    name?: string;
    
    // Segments qui composent le dialogue
    segments: DialogueSegmentData[];
    
    // Options de choix pour le joueur
    choices?: DialogueChoiceData[];
    
    // Dialogue suivant automatiquement
    nextDialogueId?: string;
    
    // Effets sur les variables de jeu
    variableChanges?: VariableChange[];
    
    // Conditions & métadonnées
    requiredVariables?: VariableCondition[];
    metadata?: Record<string, unknown>;
}

/**
 * Segment de dialogue (une ligne de texte)
 */
export interface DialogueSegmentData {
    id: string;
    speakerId?: string;
    text: string;
    pose?: string;
    position?: 'left' | 'center' | 'right';
    
    // Effets de texte
    textEffects?: TextEffectData[];
    
    // Sons et animations
    soundId?: string;
    animationId?: string;
    
    // Attente avant le prochain segment
    waitTime?: number;
    
    // Changements temporaires de l'UI
    backgroundOverride?: string;
    shakeScreen?: boolean;
    flashScreen?: boolean;
}

/**
 * Effet appliqué à une portion de texte
 */
export interface TextEffectData {
    type: 'color' | 'size' | 'shake' | 'wave' | 'flash';
    startIndex: number;
    endIndex: number;
    value: string;
}

/**
 * Choix dans un dialogue
 */
export interface DialogueChoiceData {
    id: string;
    text: string;
    nextDialogueId: string;
    requiredVariables?: VariableCondition[];
    variableChanges?: VariableChange[];
}

/**
 * Preuve (pièce à conviction)
 */
export interface EvidenceData {
    id: string;
    customId: string;
    name: string;
    description: string;
    imageId: string;
    
    // État initial
    isHidden: boolean;
    isInCourtRecord: boolean;
    
    // Dialogues associés
    examineDialogueId?: string;
    presentDialogueId?: string;
    
    // Conditions & métadonnées
    requiredVariables?: VariableCondition[];
    metadata?: Record<string, unknown>;
}

/**
 * Profil (personnage)
 */
export interface ProfileData {
    id: string;
    customId: string;
    name: string;
    role: string;
    description: string;
    
    // Images et assets
    mainImageId: string;
    poses: ProfilePoseData[];
    
    // Dialogues associés
    examineDialogueId?: string;
    presentDialogueId?: string;
    
    // Conditions & métadonnées
    requiredVariables?: VariableCondition[];
    metadata?: Record<string, unknown>;
}

/**
 * Pose d'un personnage
 */
export interface ProfilePoseData {
    id: string;
    name: string;
    imageId: string;
    category: 'normal' | 'talking' | 'thinking' | 'shocked' | 'happy' | 'custom';
    animationData?: Record<string, unknown>;
}

/**
 * Variable de jeu
 */
export interface VariableData {
    id: string;
    name: string;
    type: 'boolean' | 'number' | 'string';
    defaultValue: boolean | number | string;
    description?: string;
}

/**
 * Condition basée sur une variable
 */
export interface VariableCondition {
    variableId: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: boolean | number | string;
}

/**
 * Changement de valeur d'une variable
 */
export interface VariableChange {
    variableId: string;
    operation: 'set' | 'add' | 'subtract' | 'toggle';
    value: boolean | number | string;
}

/**
 * Nœud dans la timeline
 */
export interface TimelineNodeData {
    id: string;
    type: 'scene' | 'crossExamination' | 'dialogue';
    referenceId: string;
    position: {
        x: number;
        y: number;
    };
    label?: string;
}

/**
 * Connexion entre nœuds dans la timeline
 */
export interface TimelineConnectionData {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    conditions?: VariableCondition[];
    priority?: number;
    label?: string;
}