/**
 * User: Sean
 * Date: 12-2-13
 * Time: 下午4:48
 */
$(function(){
    if($.browser.msie && $.browser.version <= 8){
        var items = $(".sl-ie-shadow");
        $.each(items,function(index,item){
            var item = $(item);
            var shadowLayer = $("<span/>").addClass("sl-ie-shadow-layer").css("height",item.height());
            item.prepend(shadowLayer);
        });
    }
});