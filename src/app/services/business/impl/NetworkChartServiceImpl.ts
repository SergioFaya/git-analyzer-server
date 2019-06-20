import * as fs from 'fs';
import { EdgeType, IEdgeNetworkChart, INetWorkChart, INodeNetworkChart } from 'git-analyzer-types';
// @ts-ignore
import git from 'simple-git';
// @ts-ignore
import gitPromise from 'simple-git/promise';
import { config } from '../../../../config/impl/Config';
import { errorLogger } from '../../../../logger/Logger';
import NetworkChartService from '../NetworkChartService';

const networkChartService: NetworkChartService = {
	getNetworkChartData: (token: string, username: string, reponame: string): any => {
		const URL = `github.com/${reponame}`;
		const repository = `https://${username}:${token}@${URL}`;
		var options = config.app.chartsConfig.logOptions;
		var path = config.app.repositoryFilesPath + reponame;
		if (fs.existsSync(path)) {
			return gitPromise(path)
				.pull(repository)
				.then(async () => {
					return await callFormatLogsAsync(path, options)
				})
				.then((result: any) => {
					return result;
				})
				.catch((err: Error) => {
					errorLogger(`Cannot pull repo:${repository} with simple-git`, err);
				});
		} else {
			return gitPromise().silent(false)
				.clone(repository, path)
				.then(async () => {
					return await callFormatLogsAsync(reponame, options)
				})
				.then((result: any) => {
					return result;
				})
				.catch((err: Error) => {
					errorLogger(`Cannot clone repo:${repository} with simple-git`, err)
				});
		}
	}
};

async function callFormatLogsAsync(reponame: string, options: string[]) {
	var result;
	await git(`${reponame}`)
		.log(options, async (err: Error, log: any) => {
			if (err) {
				console.log(err);
			} else {
				var line = log.all[0].hash;
				result = await formatLogs(line);
			}
		});
	return result;
}

// https://developer.github.com/v3/repos/statistics/#get-the-number-of-additions-and-deletions-per-week

var commitsList = Array<any>();
var xPos = 15;
var columnMax = 0;
var s = Object.create(null);
var a = 9;

/**
 * Inspects all nodes and stablishes their relation in a graph shape
 * @param node 
 */
async function inspectNode(node: any) {
	var iterator = node;
	var listMemo = commitsList;
	if (!node.isPlumbed) {
		var plumbed = void 0;
		if (node.parents && node.parents.length > 0) {
			for (var i = 0; i < node.parents.length; i++) {
				var parent = s[node.parents[i]];
				if (parent && !parent.isPlumbed) {
					0 == i ? plumbed = await inspectNode(parent) : await inspectNode(parent);
					var m = parent.col - node.col;
					var v = parent.row - node.row;
					if (0 === m && (m = i), m >= 0) {
						var b = node.col + m;
					}
					else {
						b = node.col;
					}
					for (var j = 1; v > j; j++) {
						var subnode = listMemo[node.row + j];
						subnode && !subnode.isPlumbed && (subnode.col = b + 1, subnode.x = a + xPos * subnode.col, columnMax = Math.max(subnode.col, columnMax))
					}
				} else {
					0 == i && (plumbed = iterator)
				}
			}
		} else {
			plumbed = iterator
		};
	}
	return node.isPlumbed = !0, plumbed
}

async function filterTagsAndBranches(info: any) {
	function sortResult(t: any) {
		return t.sort().filter((element: any, index: any, arrayRef: any) => {
			return !index || element != arrayRef[index - 1];
		})
	}
	info = info.trim();
	// branches are between parenthesis
	if ("(" === info.charAt(0) && ")" === info.charAt(info.length - 1)) {
		info = info.substr(0, info.length - 1);
	}
	var tags = [];
	var branches = [];
	var infoSplitted = info.split(", ");
	for (let i = 0; i < infoSplitted.length; i++) {
		var infoLine = infoSplitted[i];
		var tagSeparator = "tag: ";
		if (0 == infoLine.indexOf(tagSeparator.length)) {
			tags.push(infoLine.substr(5))
		} else {
			infoLine.indexOf("refs/pull-requests/") >= 0 || branches.push(infoLine);
		}
	}
	return [sortResult(tags), sortResult(branches)]
}

async function formatLogs(data: any) {
	// declara un array vacío en el que se van metiendo los commits listos para representar
	var formatedCommits = commitsList;
	//pilla un commit por fila y los pone en un array
	var logLines = data.trim().split("\n");
	// pinta en el letrero los sha de los comits solamente
	for (var i = 0; i < logLines.length; i++) {
		// define cada linea de commits
		var line = logLines[i];
		// si no está vacía
		if ("" !== line.trim()) {
			line = line.split("|");
			var shaNode = line[0];
			var parents = line[1];
			var object: any = {
				isPlumbed: !1, // sirve para ver si está inspeccionado
				sha1: shaNode, // identificador del commit
				row: formatedCommits.length,
				col: 0,
				parents: undefined,
				tags: undefined,
				branches: undefined
			};
			formatedCommits.push(object);
			s[object.sha1] = object;
			// información adicional
			if (parents) {
				object.parents = line[1].split(" ");
				var extraInfo = line[2];
				if (extraInfo && "" !== extraInfo.trim()) {
					var g = await filterTagsAndBranches(extraInfo.trim());
					object.tags = g[0];
					object.branches = g[1];
				}
			}
			object.committer = line[3];
		}
	}
	// updates the columns with the elements to be painted
	for (let commit = formatedCommits[0], i = 0; i < (commit ? commit.row : formatedCommits.length); i++) {
		object = formatedCommits[i];
		object.col++;
	}

	for (i = 0; i < formatedCommits.length; i++) {
		await inspectNode(formatedCommits[i]);
	}

	var formatedEdges: IEdgeNetworkChart[] = [];
	var formatedNodes: INodeNetworkChart[] = [];
	let height = 0;

	({ formatedNodes, height } = await createNodes(formatedNodes, formatedCommits, height));
	formatedEdges = await createEdges(formatedCommits);

	commitsList = Array<any>();
	const networkChart: INetWorkChart = {
		nodes: formatedNodes,
		edges: formatedEdges,
		height,
		toolTips: [],
	};
	return networkChart;
}

async function createNodes(formatedNodes: INodeNetworkChart[], formatedCommits: any[], height: number) {
	formatedNodes = await formatedCommits.map((iterator) => {
		height += iterator.row * 2;
		const node: INodeNetworkChart = {
			x: iterator.col * 4,
			y: iterator.row * 2,
			id: iterator.sha1,
			size: 10,
			color: '#008cc2',
			parents: iterator.parents,
		};
		return node;
	});
	return { formatedNodes, height };
}

async function createEdges(formatedCommits: any[]) {
	var formatedEdges: IEdgeNetworkChart[] = [];
	await formatedCommits.forEach((iterator) => {
		if (iterator.parents && iterator.parents.length >= 1) {
			iterator.parents.forEach((y: any) => {
				var targetValue = y;
				const edge: IEdgeNetworkChart = {
					id: 'edge' + iterator.sha1 + '-' + y,
					label: 'Edge ',
					source: targetValue,
					target: iterator.sha1,
					size: 5,
					color: '#fffff',
					type: EdgeType.ARROW
				};
				formatedEdges.push(edge);
			});
		}
	});
	return formatedEdges;
}

export default networkChartService as NetworkChartService;