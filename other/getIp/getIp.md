### 最近在项目上需要用到向后端传递ip地址, 由于websockt传输的报文中,并不携带请求的ipv4的地址,因此,我们需要通过js脚本获取到本机的ip地址。注意,这是在可以连接外网的环境下.可以使用。

```
function getIP(callback) {
  const recode = {};
  const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  // 如果不存在则使用一个iframe绕过
  if (!RTCPeerConnection) {
    // const win = iframe.contentWindow;
    // RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
  }

  const pc = new RTCPeerConnection();
  // 匹配字符串中符合ip地址的字段
  function handleCandidate(candidate) {
    const ipregexp = /([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}((:[a-f0-9]{1,4}){7}|:+[a-f0-9]{1,4}){6}))/;
    const ipisMatch = candidate.match(ipregexp)[1];
    if (!recode[ipisMatch]) {
      callback(ipisMatch);
      recode[ipisMatch] = true;
    }
  }

  pc.onicecandidate = ice => {
    if (ice.candidate) {
      handleCandidate(ice.candidate.candidate);
    }
  };
  pc.createDataChannel('');
  pc.createOffer(res => {
    pc.setLocalDescription(res);
  }, () => {});

  setTimeout(() => {
    const lines = pc.localDescription.sdp.split('\n');
    lines.forEach(item => {
      if (item.indexOf('a=candidate:') === 0) {
        handleCandidate(item);
      }
    });
  }, 1000);
}

getIP(ip => {
  console.log(ip);
});

export const getUserIP = onNewIP => {
  const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  const pc = new MyPeerConnection({ iceServers: [] });
  const noop = function () {};
  const localIPs = {};
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
  const key = null;
  
  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  
  pc.createDataChannel('');
  
  pc.createOffer()
    .then(sdp => {
      sdp.sdp.split('\n').forEach(line => {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });
      pc.setLocalDescription(sdp, noop, noop);
    })
    .catch(reason => {});
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
};

getUserIP(ip => {
  showIp(ip);
});

export const showIp = ip => {
  checkIP(ip);
};

export const checkIP = value => {
  const exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  const reg = value.match(exp);
  if (reg === null) {
    return false;
  }
};

```

### 如果在无网的时候, 那么我们可以websocket建立连接的时候，向后端发起一个请求, 后端记录好ip地址。