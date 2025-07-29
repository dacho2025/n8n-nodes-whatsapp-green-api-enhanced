module.exports = {
	nodeTypes: {
		GreenApi: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApi/GreenApi.node.js'),
		GreenApiTrigger: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiTrigger/GreenApiTrigger.node.js'),
		GreenApiMessageTrigger: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiMessageTrigger/GreenApiMessageTrigger.node.js'),
		GreenApiGetVoice: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiGetVoice/GreenApiGetVoice.node.js'),
		GreenApiGetDocument: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiGetDocument/GreenApiGetDocument.node.js'),
		GreenApiGetImage: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiGetImage/GreenApiGetImage.node.js'),
		GreenApiGetVideo: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApiGetVideo/GreenApiGetVideo.node.js'),
	},
	credentialTypes: {
		GreenApi: /* eslint-disable-line global-require */ require('./dist/credentials/GreenApi.credentials.js'),
	},
};
