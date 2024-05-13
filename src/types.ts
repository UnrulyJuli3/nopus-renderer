export type RenderInput = RenderDiscreteInput | RenderContinuousInput;
export type RenderDiscreteInput = [number, [number, number, number][]];
export type RenderContinuousInput = [number, number, [number, number][]];

export type BeatmapType = "Discrete" | "Continuous";

export interface RenderPerformance {
    beatmapCategory: string;
    beatmapType: BeatmapType;
    flubs: number[];
    inputs: RenderInput[];
    instrumentSlug: string;
    limits?: [number, number, number][];
    name: string;
    score: number;
    sessionId: number;
}

export interface RenderPayload {
    duration: number;
    hash: string;
    instruments: any[];
    locale: string;
    performances: RenderPerformance[];
    songSlug: string;
    unoccupiedCategories: string[];
}