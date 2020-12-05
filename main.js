const fb = {
  api: 'https://graph.facebook.com',
  url: 'https://www.facebook.com',
  //page: '103302041643161',
  page: '102384434848358',
  //token: 'EAARoMWBeX1EBAMaJrVTK8j52WzL34WVMGyDUkZBUP2NLRqtYJpPALYFGtgnFW8bZCNocpxSZBzKsEZCYu04UZAGST2AfSOLCzgRGXNDdnNBas1bssOJ213fpaIA08O4O8oYZCuyw7nzt5MT9OQUOso7029kZBtSYCYxEfMepld9xKqGcT69ZC4eHDUGgCVZC2J24ZD',
  token: 'EAALdQZAjSYXkBAKgSfZB9WyXQFsfKKq6vZBr1htZC8vS1Xryp4oWN4oAT0Js6KpZBKiouVLSAElDQfoaUKaCs2Djv1QQJ2bL7lKjeZCXPJDELjDIEAZBGzBGZBcN0MhRVjKXT4BzZCcNM3XTUQeEDwzcCtZCst3zp2x3uOZBxT1L5OAr0cDnMXTvBbw3cdcMVzNw8BaDpJXUj8302K6wazVhMHs',
  
  getApi(path, fields) {
    var url = new URL(this.api);
    url.pathname = (typeof path == 'string') ? path : path.join('/');
    // url.searchParams.append('access_token', this.token);
    if (fields) {
      //if ('length' in fields) url.searchParams.append('fields', fields.join(','));
     // else
    // if(typeof fields == 'object') Object.keys(fields).forEach(key => url.searchParams.append(key, encodeURIComponent(fields[key] || 'false')))
      url.search = fields + '&access_token=' + this.token;
    }
    return url;
  },

  getUrl(...path) {
    return [this.url, ...path].join('/');
  },

  getPostUrl(id) {
    return `${this.url}/${id}`;
  },

  getPhotoUrl(id) {
    return this.getUrl('photos');
  }
}

const view = {
  post: document.querySelector('template#post').innerHTML,
  photo: document.querySelector('template#photo').innerHTML,
};

const nf = {
  el: document.querySelector('#newsfeed'),

  posts: [],

  photos: [],

  addPost({ id, message, message_tags, created_time, full_picture }) {
    if (!message) return;
    var msg = message;
    var el = document.createElement('div');
    var dt = new Date(created_time);
    var [page_id, post_id] = id.split('_');
    
    msg = msg.split("\n").slice(0, 4).join('<br>');
    /*
    if (message_tags && message_tags.length) {
      message_tags.map(({ id, name, offset, length }) => {
        var before = msg.substr(0, offset);
        var after = msg.substr(offset + length);
        var tag = '<a class="font-bold text-blue-600 hover:text-blue-400 hover:underline transition duration-400 ease-in-out" href="' + fb.getUrl(id) + '" target="_blank">' + name + '</a>';
        msg = before + tag + after;
      });
    }
    */
    el.className = 'pb-4 pt-2';
    el.innerHTML = view.post
      .replace(/\{id\}/g, id)
      .replace(/\{body\}/g, msg)
      .replace(/\{href\}/g, fb.getUrl(id))
      .replace(/\{date\}/g, dt.toDateString())
      .replace(/\{time\}/g, dt.toTimeString())
      .replace(/\{published}/g, dt.toLocaleString())
      .replace(/\{photo\}/g, full_picture);

    this.el.appendChild(el);
  },

  addPhoto(photo) {
    
  }
};

var fields = [
  'id',
  'created_time',
  'updated_time',
  'message',
  'message_tags',
  'picture',
  'full_picture'
];

var params = {
  fields: fields.join(','),
  '{attachments}': ''
}


var url = fb.getApi(['me'], 'fields=feed.limit(100){child_attachments,created_time,full_picture,id,message,message_tags,picture,story,story_tags,status_type,permalink_url}');

fetch(url)
  .then(res => res.json())
  .then(page => {
    page.feed.data.forEach(post => 
      nf.addPost(post));
  });

/*
fetch(fb.getApi([fb.page, 'photos'], fields))
  .then(res => res.json())
  .then(res => res.data)
  .then(photos => photos.forEach(photo => {
    console.log(photo);
  }));
  
  */
