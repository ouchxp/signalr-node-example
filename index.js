const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
const $ = require('jquery')(window);
window.jQuery = $;
global.window = window;
require('signalr');

const connection = $.hubConnection('http://localhost:8080');
const proxy = connection.createHubProxy('eventHubLocal');
// connection.qs = ?
proxy.on('liveEvent', event => {
    console.log('liveEvent', JSON.stringify(event))
});

connection.error(function (error) {
    console.log('SignalR error: ' + error)
});
connection.logging = true;
connection.start().then(data =>{
    console.log('connected');
    console.log(proxy)

    proxy.invoke('subscribeToLiveEvents', {})
        .done(() => {
            console.log('Subscribed to live events');
        })
        .fail((e) => {
            console.warn(e);
        });
}).catch(e => console.warn(e));
