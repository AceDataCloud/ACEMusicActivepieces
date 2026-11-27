import { createAction, createPiece, PieceAuth, Property } from '@activepieces/pieces-framework';

import { invoke } from './client';

const auth = PieceAuth.SecretText({
  displayName: 'Ace Data Cloud application API key',
  description: 'Enter the raw [application key](https://platform.acedata.cloud/console/applications?utm_source=activepieces&utm_medium=referral&utm_campaign=evergreen) with ACE Music access.',
  required: true,
});

const generate = createAction({
  name: 'generate',
  displayName: 'Create song from idea',
  description: 'Submit one paid song generation. Save its task ID.',
  auth,
  props: {
    prompt: Property.LongText({ displayName: 'Music or lyrics idea', required: true }),
    model: Property.StaticDropdown({ displayName: 'Model', required: false, options: { options: ['acemusic-v1.1', 'acemusic-v1'].map(value => ({ label: value, value })) } }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'generate', context.propsValue);
  },
});

const custom = createAction({
  name: 'custom',
  displayName: 'Create song from lyrics',
  description: 'Submit one paid song generation with your own lyrics, style and title.',
  auth,
  props: {
    lyric: Property.LongText({ displayName: 'Lyrics', required: true }),
    style: Property.LongText({ displayName: 'Musical style', required: true }),
    title: Property.ShortText({ displayName: 'Title', required: true }),
    model: Property.StaticDropdown({ displayName: 'Model', required: false, options: { options: ['acemusic-v1.1', 'acemusic-v1'].map(value => ({ label: value, value })) } }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'custom', context.propsValue);
  },
});

const upload = createAction({
  name: 'upload',
  displayName: 'Import reference MP3',
  description: 'Import one publicly accessible HTTPS MP3 as a separately priced reference.',
  auth,
  props: {
    audio_url: Property.ShortText({ displayName: 'Public HTTPS MP3 URL', required: true }),
    name: Property.ShortText({ displayName: 'Display name', required: false }),
    audio_id: Property.ShortText({ displayName: 'Owned track ID', required: false }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'upload', context.propsValue);
  },
});

const cover = createAction({
  name: 'cover',
  displayName: 'Cover a track',
  description: 'Submit one paid cover using a caller-owned track ID and new lyrics and style.',
  auth,
  props: {
    audio_id: Property.ShortText({ displayName: 'Owned track ID', required: true }),
    lyric: Property.LongText({ displayName: 'Lyrics', required: true }),
    style: Property.LongText({ displayName: 'Musical style', required: true }),
    title: Property.ShortText({ displayName: 'Title', required: false }),
    audio_influence: Property.Number({ displayName: 'Audio influence (1–100)', required: false }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'cover', context.propsValue);
  },
});

const mashup = createAction({
  name: 'mashup',
  displayName: 'Blend two tracks',
  description: 'Submit one paid mashup with two distinct, compatible caller-owned track IDs.',
  auth,
  props: {
    first_audio_id: Property.ShortText({ displayName: 'First owned track ID', required: true }),
    second_audio_id: Property.ShortText({ displayName: 'Second owned track ID', required: true }),
    lyric: Property.LongText({ displayName: 'Lyrics', required: true }),
    style: Property.LongText({ displayName: 'Musical style', required: true }),
    title: Property.ShortText({ displayName: 'Title', required: false }),
    audio_influence: Property.Number({ displayName: 'Audio influence (1–100)', required: false }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'mashup', context.propsValue);
  },
});

const lyrics = createAction({
  name: 'lyrics',
  displayName: 'Generate lyrics',
  description: 'Request paid lyrics independently. The reply may contain lyrics or a pending task ID.',
  auth,
  props: {
    prompt: Property.LongText({ displayName: 'Music or lyrics idea', required: true }),
    style: Property.LongText({ displayName: 'Musical style', required: false }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'lyrics', context.propsValue);
  },
});

const retrieve = createAction({
  name: 'retrieve',
  displayName: 'Retrieve task',
  description: 'Read the same task ID. Inspect its state and response for tracks or lyrics.',
  auth,
  props: {
    task_id: Property.ShortText({ displayName: 'Task ID', required: true }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'retrieve', context.propsValue);
  },
});

const batch = createAction({
  name: 'batch',
  displayName: 'Retrieve multiple tasks',
  description: 'Read 1 to 100 existing task IDs, one per line.',
  auth,
  props: {
    task_ids: Property.LongText({ displayName: 'Task IDs (one per line)', required: true }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'batch', context.propsValue);
  },
});

const history = createAction({
  name: 'history',
  displayName: 'List task history',
  description: 'Read one page of the authenticated application’s task history.',
  auth,
  props: {
    page: Property.Number({ displayName: 'Page (1–10001)', required: false }),
    page_size: Property.Number({ displayName: 'Items per page (1–100)', required: false }),
  },
  async run(context) {
    return invoke(context.auth.secret_text, 'history', context.propsValue);
  },
});

export const acemusic = createPiece({
  displayName: 'ACE Music by Ace Data Cloud',
  description: 'Create music and lyrics, import references, and retrieve original tasks.',
  logoUrl: 'https://cdn.acedata.cloud/acemusic-icon-52deddfc87b9.png',
  authors: ['Ace Data Cloud'],
  minimumSupportedRelease: '0.92.2',
  auth,
  actions: [generate, custom, upload, cover, mashup, lyrics, retrieve, batch, history],
  triggers: [],
});
