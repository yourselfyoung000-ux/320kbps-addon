import { decryptJioSaavnMediaUrl } from '../crypto/des.js';
import type { AddonStream, AddonTrack, JioSaavnSearchResponse, JioSaavnSongRaw } from './types.js';

const JIOSAAVN_API_URL = 'https://www.jiosaavn.com/api.php';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function formatArtworkUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  return rawUrl
    .replace(/150x150|50x50/, '500x500')
    .replace(/^http:\/\//, 'https://');
}

export function normalizeQuality(raw?: string): 'high' | 'low' {
  const q = String(raw || '').toLowerCase().trim();
  if (q.includes('low') || q.includes('96') || q.includes('saver')) {
    return 'low';
  }
  return 'high';
}

export async function searchJioSaavn(
  query: string,
  requestedQuality: string = 'high',
  limit: number = 20
): Promise<AddonTrack[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const targetQuality = normalizeQuality(requestedQuality);

  const url = new URL(JIOSAAVN_API_URL);
  url.searchParams.append('__call', 'search.getResults');
  url.searchParams.append('_format', 'json');
  url.searchParams.append('_marker', '0');
  url.searchParams.append('api_version', '4');
  url.searchParams.append('ctx', 'web6dot0');
  url.searchParams.append('p', '1');
  url.searchParams.append('n', String(limit));
  url.searchParams.append('q', cleanQuery);

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': getRandomUserAgent(),
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`JioSaavn search failed with HTTP ${response.status}`);
  }

  const data = (await response.json()) as JioSaavnSearchResponse;
  const results = data?.results || [];

  return results.map((item: JioSaavnSongRaw) => {
    const primaryArtists = item.more_info?.artistMap?.primary_artists
      ?.map((a) => decodeHtmlEntities(a.name))
      .filter(Boolean) || [];

    const artistName = primaryArtists.length > 0
      ? primaryArtists.join(', ')
      : decodeHtmlEntities(item.subtitle?.split('-')[0] || item.more_info?.music || '');

    const title = decodeHtmlEntities(item.title);
    const album = decodeHtmlEntities(item.more_info?.album || 'Single');
    const duration = parseFloat(item.more_info?.duration || '0');
    const artworkURL = formatArtworkUrl(item.image);

    let streamURL: string | undefined = undefined;
    if (item.more_info?.encrypted_media_url) {
      try {
        const decrypted = decryptJioSaavnMediaUrl(item.more_info.encrypted_media_url);
        if (decrypted) {
          streamURL = targetQuality === 'high'
            ? decrypted.replace('_96', '_320')
            : decrypted.replace('_320', '_96');
        }
      } catch {}
    }

    const track: AddonTrack = {
      id: item.id,
      title,
      artist: artistName || 'Unknown Artist',
      album,
      duration,
      format: 'mp4',
      quality: targetQuality,
      audioQuality: targetQuality,
      sampleRate: 44100,
    };

    if (artworkURL) track.artworkURL = artworkURL;
    if (streamURL) track.streamURL = streamURL;

    return track;
  });
}

export async function getJioSaavnStream(
  songId: string,
  requestedQuality: string = 'high'
): Promise<AddonStream | null> {
  const cleanId = songId.trim();
  if (!cleanId) return null;

  const targetQuality = normalizeQuality(requestedQuality);

  const url = new URL(JIOSAAVN_API_URL);
  url.searchParams.append('__call', 'song.getDetails');
  url.searchParams.append('_format', 'json');
  url.searchParams.append('_marker', '0');
  url.searchParams.append('api_version', '4');
  url.searchParams.append('ctx', 'web6dot0');
  url.searchParams.append('pids', cleanId);

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': getRandomUserAgent(),
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`JioSaavn song details failed with HTTP ${response.status}`);
  }

  const rawData = (await response.json()) as Record<string, any>;
  let song: JioSaavnSongRaw | null = null;
  if (Array.isArray(rawData?.songs) && rawData.songs.length > 0) {
    song = rawData.songs[0];
  } else if (rawData?.[cleanId]) {
    song = rawData[cleanId];
  } else {
    const firstKey = Object.keys(rawData || {})[0];
    if (firstKey && rawData[firstKey]?.id) {
      song = rawData[firstKey];
    }
  }

  if (!song?.more_info?.encrypted_media_url) {
    return null;
  }

  const decryptedBaseUrl = decryptJioSaavnMediaUrl(song.more_info.encrypted_media_url);
  if (!decryptedBaseUrl) {
    return null;
  }

  const finalStreamUrl = targetQuality === 'high'
    ? decryptedBaseUrl.replace('_96', '_320')
    : decryptedBaseUrl.replace('_320', '_96');

  const bitrate = targetQuality === 'high' ? 320000 : 96000;

  return {
    url: finalStreamUrl,
    directUrl: finalStreamUrl,
    streamUrl: finalStreamUrl,
    downloadUrl: finalStreamUrl,
    format: 'mp4',
    codec: 'mp4a',
    quality: targetQuality,
    audioQuality: targetQuality,
    bitrate,
    sampleRate: 44100,
    encrypted: false,
  };
}
