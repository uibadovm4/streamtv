export class Player {
  constructor(video, empty, onState) {
    this.video = video;
    this.empty = empty;
    this.hls = null;
    this.onState = onState;
  }

  async play(channel) {
    this.destroy();
    this.video.removeAttribute("src");
    this.empty.style.display = "none";

    const nativeHls = this.video.canPlayType("application/vnd.apple.mpegurl");
    if (nativeHls) {
      this.video.src = channel.url;
      await this.video.play().catch(() => {});
      this.onState?.(channel);
      return;
    }

    if (window.Hls?.isSupported()) {
      this.hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30
      });

      this.hls.loadSource(channel.url);
      this.hls.attachMedia(this.video);

      this.hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        this.video.play().catch(() => {});
        this.onState?.(channel);
      });

      this.hls.on(window.Hls.Events.ERROR, (_, data) => {
        if (data.fatal) this.onState?.(null, "This stream reported a playback error.");
      });
      return;
    }

    this.onState?.(null, "HLS playback is not supported by this browser.");
  }

  stop() {
    this.destroy();
    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
    this.empty.style.display = "flex";
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }
}
