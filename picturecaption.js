/*! picturecaption - allows multiple <figcaption> and alt definitions for <source>s within <picture>
 * Author: Ian Devlin, 2014
 * Version: 0.1.0
 * License: MIT
 */
(function() {
    'use strict';

    var debug = false,
        data = [],
        lookup = {},
        defaultCaption,
        figures = document.getElementsByTagName('figure'),
        parseSrc = function(src) {
            return src.replace(window.location.origin + window.location.pathname, '');
        },
        getDataById = function(id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return data[i];
                }
            }
            return false;
        };
    
    if (debug) {
        console.log(figures);
    }

    for (var i = 0; i < figures.length; i++) {
        for (var j = 0; j < figures[i].children.length; j++) {
            var el = figures[i].children[j],
                tag = el.tagName.toLowerCase(),
                item,
                imgSrc;
            
            if (tag === 'picture') {
                // store source elements and img element data
                for (var k = 0; k < el.children.length; k++) {
                    var child = el.children[k],
                        childTag = child.tagName.toLowerCase();
                    if (childTag === 'source') {
                        // parse srcset
                        var srcs = child.srcset.split(',');
                        for (var m = 0; m < srcs.length; m++) {
                            var src = srcs[m].trim().split(' '),
                                imgAlt = '';
                            imgSrc = parseSrc(src[0].trim());
                            if (child.hasAttribute('data-alt')) {
                                imgAlt = child.getAttribute('data-alt');
                            }
                            data.push({
                                id: child.id,
                                src: imgSrc,
                                caption: '',
                                alt: imgAlt
                            });
                            
                            lookup[imgSrc] = data[data.length - 1];
                        }
                    }
                    else if (childTag === 'img') {
                        child.addEventListener('load', function(e) {

                            if (debug) {
                                console.log(parseSrc(e.target.currentSrc));
                            }

                            var data = lookup[parseSrc(e.target.currentSrc)];
                            defaultCaption.innerHTML = data.caption;
                            e.target.alt = data.alt;

                            if (debug) {
                                console.log(data);
                                console.log(e.target);
                            }

                        });
                        imgSrc = parseSrc(child.src);
                        data.push({
                            id: child.id,
                            src: imgSrc,
                            caption: '',
                            alt: child.alt
                        });

                        lookup[imgSrc] = data[data.length - 1];
                    }
                }
            }
            else if (tag === 'figcaption') {
                if (el.hasAttribute('data-for')) {
                    el.setAttribute('aria-hidden', true);
                    el.style.display = 'none';
                    item = getDataById(el.getAttribute('data-for'));
                    item.caption = el.innerHTML;
                }
                else {
                    defaultCaption = el;
                    item = getDataById('');
                    item.caption = el.innerHTML;
                }
            }
        }
    }

    if (debug) {
        console.log(data);
        console.log(lookup);
    }

})();