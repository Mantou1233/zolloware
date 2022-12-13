import ytpl, { YouTubeStream } from "play-dl";

/**
 * 與 Youtube 相關的功能性函式
 */
export class YoutubeUtil extends null {
  /**
   * 確認字串是不是合法的 Youtube 影片連結
   * @param url 字串
   */
  static isVideoUrl(url: string): boolean {
    return /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(url);
  }

  /**
   * 確認字串是不是合法的 Youtube 播放清單連結
   * @param url 字串
   */
  static isPlaylistUrl(url: string): boolean {
    return /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))\/(?:(playlist|watch))?(.*)?((\?|\&)list=)(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}(&.*)?$/.test(url);
  }

  /**
   * 嘗試抓取指定連結的 Youtube 音樂串流，最多會嘗試 5 次
   * @param url 指定連結
   * @returns 音樂串流
   */
  static async getStream(url: string): Promise<YouTubeStream | void> {
    let stream: YouTubeStream | void;
    for (let i = 0; i < 5 && !stream; i++) {
      stream = await ytpl.stream(url).catch(() => {}) as YouTubeStream | void;
    }
    return stream;
  }
}
