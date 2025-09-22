import SoftUI from 'dbd-soft-ui';
import { BaseClient, config } from '@projectdiscord/core';
import DBD from 'discord-dashboard';
import KeyvMysql from '@keyv/mysql';

const client = new BaseClient();
client.login(config.client.client_token);

// @ts-expect-error
const Handler = new DBD.Handler({ store: new KeyvMysql(process.env.DATABASE_URL) });

(async () => {
	await DBD.useLicense(config.dashboard!.license);
	DBD.Dashboard = DBD.UpdatedClass();

	const Dashboard = new DBD.Dashboard({
		port: 80,
		client: { id: config.client.client_id, secret: config.client.client_secret },
		redirectUri: `${config.dashboard?.domain}${config.dashboard?.redirectUri}`,
		domain: config.dashboard?.domain,
		ownerIDs: config.dashboard?.ownerIDs,
		useThemeMaintenance: true,
		useTheme: true,
		bot: client,
		useTheme404: true,
		theme: SoftUI({
			customThemeOptions: {
				index: async ({ req, res, config }) => {
					return {
						cards: [
							{
								icon: 'fas fa-server',
								getValue: 'Server Online',
							},
							{
								icon: 'fas fa-users',
								getValue: '123 Players',
								progressBar: {
									enabled: true,
									getProgress: 60,
								},
							},
						],
						graph: {
							values: [30, 40, 50, 70],
							labels: ['10s', '20s', '30s', '40s'],
						},
					};
				},
			},
			websiteName: config.dashboard?.websiteName!,
			colorScheme: config.dashboard?.colorScheme!,
			supporteMail: config.dashboard?.supportMail!,
			icons: {
				favicon: 'https://assistantscenter.com/wp-content/uploads/2021/11/cropped-cropped-logov6.png',
				noGuildIcon: 'https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png',
				sidebar: {
					darkUrl: 'https://assistantscenter.com/img/logo.png',
					lightUrl: 'https://assistanscenter.com/img/logo.png',
					hideName: true,
					borderRadius: false,
					alignCenter: true,
				},
			},
			index: {
				graph: {
					enabled: true,
					lineGraph: false,
					tag: 'Memory (MB)',
					max: 100,
				},
			},
			sweetalert: {
				errors: { requirePremium: 'false' },
				success: { login: 'Successfully logged in.' },
			},
			preloader: {
				image: '/img/soft-ui.webp',
				spinner: false,
				text: 'Page is loading',
			},
			addons: [],
			locales: {},
			footer: {
				text: 'text',
				replaceDefault: false,
			},
			admin: {
				pterodactyl: {
					enabled: false,
					apiKey: '',
					panelLink: '',
					serverUUIDs: [],
				},
				logs: undefined,
			},
			premium: {
				enabled: false,
				card: {
					title: '',
					description: '',
					bgImage: '',
					button: {
						text: '',
						url: '',
					},
				},
			},
			meta: {
				author: 'ProjectDiscord',
				owner: 'ProjectDiscord',
				description: 'smh its a bot template',
				ogLocale: 'en_US',
				ogTitle: 'ProjectDiscord Bot Dashboard',
				ogImage: '',
				ogType: 'website',
				ogUrl: config.dashboard?.domain || '',
				ogSiteName: 'ProjectDiscord Dashboard',
				ogDescription: 'smh its a bot template',
				twitterTitle: 'ProjectDiscord Bot Dashboard',
				twitterDescription: 'smh its a bot template',
				twitterDomain: config.dashboard?.domain || '',
				twitterUrl: config.dashboard?.domain || '',
				twitterCard: 'summary',
				twitterSite: '@projectdiscord',
				twitterSiteId: '',
				twitterCreator: '@projectdiscord',
				twitterCreatorId: '',
				twitterImage: '',
			},

			error: {
				error404: {
					title: '404 - Page Not Found',
					subtitle: 'Oops!',
					description: 'The page you were looking for does not exist. smh its a bot template.',
				},
				dbdError: {
					disableSecretMenu: false,
					secretMenuCombination: [],
				},
			},
			blacklisted: {
				title: '',
				subtitle: '',
				description: '',
				button: {
					enabled: false,
					text: '',
					link: '',
				},
			},
		}),
		settings: [],
		storage: Handler, // ✅ Move it here
	});

	Dashboard.init();
})();
