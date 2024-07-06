import "jest-extended";

import { Client, Video } from "../../src";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("Video", () => {
	it("video game", async () => {
		const video = (await youtube.getVideo("6I2kcydk0yA")) as Video
		console.log(video.gameChannelId)
	});
});
