"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVideoParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
class BaseVideoParser {
    static loadBaseVideo(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
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
        const secondaryContents = (_c = data[3].response.contents.twoColumnWatchNextResults.secondaryResults) === null || _c === void 0 ? void 0 : _c.secondaryResults.results;
        if (secondaryContents) {
            target.related.items = BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, target.client);
            target.related.continuation = common_1.getContinuationFromItems(secondaryContents);
        }
        target.gameChannelId =
            ((_o = (_m = (_l = (_k = (_j = (_h = (_g = (_f = (_e = (_d = videoInfo.metadataRowContainer) === null || _d === void 0 ? void 0 : _d.metadataRowContainerRenderer) === null || _e === void 0 ? void 0 : _e.rows) === null || _f === void 0 ? void 0 : _f.at(0)) === null || _g === void 0 ? void 0 : _g.richMetadataRowRenderer) === null || _h === void 0 ? void 0 : _h.contents) === null || _j === void 0 ? void 0 : _j.at(0)) === null || _k === void 0 ? void 0 : _k.richMetadataRenderer) === null || _l === void 0 ? void 0 : _l.endpoint) === null || _m === void 0 ? void 0 : _m.browseEndpoint) === null || _o === void 0 ? void 0 : _o.browseId) || null;
        target.gameName = (_y = (_x = (_w = (_v = (_u = (_t = (_s = (_r = (_q = (_p = videoInfo.metadataRowContainer) === null || _p === void 0 ? void 0 : _p.metadataRowContainerRenderer) === null || _q === void 0 ? void 0 : _q.rows) === null || _r === void 0 ? void 0 : _r.at(0)) === null || _s === void 0 ? void 0 : _s.richMetadataRowRenderer) === null || _t === void 0 ? void 0 : _t.contents) === null || _u === void 0 ? void 0 : _u.at(0)) === null || _v === void 0 ? void 0 : _v.richMetadataRenderer) === null || _w === void 0 ? void 0 : _w.title) === null || _x === void 0 ? void 0 : _x.simpleText) !== null && _y !== void 0 ? _y : null;
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
        const contents = data[3].response.contents.twoColumnWatchNextResults.results.results.contents;
        const primaryInfo = contents.find((c) => "videoPrimaryInfoRenderer" in c)
            .videoPrimaryInfoRenderer;
        const secondaryInfo = contents.find((c) => "videoSecondaryInfoRenderer" in c).videoSecondaryInfoRenderer;
        const videoDetails = data[2].playerResponse.videoDetails;
        return Object.assign(Object.assign(Object.assign({}, secondaryInfo), primaryInfo), { videoDetails });
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
