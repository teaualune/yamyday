

var removeRightCol = function () {

	var newsGroup = {
            yahoo: 'tw.news.yahoo.com',
            yahooSport: 'tw.sports.yahoo',
            ettoday: 'www.ettoday.net/news/',
            nownews: 'www.nownews.com/n/',
            udn: 'udn.com/NEWS/',
            cna: 'www.cna.com.tw/news/',
            chinatimes: '.chinatimes.com/',
    };

    var matchNews = function (link) {
	    var matched = null,
	        n;
		    if (link) {
		        for (n in newsGroup) {
		            if (newsGroup.hasOwnProperty(n) && link.indexOf(newsGroup[n]) >= 0) {
		                matched = n;
		                break;
		            }
		        }
		    }
		    return matched;
	};

    var urlTag = document.getElementsByClassName('_1xw shareLink _1y0');
    console.log(urlTag);
    for (var i = 0; i < urlTag.length; i++){
    	console.log(matchNews(urlTag[i].href));
    	if (matchNews(urlTag[i].href)) {
    		var myButton = document.createElement("input");
    		myButton.type = "image";
            myButton.src = chrome.extension.getURL("/icon-48.png");
			myButton.onclick=function(){
					window.open('http://127.0.0.1:3000/');
  				};
			urlTag[i].parentNode.appendChild(myButton);
    	};
    }

};



document.addEventListener('DOMNodeInsertedIntoDocument', removeRightCol);

removeRightCol();