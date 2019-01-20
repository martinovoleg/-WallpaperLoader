
let doc = document;

var doctype = document.implementation.createDocumentType('html', '', '');
var dom = document.implementation.createDocument('', 'html', doctype);


$.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
});

let url_site = "https://www.goodfon.ru/";
let categoriesImages = [];


const get_categories_images = function (html) {

    doc.getElementById('bodyHtml').innerHTML = html;
    
    let div_head_menu_elements = doc.querySelector('div.head_menu').children;
    Array.prototype.forEach.call(div_head_menu_elements, (element) => {
        $('#categoriesImages')
            .append($("<option></option>")
                .attr("value", element.href)
                .text(element.innerHTML)); 
    });

    $('#categoriesImages').attr('disabled', false);
    $('#download_section').attr('disabled', false);
};


const form_link_images_category_page = function (image_names_from_category_page) {

    let links_download_images_category_page = [];

    image_names_from_category_page.forEach((image) => {
        let link_for_image = `${url_site}download/${image}/1366x768/`;
        links_download_images_category_page.push(link_for_image);
    });
    return links_download_images_category_page;
};

const get_image_names_from_category_page = function () {

    let image_names_from_category_page = [];

    let elements = doc.querySelectorAll('div.wallpapers__item__wall');
    Array.prototype.forEach.call(elements, (element) => {
        let name_image = element.children[0].href.split('/').pop().split('.')[0];
        image_names_from_category_page.push(name_image);
    });
    return image_names_from_category_page;
};


$("#download_section").click(function () {
    let next_page_url;
    let categoriesImages_sel_val = $("#categoriesImages option:selected").val();
    let current_page = doc.getElementById('download_section').current_page;

    if (current_page) {
        next_page_url = `${categoriesImages_sel_val}index-${current_page}.html`;
    } else {
        next_page_url = $("#categoriesImages option:selected").val();
    }

    $.get(next_page_url, function (response) {
        doc.getElementById('bodyHtml').innerHTML = response;
        download_images_category_f(response);

    });

});

const download_images_category_f = function (response) {

    let count_pages = doc.querySelector('div.paginator__page').innerHTML.trim().split(' ')[2];
    let current_page = parseInt(doc.querySelector('div.paginator__page').innerHTML.trim().split(' ')[0]);

    let image_names_from_category_page = get_image_names_from_category_page();
    let link_images_category_page = form_link_images_category_page(image_names_from_category_page);
    let step = 0;

    $('#processingImagesDownload').css('display', 'block');
    $('.progress').css('display', 'block');
    $('.progress-bar').attr('aria-valuemax', count_pages);

    // цикл загрузки изображений
    link_images_category_page.forEach((link_image) => {

        var formData = new FormData();
        formData.append('imageLink', link_image);
        formData.append('category', $("#categoriesImages option:selected").text());

        $.ajax({
            type: "POST",
            url: "/Home" + "/downloadCategoryImageFromPage",
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response, textStatus) {
                step++;
                if (response === "ok") {
                    if (step === link_images_category_page.length) {
                        $('.progress-bar').attr('aria-valuenow', current_page);
                        $('.progress-bar').attr('style', `width:${current_page}%`);
                        console.log(current_page);
                        doc.getElementById('download_section').current_page = ++current_page;
                        $("#download_section").click();
                    }
                    let text = link_image.split('/');
                    $('.progress-bar-title').text(text[text.length-3]);
                } else {
                    alert(response);
                }

            },
            error: function (request, status, error) {
                alert('error');
            }
        });
    });
    
}


$.get(url_site, function (response) {
    get_categories_images(response);
});




















//$.ajax({
//        type: 'GET',
//        url: url_site,
//        //proxy: 'http://evil.com/', 
//        headers: { 'Access-Control-Allow-Origin': '*' },
//        //beforeSend: function (xhr) {
//        //    xhr.setRequestHeader('cache-control','max-age=0');
//        //    xhr.setRequestHeader('upgrade-insecure-requests','1');
//        //    xhr.setRequestHeader('method','GET');
//        //},
//        accepts: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//        //contentType: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//        //crossDomain: true,
//        //cache: true,
//        //processData: false,
//        crossOrigin: true,
//        async: true,
//        success: function (response, textStatus) {
//        console.log(response);
//        //get_categories_images(response);
//        },
//    error: function (request, status, error) {
//        alert(error);
//        }
//    });