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
var e = 15;
var d = 0;
var s = Object.create(null);
var a = 9;

// TODO: limpiar código
async function inspectNode(n: any) {
	var i = n;
	var h = commitsList;
	if (!n.isPlumbed) {
		var u = void 0;
		if (n.parents && n.parents.length > 0) {
			for (var r = 0; r < n.parents.length; r++) {
				var l = s[n.parents[r]];
				if (l && !l.isPlumbed) {
					0 == r ? u = await inspectNode(l) : await inspectNode(l);
					var m = l.col - n.col;
					var v = l.row - n.row;
					if (0 === m && (m = r), m >= 0) {
						var b = n.col + m;
					}
					else {
						b = n.col;
					}
					for (var f = 1; v > f; f++) {
						var c = h[n.row + f];
						c && !c.isPlumbed && (c.col = b + 1, c.x = a + e * c.col, d = Math.max(c.col, d))
					}
				} else {
					0 == r && (u = i)
				}
			}
		} else {
			u = i
		};
	}
	return n.isPlumbed = !0, u
}

async function filterTagsAndBranches(info: any) {
	function sortResult(t: any) {
		return t.sort().filter((element: any, index: any, arrayRef: any) => {
			return !index || element != arrayRef[index - 1];
		})
	}
	info = info.trim();
	// las ramas van entre parentesis
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

// TODO: meter await a cada puto for
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
	// actualiza las columnas de los elementos a pintar
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