"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const Comment_1 = require("./Comment");
class CommentParser {
    static loadComment(target, data) {
        const { properties, toolbar, author, avatar } = data;
        // Basic information
        target.id = properties.commentId;
        target.content = properties.content.content;
        target.publishDate = properties.publishedTime;
        target.likeCount = +toolbar.likeCountLiked; // probably broken
        target.isAuthorChannelOwner = !!author.isCreator;
        target.isPinned = false; // TODO fix this
        target.replyCount = +toolbar.replyCount;
        // Reply Continuation
        target.replies.continuation = data.replies
            ? common_1.getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
            : undefined;
        // Author
        target.author = new BaseChannel_1.BaseChannel({
            id: author.id,
            name: author.displayName,
            thumbnails: new common_1.Thumbnails().load(avatar.image.sources),
            client: target.client,
        });
        return target;
    }
    static parseContinuation(data) {
        const continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(continuationItems, ["button", "buttonRenderer", "command"]);
    }
    static parseReplies(data, comment) {
        const replies = data.frameworkUpdates.entityBatchUpdate.mutations
            .filter((e) => e.payload.commentEntityPayload)
            .map((e) => e.payload.commentEntityPayload);
        return replies.map((i) => new Comment_1.Comment({ video: comment.video, client: comment.client }).load(i));
    }
}
exports.CommentParser = CommentParser;