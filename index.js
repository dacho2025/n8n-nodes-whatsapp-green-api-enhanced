module.exports = {
	nodeTypes: {
		GreenApi: /* eslint-disable-line global-require */ require('./dist/nodes/GreenApi/GreenApi.node.js'),
	},
	credentialTypes: {
		GreenApi: /* eslint-disable-line global-require */ require('./dist/credentials/GreenApi.credentials.js'),
	},
};
