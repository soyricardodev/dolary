const paralelo = {
	name: "paralelo",
	url: "https://exchangemonitor.net/estadisticas/ve/dolar-enparalelovzla",
	sources: [
		{
			name: "usd",
			selector: "div.row.inicio > div.col.texto > h2",
		},
	],
};

const bcv = {
	origin: "bcv",
	url: "https://bcv.org.ve",
	sources: [
		{
			name: "usd",
			selector: "#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong",
		},
		{
			name: "eur",
			selector: "#euro > div > div > div.col-sm-6.col-xs-6.centrado > strong",
		},
		{
			name: "yuan",
			selector: "#yuan > div > div > div.col-sm-6.col-xs-6.centrado > strong",
		},
		{
			name: "lira",
			selector: "#lira > div > div > div.col-sm-6.col-xs-6.centrado > strong",
		},
		{
			name: "rublo",
			selector: "#rublo > div > div > div.col-sm-6.col-xs-6.centrado > strong",
		},
	],
};

export { paralelo, bcv };
