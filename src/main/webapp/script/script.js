/**
 * User: Sean
 * Date: 12-2-21
 * Time: 下午10:04
 */

$(function () {
    var date = new Date();  // current date of date_picker

    //construct time table
    var time_table = new Timetable(document.getElementById("timetable"),date);
    time_table.load();
    time_table.sort();


    var $date_picker = $("#date-picker").datepicker({
        showAnim: '',
        onChangeMonthYear:function (year, month, inst) {
            date.setYear(year);
            date.setMonth(month - 1);
        },
        onSelect:function (dateText, inst) {
            var date = new Date(dateText);
            time_table.date= date;
            time_table.reload(date.getTime());
        }
    });

    var $name_list = $("#name-list");
    var $ui_search_btn = $name_list.find(".ui-search-btn");
    $ui_search_btn.click(function(e){
        var $ui_search_input = $name_list.find(".ui-search-input");
        var $name_list_cnt = $name_list.find(".name-list-cnt");
        var $liElem = $("<li/>").text($ui_search_input.val());
        var liCount = $name_list_cnt.find("li").length;
        if( 0 == liCount % 2){
            $name_list_cnt.children(".name-list-odd").append($liElem);
        }else{
            $name_list_cnt.children(".name-list-even").append($liElem);
        }
    });
    
//    var $ui_search = $(".ui-search");
//    $ui_search.on("focus",".ui-search-input",function(e){
//        $ui_search.css("background-color","white");
//    }).on("blur",".ui-search-input",function(e){
//            $ui_search.css("background-color","whiteSmoke");
//    });

    if (!$.browser.msie || $.browser.version >= 8) {

        $date_picker.on("mouseenter", ".ui-state-default", function (e) {
            $(e.target).draggable({
                helper:'clone'
            });
        });

        // clone day info from date picker
//        time_table.element.find(".ui-sortable").droppable({
//            accept:'.ui-state-default',
//            over:function (event, ui) {
//                var targetUL = $(this);
//                var ulElements = time_table.element.children("div").find("ul.ui-sortable:eq(" + (targetUL.index() - 1) + ")");
//                ulElements.addClass("day-hover");
//            },
//            out:function (event, ui) {
//                time_table.element.find(".day-hover").removeClass("day-hover");
//            },
//            drop:function (event, ui) {
//                time_table.element.find(".day-hover").removeClass("day-hover");
//                var days = $date_picker.find(".ui-state-default");
//                date.setDate(days.index(ui.draggable) + 1);
//            }
//        });
    }

});


function Timetable(element,date) {
    this.element = $(element);
    this.data = null;
    this.date = date;
}

Timetable.prototype.refreshData = function (time) {
    var dataTmp = this.data;
    $.ajax({
        async:false,
        url:"timetable.do?method=load",
        dataType:"json",
        data:{
            time:time
        },
        cache:false,
        success:function (result) {

            dataTmp = toMatrix(result.week);
        }
    });
    this.data = dataTmp;
};

Timetable.prototype.load = function () {
    this.refreshData(null);
    this.element.append($("#tableTmpl").tmpl(this.data));
};

Timetable.prototype.save = function (dest) {
    var isModified = false;
    var time = null;
    $.ajax({
        async:false,
        url:"timetable.do?method=save",
        type:"post",
        dataType:"json",
        data:dest,
        success:function (data) {
            time = data.time;
            if (undefined != data.msg) {
                var $msg = $("#main .msg");
                $msg.html(data.msg);
                $msg.show("blind", {}, 1000, showMsg);
                isModified = true;
            }
        }
    });
    if (isModified) {
        this.reload(time);
    }
};

Timetable.prototype.reload = function (time) {
    this.refreshData(time);
    var ulElements = this.element.find(".ui-sortable");
    var table = this.data.table;
    for (var row = 0; row < table.length; ++row) {
        for (var col = 0; col < table[row].length; ++col) {
            ulElements.eq((row * table[row].length) + col).html($("#traineeTmpl").tmpl(table[row][col]));
        }
    }

};


Timetable.prototype.sort = function () {
    var isLTE7 = $.browser.msie && $.browser.version < 8;
    var thisObj = this;
    var dest = {
        dayFrom:null,
        dayTo:null,
        periodFrom:null,
        periodTo:null,
        posFrom:null,
        posTo:null,
        name:null
    };

    var liTag = null;
    var ulTags = thisObj.element.find('.ui-sortable');
    var ulTag = null;
    var divTag = null;
    thisObj.element.on("mousedown", "li", function (e) {
        liTag = $(e.target);
        ulTag = liTag.parent();
        divTag = ulTag.parent();

        if (isLTE7) {
            ulTag.css('height', divTag.height()).css('padding-bottom', 0)
                .css('margin-bottom', 0);
        }

        if (e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble=true;
        }
    });


    ulTags.sortable({
        // opacity : 0.6,
        items:'li',
        start:function (event, ui) {
            if (isLTE7) {
                var divHeight = divTag.height() + liTag.height();
                divTag.css("height", divHeight);
                ulTag.css("height", divHeight);
            }

            dest.periodFrom = divTag.index() - 1;
            dest.dayFrom = ulTag.index() - 1;
            dest.posFrom = liTag.index();
        },
        stop:function (event, ui) {
            if (isLTE7) {
                ulTag.css('height', 'auto').css('padding-bottom', '3000px')
                    .css('margin-bottom', '-3000px');
                divTag.css("height", "auto");
            }

            var $item = ui.item;
            var $ulItem = $item.parent('ul');

            dest.periodTo = $ulItem.parent('div').index() - 1;
            dest.dayTo = $ulItem.index() - 1;
            dest.posTo = $item.index();
            dest.name = $.text(ui.item);
            if (null != dest.periodTo) {
                dest.time = thisObj.date.getTime();
                thisObj.save(dest);
            }
        }
    }).sortable({
            placeholder:'ui-state-highlight'
        }).sortable({
            connectWith:ulTags
        }).disableSelection();
};


function Matrix(dayAmount, periodAmount) {
    var table = new Array(periodAmount);
    for (var i = 0; i < table.length; i++)
        table[i] = new Array(dayAmount);

    for (var row = 0; row < table.length; row++) {
        for (var col = 0; col < table[row].length; col++) {
            table[row][col] = new Array();
        }
    }
    return table;
}

function toMatrix(data) {
    var days = data.days;
    var periods = days[0].periods;
    var table = Matrix(days.length, periods.length);

    $.each(days, function (indexOfDay, day) {
        $.each(day.periods, function (indexOfPeriod, period) {
            table[indexOfPeriod][indexOfDay] = table[indexOfPeriod][indexOfDay]
                .concat(period.trainees);
        });
    });
    var weektable = {};
    weektable.table = table;
    return weektable;
}


/** show msg*/
function showMsg() {
    setTimeout(function () {
        $("#main .msg").hide("blind", {}, 1000);
    }, 4000);
}
/* show msg **/