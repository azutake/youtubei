"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVideoParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
const VideoCaptions_1 = require("./VideoCaptions");
class BaseVideoParser {
    static loadBaseVideo(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
        const videoInfo = BaseVideoParser.parseRawData(data);
        // Basic information
        target.id = videoInfo.videoDetails.videoId;
        target.title = videoInfo.videoDetails.title;
        target.uploadDate = videoInfo.dateText.simpleText;
        target.viewCount = +videoInfo.videoDetails.viewCount || null;
        target.isLiveContent = videoInfo.videoDetails.isLiveContent;
        target.thumbnails = new common_1.Thumbnails().load(videoInfo.videoDetails.thumbnail.thumbnails);
        // Channel
        const { title, thumbnail, subscriberCountText } = videoInfo.owner.videoOwnerRenderer;
        target.channel = new BaseChannel_1.BaseChannel({
            client: target.client,
            id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: title.runs[0].text,
            subscriberCount: subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText,
            thumbnails: new common_1.Thumbnails().load(thumbnail.thumbnails),
        });
        // Like Count and Dislike Count
        const topLevelButtons = videoInfo.videoActions.menuRenderer.topLevelButtons;
        target.likeCount = common_1.stripToInt(BaseVideoParser.parseButtonRenderer(topLevelButtons[0]));
        // Tags and description
        target.tags =
            ((_b = (_a = videoInfo.superTitleLink) === null || _a === void 0 ? void 0 : _a.runs) === null || _b === void 0 ? void 0 : _b.map((r) => r.text.trim()).filter((t) => t)) || [];
        target.description = videoInfo.videoDetails.shortDescription || "";
        // related videos
        const secondaryContents = (_c = data.response.contents.twoColumnWatchNextResults.secondaryResults) === null || _c === void 0 ? void 0 : _c.secondaryResults.results.find((s) => s.itemSectionRenderer).itemSectionRenderer.contents;
        if (secondaryContents) {
            target.related.items = BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, target.client);
            target.related.continuation = common_1.getContinuationFromItems(secondaryContents);
        }
        target.gameChannelId =
            ((_o = (_m = (_l = (_k = (_j = (_h = (_g = (_f = (_e = (_d = videoInfo.metadataRowContainer) === null || _d === void 0 ? void 0 : _d.metadataRowContainerRenderer) === null || _e === void 0 ? void 0 : _e.rows) === null || _f === void 0 ? void 0 : _f.at(0)) === null || _g === void 0 ? void 0 : _g.richMetadataRowRenderer) === null || _h === void 0 ? void 0 : _h.contents) === null || _j === void 0 ? void 0 : _j.at(0)) === null || _k === void 0 ? void 0 : _k.richMetadataRenderer) === null || _l === void 0 ? void 0 : _l.endpoint) === null || _m === void 0 ? void 0 : _m.browseEndpoint) === null || _o === void 0 ? void 0 : _o.browseId) || null;
        target.gameName = (_y = (_x = (_w = (_v = (_u = (_t = (_s = (_r = (_q = (_p = videoInfo.metadataRowContainer) === null || _p === void 0 ? void 0 : _p.metadataRowContainerRenderer) === null || _q === void 0 ? void 0 : _q.rows) === null || _r === void 0 ? void 0 : _r.at(0)) === null || _s === void 0 ? void 0 : _s.richMetadataRowRenderer) === null || _t === void 0 ? void 0 : _t.contents) === null || _u === void 0 ? void 0 : _u.at(0)) === null || _v === void 0 ? void 0 : _v.richMetadataRenderer) === null || _w === void 0 ? void 0 : _w.title) === null || _x === void 0 ? void 0 : _x.simpleText) !== null && _y !== void 0 ? _y : null;
        // captions
        if (videoInfo.captions) {
            target.captions = new VideoCaptions_1.VideoCaptions({ client: target.client, video: target }).load(videoInfo.captions.playerCaptionsTracklistRenderer);
        }
        target.gameChannelId =
            ((_8 = (_7 = (_6 = (_5 = (_4 = (_3 = (_2 = (_1 = (_0 = (_z = videoInfo.metadataRowContainer) === null || _z === void 0 ? void 0 : _z.metadataRowContainerRenderer) === null || _0 === void 0 ? void 0 : _0.rows) === null || _1 === void 0 ? void 0 : _1.at(0)) === null || _2 === void 0 ? void 0 : _2.richMetadataRowRenderer) === null || _3 === void 0 ? void 0 : _3.contents) === null || _4 === void 0 ? void 0 : _4.at(0)) === null || _5 === void 0 ? void 0 : _5.richMetadataRenderer) === null || _6 === void 0 ? void 0 : _6.endpoint) === null || _7 === void 0 ? void 0 : _7.browseEndpoint) === null || _8 === void 0 ? void 0 : _8.browseId) || null;
        target.gameName = (_18 = (_17 = (_16 = (_15 = (_14 = (_13 = (_12 = (_11 = (_10 = (_9 = videoInfo.metadataRowContainer) === null || _9 === void 0 ? void 0 : _9.metadataRowContainerRenderer) === null || _10 === void 0 ? void 0 : _10.rows) === null || _11 === void 0 ? void 0 : _11.at(0)) === null || _12 === void 0 ? void 0 : _12.richMetadataRowRenderer) === null || _13 === void 0 ? void 0 : _13.contents) === null || _14 === void 0 ? void 0 : _14.at(0)) === null || _15 === void 0 ? void 0 : _15.richMetadataRenderer) === null || _16 === void 0 ? void 0 : _16.title) === null || _17 === void 0 ? void 0 : _17.simpleText) !== null && _18 !== void 0 ? _18 : null;
        return target;
    }
    static parseRelated(data, client) {
        const secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, client);
    }
    static parseContinuation(data) {
        const secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(secondaryContents);
    }
    static parseRawData(data) {
        const contents = data.response.contents.twoColumnWatchNextResults.results.results.contents;
        const primaryInfo = contents.find((c) => "videoPrimaryInfoRenderer" in c)
            .videoPrimaryInfoRenderer;
        const secondaryInfo = contents.find((c) => "videoSecondaryInfoRenderer" in c).videoSecondaryInfoRenderer;
        const { videoDetails, captions } = data.playerResponse;
        return Object.assign(Object.assign(Object.assign({}, secondaryInfo), primaryInfo), { videoDetails, captions });
    }
    static parseCompactRenderer(data, client) {
        if ("compactVideoRenderer" in data) {
            return new VideoCompact_1.VideoCompact({ client }).load(data.compactVideoRenderer);
        }
        else if ("compactRadioRenderer" in data) {
            return new PlaylistCompact_1.PlaylistCompact({ client }).load(data.compactRadioRenderer);
        }
    }
    static parseRelatedFromSecondaryContent(secondaryContents, client) {
        return secondaryContents
            .map((c) => BaseVideoParser.parseCompactRenderer(c, client))
            .filter((c) => c !== undefined);
    }
    static parseButtonRenderer(data) {
        var _a, _b;
        let likeCount;
        if (data.toggleButtonRenderer || data.buttonRenderer) {
            const buttonRenderer = data.toggleButtonRenderer || data.buttonRenderer;
            likeCount = (((_a = buttonRenderer.defaultText) === null || _a === void 0 ? void 0 : _a.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonRenderer) {
            const likeButton = data.segmentedLikeDislikeButtonRenderer.likeButton;
            const buttonRenderer = likeButton.toggleButtonRenderer || likeButton.buttonRenderer;
            likeCount = (((_b = buttonRenderer.defaultText) === null || _b === void 0 ? void 0 : _b.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonViewModel) {
            likeCount =
                data.segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel
                    .toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel
                    .buttonViewModel.accessibilityText;
        }
        return likeCount;
    }
}
exports.BaseVideoParser = BaseVideoParser;
