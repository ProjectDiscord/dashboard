import SoftUI from 'dbd-soft-ui';
import { BaseClient, config } from '@projectdiscord/core';
import DBD from 'discord-dashboard';
import DLU from '@dbd-soft-ui/logs';
import KeyvMysql from '@keyv/mysql';
import 'dotenv/config';

const client = new BaseClient();
client.login(config.client.client_token);

// @ts-expect-error
const Handler = new DBD.Handler({ store: new KeyvMysql(process.env.DATABASE_URL) });

client.on('ready', () => {
	DLU.register(client, {
		dashboard_url: config.dashboard?.domain as string,
		key: config.dashboard!.license,
	});
});

(async () => {
	if (!config.dashboard?.license) {
		throw new Error('Dashboard license missing in config.');
	}
	await DBD.useLicense(config.dashboard.license);
	DBD.Dashboard = DBD.UpdatedClass();

	const Dashboard = new DBD.Dashboard({
		port: config.dashboard?.port,
		client: { id: config.client.client_id, secret: config.client.client_secret },
		redirectUri: `${config.dashboard?.domain}${config.dashboard?.redirectUri}`,
		domain: config.dashboard?.domain,
		ownerIDs: config.dashboard?.ownerIDs,
		acceptPrivacyPolicy: true,
		noCreateServer: false,
		useCategorySet: true,
		invite: {
			clientId: config.client.client_id,
			scopes: ['bot', 'applications.commands'],
			permissions: '139452737783',
			redirectUri: config.dashboard.domain,
			// otherParams: 'test',
		},
		guildAfterAuthorization: {
			use: true,
			guildId: '1396235829579485214',
		},
		minimizedLogs: false,
		rateLimits: {
			manage: {
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 100,
				message: 'Sorry, you are ratelimited!',
				store: null, // <Rate Limiter Store> - if null, new MemoryStore()
			},
		},
		requiredPermissions: [
			DBD.DISCORD_FLAGS.Permissions.ADD_REACTIONS,
			DBD.DISCORD_FLAGS.Permissions.ADMINISTRATOR,
			DBD.DISCORD_FLAGS.Permissions.ATTACH_FILES,
			DBD.DISCORD_FLAGS.Permissions.BAN_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.CHANGE_NICKNAME,
			DBD.DISCORD_FLAGS.Permissions.CONNECT,
			DBD.DISCORD_FLAGS.Permissions.CREATE_INSTANT_INVITE,
			DBD.DISCORD_FLAGS.Permissions.CREATE_PRIVATE_THREADS,
			DBD.DISCORD_FLAGS.Permissions.CREATE_PUBLIC_THREADS,
			DBD.DISCORD_FLAGS.Permissions.DEAFEN_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.EMBED_LINKS,
			DBD.DISCORD_FLAGS.Permissions.KICK_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_CHANNELS,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_EMOJIS_AND_STICKERS,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_EVENTS,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_GUILD,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_MESSAGES,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_NICKNAMES,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_ROLES,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_THREADS,
			DBD.DISCORD_FLAGS.Permissions.MANAGE_WEBHOOKS,
			DBD.DISCORD_FLAGS.Permissions.MENTION_EVERYONE,
			DBD.DISCORD_FLAGS.Permissions.MODERATE_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.MOVE_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.MUTE_MEMBERS,
			DBD.DISCORD_FLAGS.Permissions.PRIORITY_SPEAKER,
			DBD.DISCORD_FLAGS.Permissions.READ_MESSAGE_HISTORY,
			DBD.DISCORD_FLAGS.Permissions.REQUEST_TO_SPEAK,
			DBD.DISCORD_FLAGS.Permissions.SEND_MESSAGES,
			DBD.DISCORD_FLAGS.Permissions.SEND_MESSAGES_IN_THREADS,
			DBD.DISCORD_FLAGS.Permissions.SEND_TTS_MESSAGES,
			DBD.DISCORD_FLAGS.Permissions.SPEAK,
			DBD.DISCORD_FLAGS.Permissions.START_EMBEDDED_ACTIVITIES,
			DBD.DISCORD_FLAGS.Permissions.STREAM,
			DBD.DISCORD_FLAGS.Permissions.USE_APPLICATION_COMMANDS,
			DBD.DISCORD_FLAGS.Permissions.USE_EXTERNAL_EMOJIS,
			DBD.DISCORD_FLAGS.Permissions.USE_EXTERNAL_STICKERS,
			DBD.DISCORD_FLAGS.Permissions.USE_VAD,
			DBD.DISCORD_FLAGS.Permissions.VIEW_AUDIT_LOG,
			DBD.DISCORD_FLAGS.Permissions.VIEW_CHANNEL,
			DBD.DISCORD_FLAGS.Permissions.VIEW_GUILD_INSIGHTS,
		],
		supportServer: {
			slash: '/support',
			inviteUrl: 'https://discord.gg/invite',
		},
		underMaintenanceAccessKey: 'totalsecretkey',
		underMaintenanceAccessPage: '/total-secret-get-access',
		useUnderMaintenance: false,
		underMaintenance: {
			title: 'Under Maintenance',
			contentTitle: 'This page is under maintenance',
			texts: [
				'<br>',
				'We still want to change for the better for you.',
				'Therefore, we are introducing technical updates so that we can allow you to enjoy the quality of our services.',
				'<br>',
				'Come back to us later or join our <a href="#">Discord Support Server</a>',
			],
			bodyBackgroundColors: ['#ffa191', '#ffc247'],
			buildingsColor: '#ff6347',
			craneDivBorderColor: '#ff6347',
			craneArmColor: '#f88f7c',
			craneWeightColor: '#f88f7c',
			outerCraneColor: '#ff6347',
			craneLineColor: '#ff6347',
			craneCabinColor: '#f88f7c',
			craneStandColors: ['#ff6347', '#f29b8b'],
		},
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
								getValue: `${client.guilds.cache.size} Servers`,
							},
							{
								icon: 'fas fa-users',
								getValue: `${client.users.cache.size} Users`,
								progressBar: {
									enabled: true,
									getProgress: Math.min((client.users.cache.size / 1000) * 100, 100),
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
			themeColors: {
				primaryColor: '#ff0000',
				secondaryColor: '#ff0000',
			},
			supporteMail: config.dashboard?.supportMail!,
			icons: {
				// @ts-expect-error
				backgroundImage: 'https://www.imageshine.in/uploads/gallery/geometric-Blue-Wallpaper-Free-Download.jpg',
				favicon: 'https://github.com/ProjectDiscord.png',
				noGuildIcon: 'https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png',
				sidebar: {
					darkUrl: 'https://github.com/ProjectDiscord.png',
					lightUrl: 'https://github.com/ProjectDiscord.png',
					hideName: false,
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
				errors: {
					requirePremium: 'You need to be a premium member to do this.',
				},
				success: {
					login: 'Successfully logged in.',
				},
			},
			preloader: {
				image: '/img/soft-ui.webp',
				spinner: false,
				text: 'Page is loading',
			},
			addons: ['@softui'],
			locales: {},
			footer: {
				replaceDefault: true,
				text: 'Bot Template by ProjectDiscord',
			},
			admin: {
				pterodactyl: {
					enabled: false,
					apiKey: '',
					panelLink: '',
					serverUUIDs: [],
				},
				logs: {
					enabled: false,
					key: 'place your key here!',
				},
			},
			premium: {
				enabled: true,
				card: {
					title: 'Want more from ProjectDiscord?',
					description: 'Check out premium features below!',
					bgImage: 'https://github.com/projectdiscord.png',
					button: {
						text: 'Become Premium',
						url: 'https://github.com/projectdiscord',
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
					title: 'Error 404',
					subtitle: 'Page Not Found',
					description: 'It seems you have stumbled into the abyss. Click the button below to return to the dashboard',
				},
				dbdError: {
					disableSecretMenu: false,
					secretMenuCombination: ['69', '82', '82', '79', '82'],
				},
			},
			blacklisted: {
				title: 'Blacklisted',
				subtitle: 'Access denied',
				description: 'Unfortunately it seems that you have been blacklisted from the dashboard.',
				button: {
					enabled: false,
					text: 'Return',
					link: 'https://google.com',
				},
			},
			storage: Handler,
		}),
		settings: [],
	});

	Dashboard.init();
})();
