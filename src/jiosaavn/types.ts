export interface AddonManifest {
  id: string;
  name: string;
  version: string;
  resources: string[];
  settings?: Array<{
    key: string;
    type: string;
    default: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export interface AddonTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  format: 'mp4';
  quality: 'high' | 'low';
  audioQuality: 'high' | 'low';
  bitDepth?: number;
  sampleRate?: number;
  artworkURL?: string;
  streamURL?: string;
}

export interface AddonStream {
  url: string;
  directUrl?: string;
  streamUrl?: string;
  downloadUrl?: string;
  format: 'mp4';
  codec: 'mp4a' | 'aac';
  quality: 'high' | 'low';
  audioQuality: 'high' | 'low';
  bitrate: 320000 | 96000;
  sampleRate: 44100;
  encrypted: false;
}

export interface JioSaavnSongRaw {
  id: string;
  title: string;
  subtitle?: string;
  header_desc?: string;
  type?: string;
  perma_url?: string;
  image?: string;
  language?: string;
  year?: string;
  play_count?: string;
  explicit_content?: string;
  more_info?: {
    music?: string;
    album_id?: string;
    album?: string;
    label?: string;
    duration?: string;
    encrypted_media_url?: string;
    artistMap?: {
      primary_artists?: Array<{ id: string; name: string }>;
      featured_artists?: Array<{ id: string; name: string }>;
      artists?: Array<{ id: string; name: string; role?: string }>;
    };
    [key: string]: unknown;
  };
}

export interface JioSaavnSearchResponse {
  total: number;
  start: number;
  results: JioSaavnSongRaw[];
}
