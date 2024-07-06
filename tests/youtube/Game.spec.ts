import "jest-extended";

import { Client, Video } from "../../src";

const youtube = new Client({ youtubeClientOptions: { hl: "en" } });

describe("Video", () => {
	it("video game", async () => {
		const video = (await youtube.getVideo("")) as Video
		console.log(video.gameChannelId)
	});
});
