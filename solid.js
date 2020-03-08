var solid_index = 0;
var solid_interval;
var solid_length = 0;

$(function () {
    solid_length = $('.solid-img-box .img').size();
    $('.solid-img-box').children('.img').eq(solid_index).show();
    $('.solid-btn-group').children('.btn').eq(solid_index).addClass('active');

    solid_interval = setInterval(changeImg, 5000);

    $(".solid-btn-group .btn").click(function(){
        clearInterval(solid_interval);
        solid_index = $(this).index()-1;
        changeImg();
        solid_interval = setInterval(changeImg, 5000);
    })

})

function changeImg() {
    solid_index++;
    if (solid_index == solid_length) {
        solid_index = 0;
    }
    $('.solid-img-box').children('.img').eq(solid_index).show().stop().animate({
        opacity: 1
    }, 500).siblings().hide().stop().animate({
        opacity: 0
    }, 500);
    $('.solid-btn-group').children('.btn').eq(solid_index).addClass('active').siblings().removeClass('active');
}