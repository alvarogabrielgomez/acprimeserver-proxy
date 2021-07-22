const dns = require('dns').promises;

const reverseDNSLookup = function reverseDNSLookup(ip) {
	return new Promise(async (resolve, reject) => {
		try {
			const domains  = await dns.reverse(ip);
			const list = []
	
			for await (const domain of domains) {
				const lookup = await dns.lookup(domain);
				list.push({domain, lookup});
			}
			resolve(list);
		} catch (e) {
			reject(e);
		}
	})
};

const searchProxy = function searchProxy(proxyList, hostRequest) {
	return new Promise(async (resolve, reject) => {
		let target;
		for await (const proxyItem of proxyList) {
			if (proxyItem.origen === hostRequest) {
				target = {
					url: new URL(proxyItem.target),
					name: proxyItem.name
				}
				break;	
			}
		};

		resolve(target);
	});
}


module.exports = {
	reverseDNSLookup,
	searchProxy
}