class WyrePmWidget {

	constructor(params) {
		if(!params)
			params = {};
		this.params = params;

		$.get(this.getBaseUrl()+"/v2/client/config/plaid")
			.then(function(config){
				this.handler = Plaid.create({
					env: config.plaidEnvironment,
					key: config.plaidPublicKey,
					token: params.reconnectToken,
					product: config.plaidProducts,
					webhook: config.plaidWebhook,
					onSuccess: function(public_token, metadata) {
						var publicToken = public_token + "|" + metadata.account_id;

						if(this.params.onSuccess)
							this.params.onSuccess({
								publicToken: publicToken
							});
					}.bind(this),
					onExit: function(err) {
						if(this.params.onExit)
							this.params.onExit(err);
					}.bind(this)
				});

				if(this.params.onLoad)
					this.params.onLoad();

			}.bind(this))
	}

	open() {
		if(!this.handler){
			console.warn("WYRE - Module not fully initialized");
			return;
		}

		this.handler.open();
	}

	getBaseUrl() {
		switch (this.params.env) {
			case "test":
				return "https://api.testwyre.com";
			case "staging":
				return "https://api-staging.i.sendwyre.com";
			case "local":
				return "http://localhost:8080";
			case "production":
			default:
				return "https://api.sendwyre.com";
		}
	}
}

module.exports = WyrePmWidget;
