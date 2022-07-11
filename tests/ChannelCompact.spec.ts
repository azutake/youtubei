import "jest-extended";

import { BaseChannel, Client, SearchType } from "../src";
import { commonBaseChannelTest } from "./CommonBaseChannel.spec";

const youtube = new Client();

describe("BaseChannel", () => {
	let channel: BaseChannel;

	beforeAll(async () => {
		channel = (await youtube.findOne("Linus Tech Tips", {
			type: SearchType.CHANNEL,
		})) as BaseChannel;
	});

	it("match channel from search result", () => {
		commonBaseChannelTest(channel);
	});

	it("load videos", async () => {
		const videos = await channel.nextVideos(2);
		expect(videos.length).toBeGreaterThan(50);
		expect(channel.videos.length).toBe(videos.length);
	});

	it("load playlists", async () => {
		const playlists = await channel.nextPlaylists(2);
		expect(playlists.length).toBe(60);
		expect(channel.playlists.length).toBe(playlists.length);
	});
});
