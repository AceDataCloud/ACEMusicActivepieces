# ACE Music for Activepieces

Build and pack the piece from this repository. On an Activepieces instance with private pieces enabled, upload the generated tarball in **Platform Admin → Pieces**. See the [Activepieces private piece guide](https://www.activepieces.com/docs/build-pieces/sharing-pieces/private).

```sh
npm ci
npm test
npm pack
```

Get an [application API key](https://platform.acedata.cloud/console/applications) with ACE Music access. In the flow builder, select an ACE Music action, create a connection and enter the raw key in **Ace Data Cloud application API key**. Keep keys out of prompts, shared workflows and commits.

| Action | Inputs or result |
| --- | --- |
| Create song from idea | Prompt and optional ACE Music model. |
| Create song from lyrics | Lyrics, style and title. |
| Import reference MP3 | Public HTTPS MP3 URL. Save the delivered track ID. |
| Cover a track | One owned track ID, lyrics and style. |
| Blend two tracks | Two distinct compatible owned track IDs, lyrics and style. |
| Generate lyrics | Prompt and optional style. Returns lyrics or a pending task ID. |
| Retrieve task / multiple tasks | Use the original task IDs. |
| List task history | Optional page and items per page. |

Audio creation, reference import and writing lyrics are separately priced. Use the creation tool once, save its `task_id`, then retrieve the same task. If the connection breaks before a task ID arrives, inspect task history before resubmitting. The task state and `response` carry completion and partial failures. A partial result can contain one usable track. Play delivered tracks from `response.data[].audio_url`. Read [ACE Music API documentation](https://github.com/AceDataCloud/ACEMusicAPI) and [current pricing](https://platform.acedata.cloud/services/024e09b4-52cf-5e98-a91a-efedf43104c4).
