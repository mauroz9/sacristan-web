export interface ArasaacPictogram {
    schematic: boolean;
    sex: boolean;
    violence: boolean;
    aac: boolean;
    aacColor: boolean;
    skin: boolean;
    hair: boolean;
    downloads: number;
    categories: string[];
    synsets: string[];
    tags: string[];
    _id: number;
    created: string;
    lastUpdated: string;
    keywords: Keyword[];
}

export interface Keyword {
    keyword: string;
    type: number;
    meaning?: string;
    plural: string;
    hasLocution: boolean;
}