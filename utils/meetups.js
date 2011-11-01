var jsdom = require('jsdom')
  , fs = require('fs')
;

var website = fs.readFileSync(__dirname + '/../index.html', 'utf8');

jsdom.env(website, [
  'http://code.jquery.com/jquery-1.5.min.js'
],
function(errors, window) {
  var $ = window.$;
          parseMeetups($);
});

function parseMeetups($) {
    var $meetups = $('#meetups li.meetup');
    var meetups = [];
    $meetups.each(function() {
        var $meetup = $(this);
        var meetup = {
            title: $(this).text(),
            talks: []
        };
        var $talks = $meetup.next('.meetup-content').find('> ul');
        meetup.talks = parseTalks($, $talks);
        meetups.push(meetup);
    });
    console.log(JSON.stringify(meetups));
}

function parseTalks($, $talks) {
    return $talks.toArray().map(function(talk) {
        var $talk = $(talk);
        return {
            title: $talk.find('.titleTalk').text().trim(),
            slides: $talk.find('.descTalk a:first').attr('href'),
            video: $talk.find('.descTalk a:eq(1)').attr('href'),
            avatar: $talk.find('.avatar img').attr('src'),
            authors: $talk.find('.authorTalk a').map(function() {
                return {
                    name: $(this).text(),
                    url: $(this).attr('href')
                }
            }).toArray()
        }
    });
}
  
;