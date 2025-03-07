/**
 * Définition de la structure d'un fichier .aagame
 * Ce format est utilisé pour l'exécution du jeu sur le moteur
 */
export interface AAGameFile {
    // Métadonnées
    id: string;
    name: string;
    version: string;
    createdAt: string;
    author: string;
    description?: string;

    // Configuration du jeu
    config: {
        resolution: { width: number; height: number };
        startScene: string;
        defaultMusic?: string;
        saveEnabled: boolean;
    };

    // Contenu optimisé pour le moteur de jeu
    assets: {
        backgrounds: AssetReference[];
        characters: AssetReference[];
        evidence: AssetReference[];
        music: AssetReference[];
        sfx: AssetReference[];
    };

    // Scenes optimisées pour le moteur
    scenes: OptimizedSceneData[];

    // Dialogues compilés (texte prétraité)
    dialogues: CompiledDialogueData[];

    // Examens compilés
    examinations: CompiledExaminationData[];

    // Variables initiales
    initialState: Record<string, any>;
}

interface AssetReference {
    id: string;
    path: string;
    type: 'image' | 'audio' | 'json';
    preload: boolean;
}

/**
 * Représentation optimisée d'une scène pour le moteur de jeu
 * Contient uniquement les données nécessaires à l'exécution
 */
export interface OptimizedSceneData {
    id: string;
    customId: string;
    type: SceneType;
    backgroundId: string;
    musicId?: string;
    ambientSoundId?: string;
    
    // Zones interactives pour le mode Examen
    examinableAreas: {
        id: string;
        rect: { x: number; y: number; width: number; height: number };
        dialogueId: string;
        evidenceRequired?: string;
        highlightable: boolean;
        cursor: CursorType;
        switchId?: string; // Identifiant du switch qui détermine si la zone est active
    }[];
    
    // Personnages présents dans la scène
    characters: {
        characterId: string;
        position: { x: number; y: number };
        initialPose: string;
        isWitness: boolean;
    }[];
    
    // Transitions possibles vers d'autres scènes
    transitions: {
        targetSceneId: string;
        conditions: SceneCondition[];
        transitionType: TransitionType;
        triggerType: 'auto' | 'click';
    }[];
    
    // Dialogues d'introduction et de conclusion
    introDialogueId?: string;
    outroDialogueId?: string;
    
    // Conditions d'accès à la scène
    visibilityConditions: SceneCondition[];
    
    // Métadonnées pour le gameplay
    metadata: {
        investigationDay?: number;
        courtDay?: number;
        location?: string;
        timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
        weatherEffect?: string;
    };
}

/**
 * Dialogue compilé avec segments de texte et effets prétraités
 * Optimisé pour le rendu rapide et l'exécution
 */
export interface CompiledDialogueData {
    id: string;
    customId: string;
    
    // Séquence de segments de dialogue
    segments: {
        speakerId?: string;
        pose?: string;
        text: string;
        textSpeed?: number;
        position?: 'left' | 'center' | 'right';
        
        // Effets de texte prétraités et prêts à être rendus
        effects: {
            type: 'shake' | 'flash' | 'color' | 'size' | 'pause';
            startIndex: number;
            endIndex: number;
            value: string | number;
            duration?: number;
        }[];
        
        // Sons liés au texte
        sounds: {
            id: string;
            timing: 'before' | 'during' | 'after';
            position?: number;
        }[];
        
        // Animations spéciales (objection, hold it, etc.)
        animation?: {
            type: 'objection' | 'holdit' | 'takethat' | 'gotcha' | 'custom';
            customId?: string;
            timing: 'before' | 'during';
        };
        
        // Fond de scène temporaire
        backgroundOverride?: string;
        
        // Secousse d'écran
        screenShake?: {
            intensity: number;
            duration: number;
        };
    }[];
    
    // Choix de dialogue
    choices?: {
        id: string;
        text: string;
        nextDialogueId: string;
        conditions: SceneCondition[];
        modifiesVariables?: { variableId: string; value: any }[];
    }[];
    
    // Dialogue suivant automatiquement
    nextDialogueId?: string;
    
    // Conditions pour ce dialogue
    conditions: SceneCondition[];
    
    // Variables modifiées par ce dialogue
    modifiesVariables?: { variableId: string; value: any }[];
}

/**
 * Interrogatoire/Contre-interrogatoire compilé et optimisé
 */
export interface CompiledExaminationData {
    id: string;
    customId: string;
    type: 'testimony' | 'crossExamination' | 'logicChess';
    witnessId: string;
    
    // Musique spécifique
    testimonyMusicId?: string;
    pressedMusicId?: string;
    
    // Phase d'introduction
    introDialogueId?: string;
    
    // Dialogue lors du retour au premier témoignage
    loopDialogueId?: string;
    
    // Déclarations de témoignage optimisées
    statements: {
        id: string;
        index: number;
        dialogueId: string;
        pressDialogueId?: string;
        canPress: boolean;
        canPresent: boolean;
        
        // Preuves valides pour la contradiction
        validEvidenceIds: string[];
        
        // Dialogue si preuve incorrecte
        incorrectPresentationDialogueId?: string;
        
        // Dégâts pour une présentation incorrecte (0-100)
        incorrectDamage: number;
    }[];
    
    // Contradictions prédéfinies
    contradictions: {
        statementId: string;
        evidenceId: string;
        dialogueId: string;
        nextStatementId?: string;
        endsExamination: boolean;
        triggerSwitchId?: string;
    }[];
    
    // Dialogue de succès et d'échec
    successDialogueId?: string;
    failureDialogueId?: string;
    
    // Santé maximale du joueur
    maxHealth: number;
    
    // Conditions de visibilité
    visibilityConditions: SceneCondition[];
}

// Types auxiliaires
export enum SceneType {
    INVESTIGATION = 'investigation',
    COURTROOM = 'courtroom',
    CUTSCENE = 'cutscene',
    DIALOGUE = 'dialogue'
}

export enum CursorType {
    NORMAL = 'normal',
    EXAMINE = 'examine',
    TALK = 'talk',
    MOVE = 'move',
    PRESENT = 'present'
}

export enum TransitionType {
    FADE = 'fade',
    SLIDE_LEFT = 'slideLeft',
    SLIDE_RIGHT = 'slideRight',
    WIPE = 'wipe',
    INSTANT = 'instant'
}

export type SceneCondition = {
    type: 'variable' | 'evidence' | 'dialogue' | 'examination';
    id: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'has' | 'completed';
    value?: any;
};