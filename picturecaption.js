/*! picturecaption - allows multiple <figcaption> and alt definitions for <source>s within <picture>
 * Author: Ian Devlin, 2014
 * Version: 0.2.0
 * License: MIT
 */
(function() {
    'use strict';

    var data = [],
        lookup = {},
        defaultCaption,
        figures = document.getElementsByTagName('figure'),
        parseSrc = function(src) {
            return src.replace(window.location.origin + window.location.pathname, '');
        },
        getDataById = function(labelId) {

            for (var i = 0; i < data.length; i++) {

                if (data[i].labelledby === labelId) {
                    return data[i];
                }
            }
            return false;
        },
        checkFigcaption = function (el, isDefault) {

            if (el.hasAttribute('aria-labelledby')) {

                labelledBy = el.getAttribute('aria-labelledby');
                figcaption = document.getElementById(labelledBy);

                if (figcaption) {
                    if (isDefault) {
                        defaultCaption = figcaption;
                    }
                    else {
                        figcaption.setAttribute('aria-hidden', true);
                        figcaption.style.display = 'none';
                    }
                    caption = figcaption.innerHTML;
                }
            }
        };
    

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
                        childTag = child.tagName.toLowerCase(),
                        labelledBy = '',
                        caption = '',
                        figcaption;

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

                            checkFigcaption(child, false);

                            if (!getDataById(labelledBy)) {
                                data.push({
                                    src: imgSrc,
                                    labelledby: labelledBy,
                                    caption: caption,
                                    alt: imgAlt
                                });

                                lookup[imgSrc] = data[data.length - 1];
                            }
                            else {
                                item = getDataById(labelledBy);
                                item.src = imgSrc;
                                item.alt = imgAlt;
                            }
                        }
                    }
                    else if (childTag === 'img') {

                        child.addEventListener('load', function(e) {
                            var data = lookup[parseSrc(e.target.currentSrc)];
                            defaultCaption.innerHTML = data.caption;
                            e.target.alt = data.alt;
                            e.target.setAttribute('aria-labelledby', data.labelledby);
                        });

                        checkFigcaption(child, true);

                        imgSrc = parseSrc(child.src);

                        data.push({
                            labelledby: labelledBy,
                            src: imgSrc,
                            caption: caption,
                            alt: child.alt
                        });

                        lookup[imgSrc] = data[data.length - 1];
                    }
                }
            }
        }
    }

    console.log(data);
    console.log(lookup);

})();