
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
};


const form_link_images_category_page = function (image_names_from_category_page) {

    let links_download_images_category_page = [];

    image_names_from_category_page.forEach((image) => {
        let link_for_image = `${url_site}download/${image}/1366x768/`;
        links_download_images_category_page.push(link_for_image);
    });
    return links_download_images_category_page;
};

const get_image_names_from_category_page = function (html) {

    let image_names_from_category_page = [];
    doc.getElementById('bodyHtml').innerHTML = html;

    let elements = doc.querySelectorAll('div.wallpapers__item__wall');
    Array.prototype.forEach.call(elements, (element) => {
        let name_image = element.children[0].href.split('/').pop().split('.')[0];
        image_names_from_category_page.push(name_image);
    });
    return image_names_from_category_page;
};


$("#download_section").click(function () {
    
    $.get($("#categoriesImages option:selected").val(), function (response) {
        let image_names_from_category_page = get_image_names_from_category_page(response);
        let link_images_category_page = form_link_images_category_page(image_names_from_category_page);

        $('#processingImagesDownload').css('display', 'block');

        //берем файл из input
        var formData = new FormData();
        formData.append('imageLinks', JSON.stringify(link_images_category_page));
        formData.append('category', $("#categoriesImages option:selected").text());

        $.ajax({
            type: "POST",
            url: "/Home" + "/downloadCategoryImagesFromPage",
            data: formData,
            contentType: false,
            processData: false,
            async: true,
            success: function (response, textStatus) {
                if (response === "ok") {

                }
            },
            error: function (request, status, error) {
                alert('error');
            }
        });

    });

});


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