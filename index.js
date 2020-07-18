
options = {
  link: 'a',
  activeMenuClass: '.current_page_item',
  elsMoving: '[data-pjax-main] > section',
  elsNotMoving: ['header', 'footer']
}



exports.pjaxAnimate = function ( options ) {
  
  let links = document.querySelectorAll(options.link);
  if (links ){
    links.forEach ((link)=>{
      link.addEventListener('click', (e) => {
        console.log('click');
        let elsMoving = document.querySelector(options.elsMoving);
        let elsNotMoving = document.querySelectorAll(options.elsNotMoving);
        let currentMenuEl = document.querySelector(activeMenuClass);

        // // TODO: get current active menu item; change to new page
        currentMenuEl.classList.remove(activeMenuClass);
        e.parentElement.classList.add(activeMenuClass);
        e.preventDefault();

        elsNotMoving.forEach((el,i)=> {
          el.classList.add('animate-in');
          el.classList.add('animate-out');
        });


        // in async handler (ajax/timer) do these actions: 
        setTimeout(function(){
          if (elsMoving.classList.contains('animate-out') ) {
            console.log('navigating...');
            if (!e.srcElement.parentElement.href){
              history.pushState(null, null, e.srcElement.href);
              changePage(options.elsNotMoving, options.elsMoving);
            } else {
              history.pushState(null, null, e.srcElement.parentElement.href);
              changePage(options.elsNotMoving, options.elsMoving);
            }
          } else {
            console.log('whoops', e.srcElement.parentElement.href);
          }
        }, 500);

        elsMoving.classList.remove('animate-in');
        elsMoving.classList.add('animate-out');
       
      });
    });
  }

}


function loadPage(url) {
  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    return response.text();
  });
}
// window.addEventListener('popstate', changePage);


function changePage(oldEls, newEls) {
  let elsNotMoving = document.querySelectorAll(oldEls);
  
  var main = document.querySelector('[data-pjax-main]');
  // current menu item has already been changed
  // let currentMenuEl = document.querySelector('.current_page_item');
  // Note, the URL has already been changed
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    // console.log(responseText);
    var wrapper = document.createElement('div');
    wrapper.id = 'animateee'
    wrapper.innerHTML = responseText;
    // console.log(wrapper);
    
    // select current first section el
    var oldContent = document.querySelector(newEls);
    // select first section element from wrapper
    var newContent = wrapper.querySelector(newEls);

    main.appendChild(newContent);

    oldContent.parentNode.removeChild(oldContent);


    elsNotMoving.forEach((el,i)=> {
      el.classList.remove('animate-out');
      el.classList.add('animate-in');
    });

    // load new content animation
    newContent.classList.remove('animate-out');
    newContent.classList.add('animate-in');

    // SEO changes
    let oldHead = document.querySelector('head');
    let oldHeadTags = oldHead.querySelectorAll('meta, title, script.yoast-schema-graph, link:not([rel="stylesheet"])');
    let referenceNode = oldHead.querySelector('meta');

    let newMetaTags = wrapper.querySelectorAll('#animateee meta, #animateee link, #animateee script.yoast-schema-graph, title');
    newMetaTags.forEach((tag, i, arr) => {
      
      oldHead.insertBefore(tag, referenceNode);

      if(i == (arr.length-1)) {
        // console.log('removing...');
        oldHeadTags.forEach((oldTag, i) => {
          oldTag.remove();
        });
      }
      
    });

  
  });
}

