export class ConversorMp3 {
  async execute(input) {
    let link = await this.getMp3(input);
    return { message: link };
  }
  async getMp3(videoUrl) {
    const urlData = new URLSearchParams();
    urlData.append("url", videoUrl);
    const response = await fetch("https://www.youtubemp3.ltd/convert", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlData.toString(),
    }).then((r) => r.json());

    return response.link;
  }
}
