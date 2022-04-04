var Twit = require('twit');
var T = new Twit({
  consumer_key:         /*twitter consumer key(from twitter developer portal)*/'',
  consumer_secret:      /*twitter consumer_secret key*/'',
  access_token:         /*twitter access_token*/'',
  access_token_secret:  /*twitter access_token_secret*/'',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

const { Client } = require('tmi.js');
const tmi = require('tmi.js')
const twitchChannel = /*broadcaster NAME*/''
const client = new tmi.Client({
    options: { debug: true},
     identity: {
         username: /*twitch BOT account name*/'',
         password: /*twitch BOT oauth code*/''
    },
        channels: [twitchChannel]
    });

client.connect();

let commandName, id_str = '';
var post = '';
client.on('message', (channel, tags, message, self) => {
    if(blackList(channel, tags, message.toLowerCase()) || self){
        return;
    }
    //finds the command
    commandName = message.split(' ');
    let command = commandName[0];
    
    for(var i = 1; i < commandName.length; i++){
        post += commandName[i] + ' ';
    }
    console.log(post);
    switch (command.toLowerCase()){
        case ('!tweet'):
            tweet(channel, tags, post);
            break;
        case('!deltweet'):
            if(`${tags.mod}`){
                delTweet(channel, tags, post);
            }else{
                client.say(channel, 'You do not have permission to delete tweets!');
            }
            break;
        case ('!dellasttweet'):
            if(`${tags.mod}`){
                delLastTweet(channel, tags);
            }else{
                client.say(channel, 'You do not have permission to delete tweets!');
            }
            break;
        case ('!clear'):
            if(`${tags.mod}`){
                client.clear(channel);
            }else{
                client.say(channel, 'You do not have permission to clear chat!');
            }
            break;
        default:
            if(command.charAt(0) === '!'){
                client.say(channel, `${tags.username} the command you input not exist!`);
            }else{
                break;
            }
    }
});



function tweet(channel, tags, message){
    post += "\n\n" + 'This message was tweeted by ' + `${tags.username}` + ' at https://www.twitch.tv' + twitchChannel;
    T.post('statuses/update', { status: post }, function(err, data, response) {
        id_str = data.id_str;
        client.say(channel, 'The id for post of ' + `@${tags.username}` + ' is ' + id_str);
    })
}

function delTweet(channel, tags, message){
    T.post('statuses/destroy/:id', { id: message }, function(err, data, response){
        client.say(channel, 'Post ' + /*id of twitter post ->*/id_str + ' was deleted by ' + `@${tags.username}`);
    })
}

function delLastTweet(channel, tags){
    T.post('statuses/destroy/:id', { id: id_str }, function(err, data, response){
        client.say(channel, 'Post ' + /*id of twitter post ->*/id_str + ' was deleted by ' + `@${tags.username}`);
    })
}

function blackList(channel, tags, message){
    const regexp = /*put blacklisted terms separated by |*// /;
    if(regexp.test(message)){
        client.say(channel, `@${tags.username}, A term you tweeted was blacklisted!`);
        client.timeout(channel, `@${tags.username}`, 300, 'Tried tweeting a blacklisted term!');
        return true;
    }else{
       return false;
    }
}