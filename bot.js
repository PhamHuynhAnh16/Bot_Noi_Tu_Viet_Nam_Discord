require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ]
})

let cụm_từ_trước_đó = '';
let người_dùng_trước_đó = '';
let cụm_từ_đã_dùng = []

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    const nội_dung = message.content.trim().toLowerCase();
    const từ = nội_dung.split(' ');
    
    if (từ[0] === '!add') 
    {
        if (từ.length === 3)
        {
            let ids = fs.readFileSync('TuVung.txt', 'utf8').split('\n');
            const thêm = `${từ[1]} ${từ[2]}`
            if (!ids.includes(thêm)) 
            {
                ids.push(thêm); 
                fs.writeFileSync('TuVung.txt', ids.join('\n')); 
    
                await message.reply(`Đã thêm từ: ${thêm}`);
            }
            else return await message.reply(`Từ ${thêm} đã có trong từ điển`);    
        }
    } 

    if (message.content.toLowerCase() === '!reset')
    {
        if (message.user.id === process.env.AUTHOR) return message.reply("Chỉ có Author mới có thể thêm từ");
        cụm_từ_trước_đó = '';
        người_dùng_trước_đó = '';
        cụm_từ_đã_dùng = [];
        return message.reply('Đã đặt lại trò chơi');
    }

    if (từ.length !== 2) return;

    const cụm_từ = `${từ[0]} ${từ[1]}`;

    if (cụm_từ_đã_dùng.includes(cụm_từ))
    {
        await message.react('❌');
        return message.reply(`Cụm Từ \`${cụm_từ}\` Đã Được Sử Dụng.`);
    }

    if (cụm_từ_đã_dùng.length >= process.env.MAX_WORD)
    {
        cụm_từ_trước_đó = '';
        người_dùng_trước_đó = '';
        cụm_từ_đã_dùng = [];

        await message.react('❌');
        return message.reply('Giới Hạn Từ Đã Đạt Đến Mức Tối Đa Và Dữ Liệu Đã Được Đặt Lại.');
        
    }

    if (!cụm_từ_trước_đó) return xử_lý_cụm_từ_đầu_tiên(message, cụm_từ);
    else return xử_lý_cụm_từ_tiếp_theo(message, cụm_từ, từ);
});

const kiểm_tra_từ_tồn_tại = require('./kiểm_tra_từ_tồn_tại.js');

async function xử_lý_cụm_từ_đầu_tiên(message, cụm_từ) 
{
    if (!kiểm_tra_từ_tồn_tại(cụm_từ)) 
    {
        await message.react('❌');
        return message.reply(`Cụm Từ \`${cụm_từ}\` Không Tồn Tại Trong Từ Điển Của Bot!`);
    }

    await message.react('✅');
    cụm_từ_trước_đó = cụm_từ;
    người_dùng_trước_đó = message.author.id;
    cụm_từ_đã_dùng.push(cụm_từ);
}

async function xử_lý_cụm_từ_tiếp_theo(message, cụm_từ, từ) 
{
    if (message.author.id === người_dùng_trước_đó) 
    {
        await message.react('❌');
        return message.reply('Bạn Chỉ Được Nói Một Lần Mỗi Lượt.');
    }

    const từ_thứ_hai_trước_đó = cụm_từ_trước_đó.split(' ')[1];

    if (từ[0] !== từ_thứ_hai_trước_đó) 
    {
        await message.react('❌');
        return message.reply(`Từ Của Bạn Phải Bắt Đầu Bằng Từ \`${từ_thứ_hai_trước_đó}\``);
    }

    if (!kiểm_tra_từ_tồn_tại(cụm_từ)) 
    {
        await message.react('❌');
        return message.reply(`Cụm Từ \`${cụm_từ}\` Không Tồn Tại Trong Từ Điển Của Bot!`);
    }

    await message.react('✅');
    cụm_từ_trước_đó = cụm_từ;
    người_dùng_trước_đó = message.author.id;
    cụm_từ_đã_dùng.push(cụm_từ);
}

client.on('ready', () => console.log(`${client.user.tag} đã hoạt động`));
client.login(process.env.TOKEN);
