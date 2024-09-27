import {
    APIMessage,
    APIUser,
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    Guild,
    Message,
    Options,
    TextChannel,
    User,
} from 'discord.js';

import { EventDataService } from '../src/services/event-data-service.js';
import '../src/models/dotenv.js';

export class DiscordMock {
    public client: Client;
    public user: User;
    public message: Message;
    public eventDataService: EventDataService;
    public chatInputCommandInteraction: ChatInputCommandInteraction;
    public guild: Guild;
    public textChannel: TextChannel;

    constructor() {
        this.mockClient();
        this.mockUser();
        this.mockMessage();
        this.mockEventDataService();
        this.mockChatInputCommandInteraction();
        this.mockGuild();
        this.mockTextChannel();
    }

    private mockClient(): void {
        this.client = new Client({
            intents: [],
            // necessary for this.mockTextChannel
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
            }),
        });
    }

    private mockUser(): void {
        this.user = Reflect.construct(User, [
            this.client,
            {
                id: '1',
                username: 'username',
            } as APIUser,
        ]);
    }

    public mockMessage(content: string = ''): void {
        this.message = Reflect.construct(Message<true>, [
            this.client,
            {
                id: '1',
                channel_id: '1',
                author: this.user as unknown as APIUser,
                content,
            } as APIMessage,
        ]);
    }

    private mockEventDataService(): void {
        this.eventDataService = new EventDataService();
    }

    private mockChatInputCommandInteraction(): void {
        this.chatInputCommandInteraction = Reflect.construct(ChatInputCommandInteraction, [
            this.client,
            {
                user: this.user,
                data: { id: '1' },
            },
        ]);
    }

    private mockGuild(): void {
        this.guild = Reflect.construct(Guild, [this.client, {}]);
    }

    private mockTextChannel(): void {
        this.textChannel = Reflect.construct(TextChannel, [
            this.guild,
            { type: ChannelType.GuildText },
            this.client,
        ]);
    }
}
