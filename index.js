
options = {
  link: 'a',
  activeMenuClass: '.current_page_item',
  elsMoving: '> section',
  elsNotMoving: ['header', 'footer'],
  default: 'fade'
}


// TODO:
// check for other "outside" elements that need changing ie active menu
// binding and unbinding certain events, reevaluating plugins, and including polyfills and third-party code.


exports.pjaxAnimate = function ( options ) {

  if (options.default !== false){
    setDefaultAnimation(options.default);
  }
  
  let links = document.querySelectorAll(options.link);
  let activeClass = options.activeMenuClass.substr(1);
  if (links ){
    links.forEach ((link)=>{
      link.addEventListener('click', (e) => {
        if (e.srcElement.parentElement.target !== '_blank' || e.srcElement.target !== '_blank'){
          let elsMoving = document.querySelector(`[data-pjax-main]${options.elsMoving}`);
          let elsNotMoving = document.querySelectorAll(options.elsNotMoving);
          let currentMenuEl = document.querySelector(options.activeMenuClass);
          currentMenuEl.classList.remove(activeClass);
          e.srcElement.parentElement.classList.add(activeClass);
          
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
              console.log('whoops', e.srcElement.parentElement.target);
            }
          }, 500);

          elsMoving.classList.remove('animate-in');
          elsMoving.classList.add('animate-out');
       }
      });
    });
  }

}


function setDefaultAnimation(animation) {
  let css = document.createElement('link');
  css.rel = 'stylesheet';
  if (animation == 'fade') {
    css.id = 'pjax-fade';
    css.href = '/wp-content/themes/fishtaco/node_modules/@dylanjconnor/pjax-animation/css/fade.css'
    document.head.appendChild(css);
  } else if (animation == 'slide') {
    css.id = 'pjax-slide';
    css.href = '/wp-content/themes/fishtaco/node_modules/@dylanjconnor/pjax-animation/css/slide.css'
    document.head.appendChild(css);
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
  
  // Note, the URL has already been changed
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    // console.log(responseText);
    var wrapper = document.createElement('div');
    wrapper.id = 'animateee'
    wrapper.innerHTML = responseText;
    
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

