const deployStatus = [
	{
		status: "created",
		title: "Created",
		icon: "process",
		description: "The bot has just been created and is waiting for orchestration",
		message: "Bot has been created and awaiting",
	},
	{
		status: "pending",
		title: "Pending",
		icon: "process",
		description: "The orchestration has noticed and started the creation process",
		message: "Bot is waiting",
	},
	{
		status: "deploying",
		title: "Deploying",
		icon: "process",
		description: "The salt cloud deployment is in progress",
		message: "Approximately 2 minutes",
	},
	{
		status: "installing-system-updates",
		title: "Installing System Updates",
		icon: "process",
		description: "Making sure the system is up to date, updating packages, removing unnecessary packages to minimize potential security issues",
		message: "Approximately 1 minute",
	},
	{
		status: "configuring-system-settings",
		title: "Configuring System Settings",
		icon: "process",
		description: "Configuring system security and settings, setting server timezone",
		message: "Approximately less than a minute",
	},
	{
		status: "installing-nodejs-nginx",
		title: "Installing Node.js and nginx",
		icon: "process",
		description: "Installing nginx and Node.js",
		message: "Approximately less than a minute",
	},
	{
		status: "installing-firewall",
		title: "Installing Firewall",
		icon: "process",
		description: "Making sure the firewall is installed and starting its service, setting allowed ports to public zone, blocking ping",
		message: "Approximately less than a minute",
	},
	{
		status: "installing-mongodb",
		title: "Installing mongoDB",
		icon: "process",
		description: "Installing MongoDB, creating databases and users, creating admin user, setting authentication",
		message: "Approximately less than a minute",
	},
	{
		status: "installing-rasa",
		title: "Installing Rasa",
		icon: "process",
		description: "Installing Rasa",
		message: "Approximately 3 minutes",
	},
	{
		status: "installing-botfront",
		title: "Installing botfront",
		icon: "process",
		description: "Installing Botfront and importing Botfront database template",
		message: "Approximately 1.5 minutes",
	},
	{
		status: "configuring-ssh-port",
		title: "Configuring SSH port",
		icon: "process",
		description: "Set custom SSH port",
		message: "Approximately less than a minute",
	},
	{
		status: "deployed",
		title: "Deployed",
		icon: "finish",
		description: "The bot has been deployed",
		message: "Bot has been deployed",
	},
];

const errorStatus = [
	{
		status: "errored",
		title: "Failed",
		icon: "error",
		description: "The server deployment went catastrophically wrong and will not be retried. Contact support.",
		message: "Bot creation has failed",
	}
];

const removeStatus = [
	{
		status: "removing",
		title: "Removing",
		icon: "error",
		description: "The bot has been flagged for deletion waiting for orchestration",
		message: "Waiting for orchestration to remove the bot",
	}
];

const statuses = {
	deployStatus,
	errorStatus,
	removeStatus,
};

export default statuses;
