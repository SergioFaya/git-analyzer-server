
var should = require('should');

// services
var AuthService = require('../dist/app/services/business/impl/AuthService');
var CodeReviewService = require('../dist/app/services/business/impl/CodeReviewServiceImpl');
var NetworkChartService = require('../dist/app/services/business/impl/NetworkChartServiceImpl');
var WebHookService = require('../dist/app/services/business/impl/WebHookServiceImpl');
// schemas
var CodeReview = require('../dist/app/schemas/CodeReviewSchema')

before(() => {
	// lifts up the database
	require('../dist/app/App')
});


describe('Business Services Tests', function () {

	describe('AuthServiceTest', function () {
		it('testAuth', function () {
			const authPromise = AuthService.default.auth();
			should(authPromise).be.Promise();
			should(authPromise.url).be.eql("localhost:3000/login/check");
			should(authPromise.header.Accept).be.eql("application/json");
			should(authPromise.header['x-access-token']).be.ok;
		});
	})

	describe('CodeReviewServiceTest', function () {
		const username = 'test';
		it('testGetAllCodeReviewsForUser', function (done) {
			CodeReviewService.default.getAllCodeReviewsForUser(username)
				.then(() => {
					done()
				})
				.catch((err) => done(err))
		});
		var codeReview = {
			title: "test-review",
			created_at: "0",
			created_by: "test",
			commentary: "test commentary",
			repository: "repository",
			calification: 7
		};
		it('testCreateNewCodeReview', function (done) {
			CodeReviewService.default
				.createNewCodeReview(codeReview)
				.then(() => {
					CodeReview.CodeReviewModel.find({ created_by: "test", title: "test-review" })
						.then(() => done())
						.catch((err) => done(err));
				}).catch((err) => {
					done(err)
				});
		});
		codeReview.id = 1000;
		it('testDeleteCodeReview', function (done) {
			CodeReviewService.default.deleteCodeReview(1000)
				.then(() => {
					CodeReview.CodeReviewModel.find({ id: 1000 })
						.then((result) => {
							if (result) {
								done()
							} else {
								done(err)
							}
						})
						.catch((err) => done(err));
				})
				.catch((err) => done(err))
		});
	})

	describe('NetworkChartServiceTest', function () {
		// log output used to build the chart
		const log = "45079bc085127b244a3009990d8f19ba0ea99029|07a7df9538987e3e1a4212a7a86cb5fc3188594f| (HEAD -> master, origin/master, origin/HEAD)|Sergio Faya Fernández\n" +
			"07a7df9538987e3e1a4212a7a86cb5fc3188594f|6bb68b8b708f343c2d749555fb9da8d8f83c3253||Sergio Faya Fernández\n" +
			"6bb68b8b708f343c2d749555fb9da8d8f83c3253|aca289a73328e27772e24dcae6e6b60e6ddf04d1||SergioFaya\n" +
			"aca289a73328e27772e24dcae6e6b60e6ddf04d1|cf9fc7d4614a66171531c14d9649fd76ba1782d0||SergioFaya\n" +
			"cf9fc7d4614a66171531c14d9649fd76ba1782d0|26ea303bbfbe8dd928dc73b1294b886ec131e381||SergioFaya\n" +
			"26ea303bbfbe8dd928dc73b1294b886ec131e381|f3acb4806b5e766d2c94a969e87958a6450693c5||Sergio Faya Fernández\n" +
			"f3acb4806b5e766d2c94a969e87958a6450693c5|ad8c19685089e7cee5280a7c6b8d080812b3510b||SergioFaya\n" +
			"ad8c19685089e7cee5280a7c6b8d080812b3510b|612cd567aa881e75a982b6b56559cee188bca4fb||SergioFaya\n" +
			"612cd567aa881e75a982b6b56559cee188bca4fb|6622ba25bec847e71e4576a129e7579d65a913aa ea9848bbdc280c09fc10f85692e039509d742302||SergioFaya\n" +
			"6622ba25bec847e71e4576a129e7579d65a913aa|8ce9146182f951fd27fe68c23aad9dbfc1d75950||SergioFaya\n" +
			"ea9848bbdc280c09fc10f85692e039509d742302|b4a86d27312aee7578472ec4e91768b07d5fdbe0||Sergio Faya Fernández\n" +
			"b4a86d27312aee7578472ec4e91768b07d5fdbe0|8ce9146182f951fd27fe68c23aad9dbfc1d75950||Sergio Faya Fernández\n" +
			"8ce9146182f951fd27fe68c23aad9dbfc1d75950|7b02ee07a51ec517439dabd8365eecc31a430668||SergioFaya\n" +
			"7b02ee07a51ec517439dabd8365eecc31a430668|ff82e42eb86657ce4573dc95b38c7afe7cc78b6f||Sergio Faya Fernández\n" +
			"ff82e42eb86657ce4573dc95b38c7afe7cc78b6f|7f57a55eb829f3f5b8ad1e59b3601d779391d754||Sergio Faya Fernández\n" +
			"7f57a55eb829f3f5b8ad1e59b3601d779391d754|592691d0fd94dc618f9eea23362b8180800264ae||Sergio Faya Fernández\n" +
			"592691d0fd94dc618f9eea23362b8180800264ae|4e10836147f86bcc1a2d7d76f320605d32ec5358||SergioFaya\n" +
			"4e10836147f86bcc1a2d7d76f320605d32ec5358|||Jose Emilio Labra Gayo\n";

		const expectedGraph = {
			nodes:
				[{
					x: 0,
					y: 0,
					id: '45079bc085127b244a3009990d8f19ba0ea99029',
					size: 10,
					color: '#008cc2',
					parents: ["07a7df9538987e3e1a4212a7a86cb5fc3188594f"]
				},
				{
					x: 0,
					y: 2,
					id: '07a7df9538987e3e1a4212a7a86cb5fc3188594f',
					size: 10,
					color: '#008cc2',
					parents: ["6bb68b8b708f343c2d749555fb9da8d8f83c3253"]
				},
				{
					x: 0,
					y: 4,
					id: '6bb68b8b708f343c2d749555fb9da8d8f83c3253',
					size: 10,
					color: '#008cc2',
					parents: ["aca289a73328e27772e24dcae6e6b60e6ddf04d1"]
				},
				{
					x: 0,
					y: 6,
					id: 'aca289a73328e27772e24dcae6e6b60e6ddf04d1',
					size: 10,
					color: '#008cc2',
					parents: ["cf9fc7d4614a66171531c14d9649fd76ba1782d0"]
				},
				{
					x: 0,
					y: 8,
					id: 'cf9fc7d4614a66171531c14d9649fd76ba1782d0',
					size: 10,
					color: '#008cc2',
					parents: ["26ea303bbfbe8dd928dc73b1294b886ec131e381"]
				},
				{
					x: 0,
					y: 10,
					id: '26ea303bbfbe8dd928dc73b1294b886ec131e381',
					size: 10,
					color: '#008cc2',
					parents: ["f3acb4806b5e766d2c94a969e87958a6450693c5"]
				},
				{
					x: 0,
					y: 12,
					id: 'f3acb4806b5e766d2c94a969e87958a6450693c5',
					size: 10,
					color: '#008cc2',
					parents: ["ad8c19685089e7cee5280a7c6b8d080812b3510b"]
				},
				{
					x: 0,
					y: 14,
					id: 'ad8c19685089e7cee5280a7c6b8d080812b3510b',
					size: 10,
					color: '#008cc2',
					parents: ["612cd567aa881e75a982b6b56559cee188bca4fb"]
				},
				{
					x: 0,
					y: 16,
					id: '612cd567aa881e75a982b6b56559cee188bca4fb',
					size: 10,
					color: '#008cc2',
					parents: ["6622ba25bec847e71e4576a129e7579d65a913aa", "ea9848bbdc280c09fc10f85692e039509d742302"]
				},
				{
					x: 0,
					y: 18,
					id: '6622ba25bec847e71e4576a129e7579d65a913aa',
					size: 10,
					color: '#008cc2',
					parents: ["8ce9146182f951fd27fe68c23aad9dbfc1d75950"]
				},
				{
					x: 4,
					y: 20,
					id: 'ea9848bbdc280c09fc10f85692e039509d742302',
					size: 10,
					color: '#008cc2',
					parents: ["b4a86d27312aee7578472ec4e91768b07d5fdbe0"]
				},
				{
					x: 4,
					y: 22,
					id: 'b4a86d27312aee7578472ec4e91768b07d5fdbe0',
					size: 10,
					color: '#008cc2',
					parents: ["8ce9146182f951fd27fe68c23aad9dbfc1d75950"]
				},
				{
					x: 0,
					y: 24,
					id: '8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					size: 10,
					color: '#008cc2',
					parents: ["7b02ee07a51ec517439dabd8365eecc31a430668"]
				},
				{
					x: 0,
					y: 26,
					id: '7b02ee07a51ec517439dabd8365eecc31a430668',
					size: 10,
					color: '#008cc2',
					parents: ["ff82e42eb86657ce4573dc95b38c7afe7cc78b6f"]
				},
				{
					x: 0,
					y: 28,
					id: 'ff82e42eb86657ce4573dc95b38c7afe7cc78b6f',
					size: 10,
					color: '#008cc2',
					parents: ["7f57a55eb829f3f5b8ad1e59b3601d779391d754"]
				},
				{
					x: 0,
					y: 30,
					id: '7f57a55eb829f3f5b8ad1e59b3601d779391d754',
					size: 10,
					color: '#008cc2',
					parents: ["592691d0fd94dc618f9eea23362b8180800264ae"]
				},
				{
					x: 0,
					y: 32,
					id: '592691d0fd94dc618f9eea23362b8180800264ae',
					size: 10,
					color: '#008cc2',
					parents: ["4e10836147f86bcc1a2d7d76f320605d32ec5358"]
				},
				{
					x: 0,
					y: 34,
					id: '4e10836147f86bcc1a2d7d76f320605d32ec5358',
					size: 10,
					color: '#008cc2',
					parents: undefined
				}],
			edges:
				[{
					id: 'edge45079bc085127b244a3009990d8f19ba0ea99029-07a7df9538987e3e1a4212a7a86cb5fc3188594f',
					label: 'Edge ',
					source: '07a7df9538987e3e1a4212a7a86cb5fc3188594f',
					target: '45079bc085127b244a3009990d8f19ba0ea99029',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge07a7df9538987e3e1a4212a7a86cb5fc3188594f-6bb68b8b708f343c2d749555fb9da8d8f83c3253',
					label: 'Edge ',
					source: '6bb68b8b708f343c2d749555fb9da8d8f83c3253',
					target: '07a7df9538987e3e1a4212a7a86cb5fc3188594f',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge6bb68b8b708f343c2d749555fb9da8d8f83c3253-aca289a73328e27772e24dcae6e6b60e6ddf04d1',
					label: 'Edge ',
					source: 'aca289a73328e27772e24dcae6e6b60e6ddf04d1',
					target: '6bb68b8b708f343c2d749555fb9da8d8f83c3253',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgeaca289a73328e27772e24dcae6e6b60e6ddf04d1-cf9fc7d4614a66171531c14d9649fd76ba1782d0',
					label: 'Edge ',
					source: 'cf9fc7d4614a66171531c14d9649fd76ba1782d0',
					target: 'aca289a73328e27772e24dcae6e6b60e6ddf04d1',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgecf9fc7d4614a66171531c14d9649fd76ba1782d0-26ea303bbfbe8dd928dc73b1294b886ec131e381',
					label: 'Edge ',
					source: '26ea303bbfbe8dd928dc73b1294b886ec131e381',
					target: 'cf9fc7d4614a66171531c14d9649fd76ba1782d0',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge26ea303bbfbe8dd928dc73b1294b886ec131e381-f3acb4806b5e766d2c94a969e87958a6450693c5',
					label: 'Edge ',
					source: 'f3acb4806b5e766d2c94a969e87958a6450693c5',
					target: '26ea303bbfbe8dd928dc73b1294b886ec131e381',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgef3acb4806b5e766d2c94a969e87958a6450693c5-ad8c19685089e7cee5280a7c6b8d080812b3510b',
					label: 'Edge ',
					source: 'ad8c19685089e7cee5280a7c6b8d080812b3510b',
					target: 'f3acb4806b5e766d2c94a969e87958a6450693c5',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgead8c19685089e7cee5280a7c6b8d080812b3510b-612cd567aa881e75a982b6b56559cee188bca4fb',
					label: 'Edge ',
					source: '612cd567aa881e75a982b6b56559cee188bca4fb',
					target: 'ad8c19685089e7cee5280a7c6b8d080812b3510b',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge612cd567aa881e75a982b6b56559cee188bca4fb-6622ba25bec847e71e4576a129e7579d65a913aa',
					label: 'Edge ',
					source: '6622ba25bec847e71e4576a129e7579d65a913aa',
					target: '612cd567aa881e75a982b6b56559cee188bca4fb',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge612cd567aa881e75a982b6b56559cee188bca4fb-ea9848bbdc280c09fc10f85692e039509d742302',
					label: 'Edge ',
					source: 'ea9848bbdc280c09fc10f85692e039509d742302',
					target: '612cd567aa881e75a982b6b56559cee188bca4fb',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge6622ba25bec847e71e4576a129e7579d65a913aa-8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					label: 'Edge ',
					source: '8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					target: '6622ba25bec847e71e4576a129e7579d65a913aa',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgeea9848bbdc280c09fc10f85692e039509d742302-b4a86d27312aee7578472ec4e91768b07d5fdbe0',
					label: 'Edge ',
					source: 'b4a86d27312aee7578472ec4e91768b07d5fdbe0',
					target: 'ea9848bbdc280c09fc10f85692e039509d742302',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgeb4a86d27312aee7578472ec4e91768b07d5fdbe0-8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					label: 'Edge ',
					source: '8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					target: 'b4a86d27312aee7578472ec4e91768b07d5fdbe0',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge8ce9146182f951fd27fe68c23aad9dbfc1d75950-7b02ee07a51ec517439dabd8365eecc31a430668',
					label: 'Edge ',
					source: '7b02ee07a51ec517439dabd8365eecc31a430668',
					target: '8ce9146182f951fd27fe68c23aad9dbfc1d75950',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge7b02ee07a51ec517439dabd8365eecc31a430668-ff82e42eb86657ce4573dc95b38c7afe7cc78b6f',
					label: 'Edge ',
					source: 'ff82e42eb86657ce4573dc95b38c7afe7cc78b6f',
					target: '7b02ee07a51ec517439dabd8365eecc31a430668',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edgeff82e42eb86657ce4573dc95b38c7afe7cc78b6f-7f57a55eb829f3f5b8ad1e59b3601d779391d754',
					label: 'Edge ',
					source: '7f57a55eb829f3f5b8ad1e59b3601d779391d754',
					target: 'ff82e42eb86657ce4573dc95b38c7afe7cc78b6f',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge7f57a55eb829f3f5b8ad1e59b3601d779391d754-592691d0fd94dc618f9eea23362b8180800264ae',
					label: 'Edge ',
					source: '592691d0fd94dc618f9eea23362b8180800264ae',
					target: '7f57a55eb829f3f5b8ad1e59b3601d779391d754',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				},
				{
					id: 'edge592691d0fd94dc618f9eea23362b8180800264ae-4e10836147f86bcc1a2d7d76f320605d32ec5358',
					label: 'Edge ',
					source: '4e10836147f86bcc1a2d7d76f320605d32ec5358',
					target: '592691d0fd94dc618f9eea23362b8180800264ae',
					size: 5,
					color: '#fffff',
					type: 'arrow'
				}],
			height: 306
		};

		it('testGitChart', async () => {
			const graph = await NetworkChartService.formatLogs(log);
			should(graph.nodes).be.eql(expectedGraph.nodes);
			should(graph.edges).be.eql(expectedGraph.edges);
			should(graph.height).be.eql(expectedGraph.height);
		})

	});



	describe('WebHookServiceTest', function () {
		const issue = {
			timestamp: 000000000,
			action: "create",
			issue: "Issue",
			repository: "repository",
		}

		const pullReq = {
			timestamp: 000000000,
			action: "create",
			pull_request: "pull req",
			repository: "repository"
		}

		const push = {
			ref: "master",
			head_commit: "418shha",
			repository: "test-repo",
			pusher: "test",
			timestamp: 000000000
		}
		const username = 'test-username';

		it('testSaveIssueEvent', (done) => {
			done(WebHookService.default.saveIssueEvent(issue))
		});
		it('testSavePullReqEvent', (done) => {
			done(WebHookService.default.savePullReqEvent(pullReq))
		});
		it('testSavePushEvent', (done) => {
			done(WebHookService.default.savePushEvent(push))
		});
		//
		it('testFindLatestsIssues', (done) => {
			WebHookService.default.findLatestsIssues(username).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
		it('testFindLatestsPullReqs', (done) => {
			WebHookService.default.findLatestsPullReqs(username).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
		it('testFindLatestsPushEvents', (done) => {
			WebHookService.default.findLatestsPushEvents(username).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
		// 
		const limit = 1;
		it('testFindLatestsIssues_1Result', (done) => {
			WebHookService.default.findLatestsIssues(username, limit).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
		it('testFindLatestsPullReqs_1Result', (done) => {
			WebHookService.default.findLatestsPullReqs(username, limit).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
		it('testFindLatestsPushEvents_1Result', (done) => {
			WebHookService.default.findLatestsPushEvents(username, limit).then((result) => {
				if (result) {
					done()
				} else {
					done(err)
				}
			}).catch((err) => {
				done(err)
			})
		});
	});
})