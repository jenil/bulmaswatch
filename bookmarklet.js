var request = new XMLHttpRequest();
request.open("GET", "https://jenil.github.io/bulmaswatch/api/themes.json", true);
request.onreadystatechange = function() {
  var done = 4,
    ok = 200;
  if (request.readyState == done && request.status == ok) {
    if (request.responseText) {
      var BS = JSON.parse(request.responseText);
      console.log('bulmaswatch', BS.version);
      var themes = BS.themes;
      var select = '<span class="select" id="theme-switcher"><select>';
      select += '<option value="default" selected="">Select theme</option>';
      for (var i = 0; i < themes.length; i++) {
        select += '<option value="' + themes[i].css + '">' + themes[i].name + '</option>'
      }
      select += '</select></span>';
      var temp = document.createElement('div');
      temp.innerHTML = select;
      document.body.appendChild(temp.firstChild);
      document.querySelector('#theme-switcher').style = 'position:fixed;top:0;right:0;z-index:9900';
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "";
      l.id = 'bulmaswatch-css';
      document.body.appendChild(l);
      document.querySelector('#theme-switcher select').addEventListener("change", function() {
        l.href = this.value;
      });
    }
  }
};
request.send(null);
