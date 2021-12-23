interface Meta {
    status: number;
}

interface Stats {
    unreviewed_annotations: number;
    hot: boolean;
}

interface PrimaryArtist {
    _type: string;
    api_path: string;
    header_image_url: string;
    id: number;
    image_url: string;
    index_character: string;
    is_meme_verified: boolean;
    is_verified: boolean;
    name: string;
    slug: string;
    url: string;
}

interface Result {
    _type: string;
    annotation_count: number;
    api_path: string;
    artist_names: string;
    full_title: string;
    header_image_thumbnail_url: string;
    header_image_url: string;
    id: number;
    instrumental: boolean;
    lyrics_owner_id: number;
    lyrics_state: string;
    lyrics_updated_at: number;
    path: string;
    pyongs_count?: any;
    song_art_image_thumbnail_url: string;
    song_art_image_url: string;
    stats: Stats;
    title: string;
    title_with_featured: string;
    updated_by_human_at: number;
    url: string;
    primary_artist: PrimaryArtist;
}

interface Hit {
    highlights: any[];
    index: string;
    type: string;
    result: Result;
}

interface Section {
    type: 'song' | 'top_hit' | 'lyric' | 'artist' | 'album' | 'video' | 'article' | 'user';
    hits: Hit[];
}

interface Response {
    sections: Section[];
}

export interface GeniusFetchSongResponse {
    meta: Meta;
    response: Response;
}
