var video = gc = index = tindex = pindex = null,pid = skend = 0,page = 1,photoLength = 6,photoIndex = 0;
$(function () {
    //判断登录
    get_user_info();
    //刷新验证码
    $('.codes').click(function(){
        $(this).attr('src',ctcms_path+'index.php/code?t='+Math.random());
    });
	//搜索框显隐
	$(".index-search-icon").click(function () {
		if ($(".nav-search-box").hasClass('active')) {
			$(".nav-search-box").removeClass('active').hide();
		} else {
			$(".nav-search-box").addClass('active').show().siblings('.nav-hide-box').removeClass('active').hide();
		}
	});
	//会员浮层显隐
	$(".ydl").click(function () {
		if ($(".nav-user-box").hasClass('active')) {
			$(".nav-user-box").removeClass('active').hide();
		} else {
			$(".nav-user-box").addClass('active').show().siblings('.nav-hide-box').removeClass('active').hide();
		}
	});
	//分类显隐
	$(".click-class").click(function () {
		if ($(".nav-class-box").hasClass('active')) {
			$(".nav-class-box").removeClass('active').hide();
		} else {
			$(".nav-class-box").addClass('active').show().siblings('.nav-hide-box').removeClass('active').hide();
		}
	});
	//关闭所有浮层
	$('.page-container').click(function () {
		$('.nav-hide-box').removeClass('active').hide();
	});
	//图片放大
    $("#vodImg .data").click(function () {
        var img_url = $(this).attr('data-url');
        var str = ' <div class="showIMG-pop" id="bigImg">' +
            '<i class="icon close-icon" onclick="$(\'#bigImg\').remove();$(\'body\').removeClass(\'body-fixed\')"></i>' +
            '<img class="absolute-center" src="' + img_url + '"></div>';

        $('body').append(str).addClass("body-fixed");
    });
    //签到
    $('.qd-btn').click(function() {
        var _this = $(this);
        if(!_this.hasClass('active')){
            $.get(ctcms_path+'index.php/user/ajax/qiandao', function(data) {
                if(data.code == 0){
					ty_tip(1,data.msg,1000);
                    _this.addClass('active').html(data.qdnum+'天');
                }else{
                    ty_tip(2,data.msg,1000);
                }
            },'json');
        }
    });
    //退出登录
    $('.user_logout').click(function() {
        $.get(ctcms_path+'index.php/user/logout/index/ajax', function(data) {
            if(data.code == 0){
                $('.ydl').hide();
                $('.wdl').show();
				$('.nav-user-box').hide();
            }else{
                ty_tip(2,data.msg,1000);
            }
        },'json');
    });
    //加载更多分类
    $('.more_index').click(function() {
        var dir = $(this).attr('data-type');
        page++;
        $.get(ctcms_path+'index.php/ajax/more/'+dir+'/'+page, function(data) {
            if(data.code == 0){
                $('.add-more-class').before(data.html);
                if(data.pagejs <= data.page){
                    if(data.pagejs < data.page) ty_tip(2,'没有更多了~!',1000);
                    $('.add-more-class').remove();
                }
            }else{
                ty_tip(2,data.msg,1000);
            }
        },'json');
    });
    //收藏
    if($(".sc-btn").length > 0){
        //判断是否收藏
        var did = $(".sc-btn").attr('data-did');
        var dir = $(".sc-btn").attr('data-type');
        $.post(ctcms_path+'index.php/user/ajax/isfav/', {did:did,dir:dir}, function(data) {
            if(data.code == 0){
                $(".sc-btn").addClass('active').children('.icon').addClass('active');   
            }
        },'json');
        //收藏
        $(".sc-btn").click(function(){
            var did = $(this).attr('data-did');
            var dir = $(this).attr('data-type');
            var isfav = $(this).hasClass('active');
            var _this = $(this);
            $.post(ctcms_path+'index.php/user/ajax/fav', {did:did,dir:dir}, function(data) {
                if(data.code == 0){
                    if(isfav){
                        _this.removeClass('active').children('.icon').removeClass('active');
                        ty_tip(1,'已取消收藏',1000);
                    }else{
                        _this.addClass('active').children('.icon').addClass('active');
                        ty_tip(1,'收藏成功！',2000);
                    }
                } else {
                    ty_tip(2,data.msg,1000);
                }
            },'json');
        });
    }
    //人气
    if($(".mode-hits").length > 0){
        var path = $(".mode-hits").attr('data-path');
        setTimeout(function(){
            get_init_js(path);
        },3000);
    }
    //评论
    if($("#ctcms_pl").length > 0){
        //获取评论列表
        get_pl();
        //回复评论点击按钮
        $("#ctcms_pl").on('click', '.plhf',function(){
            if(document.cookie.indexOf('ctcms_uid=') >= 0) {
                var fid = $(this).attr('data-id');
                var uid = $(this).attr('data-uid');
                var name = $(this).attr('data-name');
                $('#fid').val(fid);
                $('#fuid').val(uid);
                $('.pltxt').val('').attr('placeholder','回复：'+name);
            }else{
                ty_tip(2,'登录超时',1000);
            }
        });
        //评论点赞
        $("#ctcms_pl").on('click', '.plzan',function(){
            var iszan = $(this).children('i').hasClass('active');
            var id = $(this).attr('data-id');
            var _this = $(this);
            $.post(ctcms_path+'index.php/pl/zan',{id:id},function(data) {
                if(data.code == 0){//成功
                    if(iszan){
                        _this.children('i').removeClass('active');
                    } else {
                        _this.children('i').addClass('active');
                    }
                    _this.children('font').html(data.zan);
                } else {
                    ty_tip(2,data.msg,1500);
                }
            },"json");
        });
        //评论删除
        $("#ctcms_pl").on('click', '.pldel',function(){
            var id = $(this).attr('data-id');
            showDelPop();
            $('.cmddel').click(function(){
                $.post(ctcms_path+'index.php/pl/del',{id:id},function(data) {
                    if(data.code == 0){//成功
                        $('#plist_'+id).remove();
                        $('.delete-tip-pop').remove();
                    } else {
                        ty_tip(2,data.msg,1500);
                    }
                },"json");
            });
        });
        //发表评论
        $('.ctcms_plform').submit(function(e){
            e.preventDefault();
            var action = $(this).attr('action');
            var sendForm = $(this).serialize();
            var txt = $('.pltxt').val();
            if(document.cookie.indexOf('ctcms_uid=') < 0) {
                ty_tip(2,'登录超时',1000);
            } else if(txt == ''){
                ty_tip(2,'请输入评论内容',1000);
            } else {
                $.post(action, sendForm, function(data) {
                    if(data.code == 0){
                        ppage = 1;
                        $('.pltxt').val('').attr('placeholder','说点什么吧~');
                        $('#fid').val('0');
                        $('#fuid').val('0');
                        get_pl();
                    } else {
                        ty_tip(2,data.msg,1500);
                    }
                },'json');
            }
        });
    }
    //form提交
    $('#ctcms_form,.ctcms_form').submit(function(e){
        e.preventDefault();
        if(gc) layedit.sync(gc);
        var action = $(this).attr('action');
        var sendForm = $(this).serialize();
        $.post(action, sendForm, function(data) {
            if(data.code == 0){
                ty_tip(1,data.msg,1000);
                setTimeout(function(){
                    window.location.href = data.url;
                },1000);
            } else {
                ty_tip(2,data.msg,1500);
            }
        },'json');
    });
});
//播放视频
function vod_play(url) {
    video = document.getElementById('video');
    console.log(url)
    video.src = url;
   video.play();
    pindex = setInterval(function () {
        var re = /^\d+(?=\.{0,1}\d+$|$)/;
        if(re.test(video.duration)){
            $('.vload').hide();
        }else{
            if(!video.paused) $('.vload').show();
        }
    }, 1000);



}
//视频播放
function get_index_vod(_id,_zu,_ji) {
    clearInterval(index);
    clearInterval(pindex);
    skend = 0;
    $('.vplay').show();
    $('.vodsk').hide();
    $.get(ctcms_path+'index.php/vod/url/'+_id+'/'+_zu+'/'+_ji, function(data) {
        if(data.code == -1){
            ty_tip(2,data.msg,1000);
        }else{
            if(data.msg != '') $('.skmsg').html(data.msg);
            //未登录
            if(data.code == 2){
                $('.skbtn').html('立即登录').attr('onclick','window.location.href =\''+ctcms_path+'index.php/user/login\'');
            }
            //点播金币不够
            if(data.code == 4){
                $('.skbtn').html('立即充值');
            }
            //点播
            if(data.code == 5){
                $('.skbtn').attr('onclick',"get_buy("+_id+",'vod');").html('立即购买');
            }
            if(data.code == 0 || data.sk == 1){
                vod_play(data.url);
                if(data.sk == 1 && data.sktime > 0){
                    index = setInterval(function () {
                        if(video){
                            var ptime = video.currentTime;
                            if(ptime > data.sktime || video.ended){
                                skend = 1;
                                video.pause();
                                video.remove();
                                $('.vod').remove();
                                $('.vplay').hide();
                                $('.vodsk').show();
                                clearInterval(index);
                            }
                        }
                    }, 1000);
                }
            }else{
                $('.vplay').hide();
                $('.vodsk').show();
            }
        }
    },'json');
}
//购买
function get_buy(_id,dir) {
    var str = '<div class="delete-tip-pop fixed-center">' +
        '<div class="tip-box absolute-center">' +
        '<div class="tip-msg">确定要购买吗？</div>' +
        '<div class="btn-group">' +
        '<button class="qx" onclick="$(\'.delete-tip-pop\').remove()">取消</button>' +
        '<button class="cz" onclick="buy('+_id+',\''+dir+'\')">确定</button></div></div></div>';
    $('body').append(str);
}
//购买确定
function buy(_id,dir){
    $.post(ctcms_path+'index.php/user/ajax/buy',{id: _id,dir: dir},function(data) {
        if(data.code == 0){//成功
            ty_tip(1,'购买成功',1000);
            $('.delete-tip-pop').remove();
            if(dir == 'vod'){
                get_index_vod(_id);
            }else{
                location.reload();
            }
        } else {
            ty_tip(2,data.msg,1000);
        }
    },"json");
}
//异步加载JS
function get_init_js(path){
    var sobj = document.createElement('script'); 
    sobj.type = "text/javascript";
    sobj.src = path;
    var headobj = document.getElementsByTagName('head')[0];
    headobj.appendChild(sobj);
}
//搜索类型选择
function get_search_type(t,dir) {
    $(t).addClass('active').siblings().removeClass('active');
	$('.search_btn').attr('data-type',dir);
}
//搜索
function get_search() {
    var key = $('.search_key').val();
    var type = $('.search_btn').attr('data-type');
    if(key == ''){
        ty_tip(2,'请输入要搜索的内容',1000);
    }else{
        window.location.href = ctcms_path+"index.php/"+type+"/search?key="+encodeURIComponent(key);
    }
}
//判断登录
function get_user_info() {
    $.get(ctcms_path+'index.php/user/ajax/log', function(data) {
        if(data.code == 0){
            if(data.log == 0){
                $('.ydl').hide();
                $('.wdl').show();
				$('.nav-user-box').hide();
            }else{
                $('.nav-user-box .user-pic img').attr('src',data.pic);
                $('.nav-user-box .info .name').html(data.nichen);
                $('.nav-user-box .info .jibie').html('级别：'+data.vip);
                $('.nav-user-box .home_link').attr('href',data.ulink);
                if(data.qd == 1){
                    $('.nav-user-box .qd-btn').addClass('active').html(data.qdnum+'天');
                }
                if($('.user_cion').length > 0){
                    $('.user_cion').html(data.cion+'金币');
                }
                $('.ydl').show();
                $('.wdl').hide();
            }
        }else{
            ty_tip(2,data.msg,1000);
        }
    },'json');
}
function setPage(index){
    pid = index;
    $(window).scrollTop(0);
    $(".img-list .img").eq(index).show().siblings().hide();
    var fy_str = "";
    if(index == 0){
        for(var i = 0;i<3;i++){
            if(i==index){
                fy_str += '<a class="page active">'+ (i+1) +'</a>'
            }else{
                fy_str += '<a class="page" onclick="setPage('+(i)+')">'+ (i+1) +'</a>'
            }
            if(i == (page_size-1)){
                break;
            }
        }
        if( page_size <= 3){
            if(page_size >1){
                fy_str += '<a class="page" onclick="setPage('+(index+1)+')">&gt;</a>';
                fy_str += '<a class="page first-last-page" onclick="setPage('+(page_size-1)+'">尾页</a>';
            }
        }else{
            fy_str +='<a class="page">···</a>';
            fy_str += '<a class="page" onclick="setPage('+(index+1)+')">&gt;</a>';
            fy_str += '<a class="page first-last-page" onclick="setPage('+(page_size-1)+')">尾页</a>';
        }
        
    }
    if(index != 0){
        fy_str += '<a class="page first-last-page" onclick="setPage(0)">首页</a>';
        fy_str += '<a class="page" onclick="setPage('+(index-1)+')">&lt;</a>';
        if(index != 1){
            fy_str +='<a class="page">···</a>';
        }
        fy_str += '<a class="page" onclick="setPage('+(index-1)+')">'+ index +'</a>'
        fy_str += '<a class="page active">'+ (index+1) +'</a>'
        if((index+2) <= page_size){
            fy_str += '<a class="page" onclick="setPage('+(index+1)+')">'+ (index+2) +'</a>'
            if((index+2) < page_size){
                fy_str +='<a class="page">···</a>';
            }
        }
        if( (index+1) != page_size){
            fy_str += '<a class="page" onclick="setPage('+(index+1)+')">&gt;</a>';
            fy_str += '<a class="page first-last-page" onclick="setPage('+(page_size-1)+')">尾页</a>';
        }
        
    }
    $("#imgPagenation").empty().append(fy_str);
}
//employeeImageUploadUrl:图片上传地址
//uploadfileID:input[type="file"]的文件id
//PicUrl_target:储存图片服务器地址的input[type='hidden']选择器
function ajaxFileUpload(employeeImageUploadUrl, uploadfileID, PicUrl_target) {
    $.ajaxFileUpload({
        type: "post",
        url: employeeImageUploadUrl,
        secureuri: false,
        fileElementId: uploadfileID,
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 0) {
                $(PicUrl_target).val(data.data.src);
                if($('.delete-img-icon').length > 0){
                    $('.delete-img-icon').show();
                }
                if($('#showImg').length > 0){
                    $('#showImg').css('background', 'url('+data.data.src+') center/cover no-repeat');
                }
                ty_tip(1,'图片上传成功',1000);
            } else {
                ty_tip(2,'上传失败！',3000);
            }
        },
        error: function (data, status, e) {
            ty_tip(2,'上传失败！',3000);
        }
    })
}
//通用删除提示框
function showDelPop(msg) {
    if (!msg) {
        msg = '删除后不可恢复，是否确定删除？';
    }
    var str = '<div class="delete-tip-pop fixed-center">' +
        '<div class="tip-box absolute-center">' +
        '<div class="tip-msg">' + msg + '</div>' +
        '<div class="btn-group">' +
        '<button class="qx" onclick="$(\'.delete-tip-pop\').remove()">取消</button>' +
        '<button class="cz cmddel">确定</button></div></div></div>';
    $('body').append(str);
}
//通用提示框
function ty_tip(type,msg,time){
    if(type == 1){
        var str = '<div class="common-tip" id="commenTip" style="font-weight: bold;color:#ff0;">'+msg+'</div>'
    }else{
        var str = '<div class="common-tip" id="commenTip" style="font-weight: bold;color:red;">'+msg+'</div>'
    }
    $('body').append(str);
    setTimeout(function(){
        $("#commenTip").remove();
    }, time);
}
//获取评论
var ppage = 1;
var ppagejs = 1;
function get_pl(){
    var did = $('#ctcms_pl').attr('data-did');
    var dir = $('#ctcms_pl').attr('data-type');
    $.post(ctcms_path+'index.php/pl',{did:did,dir:dir,page:ppage},function(data) {
        if(data.code == 0){//成功
            $('#ctcms_pl').html(data.html);
        }else{
            $('#ctcms_pl').html(data.msg);
        }
    },"json");
}