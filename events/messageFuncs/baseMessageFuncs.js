module.exports = {isurl, hasAttach}

function isurl(content) {
    return (content.includes('http') || content.includes('www'))
}
function hasAttach(msg) {
    return msg.attachments.size != 0;
}