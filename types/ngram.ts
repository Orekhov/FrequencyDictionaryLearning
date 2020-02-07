export interface NGram {
    id: string;
    item: string,
    count: number,
    known: boolean;
    updated: Date;
}

export interface UniGram extends NGram {
    
}

export interface BiGram extends NGram {
    
}

export interface TriGram extends NGram {
    
}