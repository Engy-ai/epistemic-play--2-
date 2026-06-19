
export type ActorType = 'OSINT / research agency' | 'NGO / human rights' | 'Newsroom / media' | 'State actor / intelligence' | 'Collective / community OSINT' | 'Independent researcher';
export type MissionFocus = 'Human rights & accountability' | 'Independent journalism' | 'State security / military' | 'Open-source intelligence';
export type Stance = 'Israeli munition' | 'Palestinian rocket' | 'Inconclusive / uncertain' | 'Supports IDF narrative' | 'Challenges IDF narrative';
export type EpistemicParadigm = 'Conjecture-led' | 'Model-led' | 'Hybrid';

export interface MethodProfile {
  video: boolean;
  satellite: boolean;
  crater: boolean;
  audio: boolean;
  modelling3d: boolean;
  trajectory: boolean;
  triangulation: boolean;
  computational: boolean;
}

export interface MediaItem {
  kind: 'image' | 'video';
  label: string;
  url: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Investigation {
  id: string;
  title: string;
  outlet: string;
  actorType: ActorType;
  mission: MissionFocus[];
  stance: Stance[];
  stanceShort: string;
  publicationDate: string;
  country: string;
  methodology: string[];
  dataInputs: string[];
  keyFindings: string;
  links: LinkItem[];
  media: MediaItem[];
  // Epistemic Metadata
  primaryEpistemicObject: string;
  outcomeForm: string;
  epistemicParadigm: EpistemicParadigm;
  centralQuestion: string;
  epistemicAnalysis?: string;
  methodProfile: MethodProfile;
  location?: {
    lat: number;
    lng: number;
    label: string;
  };
  vector?: {
    origin: [number, number];
    angle: number; // in degrees
    magnitude: number;
  };
}

export interface Incident {
  date: string;
  type: 'Airstrike' | 'Shelling' | 'Siege' | 'Evacuation Order' | 'Direct Attack';
  description: string;
  source?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Primary Healthcare';
  status: 'Functioning' | 'Partially Functioning' | 'Out of Service';
  location: {
    lat: number;
    lng: number;
  };
  boundary?: [number, number][]; // Polygon coordinates
  incidents: Incident[];
}

export interface FilterState {
  search: string;
  actorType: string;
  mission: string;
  stance: string;
  paradigm: string;
  highlightMethod: string;
}
