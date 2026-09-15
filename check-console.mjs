// Script kiểm tra console logs qua Chrome DevTools Protocol
const res = await fetch('http://localhost:9222/json');
const pages = await res.json();
const page = pages.find(p => p.url.includes('5188'));
if (!page) {
  console.log('No page found');
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
  ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
  ws.send(JSON.stringify({ id: 4, method: 'Page.reload' }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Runtime.consoleAPICalled') {
    console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
  }
};

setTimeout(() => {
  ws.close();
  process.exit(0);
}, 3000);
