import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import PieChartContributionsVM from '../../../models/PieChartContributionsVM';
import User from '../../../models/User';
import UserRepoStats from '../../../models/UserRepoStats';
import ChartService from '../ChartServiceGApi';

const ChartService: ChartService = {
	getStatsOfUser: (token, reponame) => {
		const p1 = getContributorsByRepoName(token, reponame);
		const p2 = getStatsOfRepoAndContributors(token, reponame);
		return Promise.all([p1, p2])
			.then(
				(result) => {
					return popullateStatsChartVM(result[0], result[1]);
				});
	},
	// TODO: limpiar código
	getNetworkChartData: (token: string, reponame: string, username: string): any => {
		// no se necesita porque uso una copia en local
		const USER = username;
		const REPO = reponame;
		var token = token;
		// revisar el path a los ficheros
		//const reponame = `${USER}/${REPO}`;
		const URL = `github.com/${reponame}`;

		const git = require('simple-git');
		const gitPromise = require('simple-git/promise');
		const remote = `https://${URL}`;
		const fs = require('fs')

		// encadenar promises con Promises.all
		if (fs.existsSync(reponame)) {
			gitPromise(reponame).silent(false)
				.pull(remote)
				.then(() => console.log("finished"))
				.then(() => {
					var options = ['--all', '--date-order', '--pretty=%h|%p|%d|%an', '-n 30'];
					git(`./${reponame}`)
						.log(options, (err: Error, log: any) => {
							if (err) {
								console.log(err);
							} else {
								log.all.map((logLine: any) => {
									var line = logLine.hash;
									console.log(line);
									formatLogs(line);
								});
							}
						});
				})
				.then((result: any) => console.log(result))
				.catch((err: Error) => console.error('failed: ', err));
		} else {
			gitPromise().silent(false)
				.clone(remote, reponame)
				.then(() => console.log("finished"))
				.then(() => {
					var options = ['--all', '--date-order', '--pretty=%h|%p|%d|%an', '-n 30'];
					git(`./${reponame}`)
						.log(options, (err: Error, log: any) => {
							if (err) {
								console.log(err);
							} else {
								log.all.map((logLine: any) => {
									var line = logLine.hash;
									console.log(line);
									return formatLogs(line);
								});
							}
						});
				})
				.then((result: any) => console.log(result))
				.catch((err: Error) => console.error('failed: ', err));
		}
	}
};

const getContributorsByRepoNamePromise = (token: string, reponame: string): Promise<any> => {
	return superagent
		.get(`https://api.github.com/repos/${reponame}/contributors`)
		.set('Authorization', `token ${token}`);
};

const getStatsOfRepoAndContributorsPromise = (token: string, reponame: string): Promise<any> => {
	return superagent
		.get(`https://api.github.com/repos/${reponame}/stats/contributors`)
		.set('Authorization', `token ${token}`)
}

const getContributorsByRepoName = (token: string, reponame: string): Promise<Array<User>> => {
	return getContributorsByRepoNamePromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cant get access to the repository', err);
			return null;
		})
		.then((result: any) => {
			const contributorsGithub = result.body;
			const contributors: Array<User> = contributorsGithub.map((x: any) => {
				const user: User = {
					login: x.login,
					id: x.id,
					avatar_url: x.avatar_url,
					contributions: x.contributions,
					type: x.type,
					site_admin: x.site_admin,
				};
				return user;
			});
			return contributors;
		});
};

const getStatsOfRepoAndContributors = (token: string, reponame: string): Promise<Array<UserRepoStats>> => {
	return getStatsOfRepoAndContributorsPromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cannot get stats', err);
		})
		.then((result: any) => {
			const arr = result.body;
			return arr as Array<UserRepoStats>;
		});
};

async function popullateStatsChartVM(final: Array<User>, arr: Array<UserRepoStats>) {
	const total: Array<PieChartContributionsVM> = Array<PieChartContributionsVM>();
	if (arr && final) {
		final.forEach((i: any) => {
			arr.forEach((j: any) => {
				// a -> added c -> commits d -> deleted
				const statsReduced: UserRepoStats = j.weeks.reduce((anterior: any, actual: any) => {
					return {
						a: anterior.a + actual.a,
						c: anterior.c + actual.c,
						d: anterior.d + actual.d,
					};
				});
				if (i.login === j.author.login) {
					const contribution: PieChartContributionsVM = {
						avatar_url: i.avatar_url,
						contributions: i.contributions,
						login: i.login,
						modifications: statsReduced,
						total: j.total,
					};
					total.push(contribution);
				}
			});
		});
		return total;
	} else {
		return total;
	}
}
// more charts
// https://developer.github.com/v3/repos/statistics/#get-the-number-of-additions-and-deletions-per-week


// TODO: PASAR A SINCRONO
var commitsList = Array<any>();

var e = 15;
var d = 0;
var s = Object.create(null);
var a = 9;

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
		inspectNode(formatedCommits[i]);
	}

	var formatedEdges = <any>[];
	formatedCommits.forEach((x) => {
		if (x.parents && x.parents.length >= 1) {
			x.parents.forEach((y: any) => {
				var targetValue = y;
				formatedEdges.push({
					id: 'edge' + x.sha1 + '-' + y,
					label: 'Edge ',
					source: targetValue,
					target: x.sha1,
					size: 5,
					color: '#008cc2',
					type: 'curvedArrow'
				});
			});
		}
	});
	return {
		nodes: formatedCommits.map((x) => {
			return {
				x: x.col,
				y: x.row,
				id: x.sha1,
				label: x.sha1 + '-' + x.committer,
				size: 0.5, color: '#008cc2'
			}
		}), edges: formatedEdges,
	};
}
export default ChartService;