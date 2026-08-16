# claude-real-video — Let Claude Actually Watch a Video

## Overview
This tool enables Claude to analyze videos by extracting keyframes and transcripts, since Claude cannot directly process video content.

## When to Use
The user provides a video URL or file path and wants summarization, analysis, structure evaluation, or answers about its content.

## Setup Requirements
Installation requires Python 3.10+, ffmpeg, and the command: `pip install claude-real-video`. The faster-whisper model downloads automatically on first use.

## Workflow
1. **Extract content** using: `crv "<url-or-path>" -o crv-out --grid --why "<user question>"` (add `--max-frames 60` for lengthy videos)

2. **Review manifest** by reading `crv-out/MANIFEST.txt` first, which contains timestamps and the complete transcript

3. **Examine visuals** starting with contact sheets in `crv-out/grids/` showing chronological 3×3 keyframe sequences; access individual frames only when needed

4. **Respond** by citing specific timestamps from the manifest

## Key Features
Processing occurs locally without external uploads. Use `--no-transcribe` for silent videos (faster). The `--kb <dir>` option preserves analysis in a knowledge-base folder.

## Notes
- Requires: `pip install "claude-real-video[whisper]"` for transcription, or `pip install claude-real-video` for frames only
- Requires: `ffmpeg` installed on the system
- MCP server: `pip install "claude-real-video[mcp]"` then `claude mcp add crv -- crv-mcp`
- Source: https://github.com/HUANGCHIHHUNGLeo/claude-real-video (MIT License)
