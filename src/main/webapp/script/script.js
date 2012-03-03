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


    //construct date picker
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

    //name list click
    var $name_list = $("#name-list");
    var $ui_search_btn_wrap = $name_list.find(".ui-search-btn-wrap");
    $ui_search_btn_wrap.click(function(){
        var $ui_search_input = $name_list.find(".ui-search-input");
        var $ui_sortable = $name_list.find(".ui-sortable");
        var $iconSpanElem = $("<span class='icon icon-user'/>");
        var $nameSpanElem = $("<span class='ui-sortable-user-name'/>");
        var $liElem = $("<li class='ui-sortable-user'/>").append($iconSpanElem)
                        .append($nameSpanElem.text($ui_search_input.val()));
        var index = ($ui_sortable.find("li").length+1) % 2;// which ul to add li
        $ui_sortable.eq(index).append($liElem);
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
//                var ulElements = time_table.element.find("div").find("ul.ui-sortable:eq(" + (targetUL.index() - 1) + ")");
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

    var $ui_sortable = thisObj.element.find('.ui-sortable');
    thisObj.element.on("mousedown", "li", function (e) {

        if($.browser.msie && $.browser.version < 8){
            var ulTag = this.parentNode;
            var divTag = ulTag.parentNode;

            var divHeight = divTag.offsetHeight + this.offsetHeight;
            ulTag.style.height = divHeight+"px";
            ulTag.style.paddingBottom = 0;
            ulTag.style.marginBottom = 0;
            divTag.style.height = divHeight+"px";
        }

        if (e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble=true;
        }
    });


    $ui_sortable.sortable({
        // opacity : 0.6,
        items:'li',
        start:function (event, ui) {
            var $ulTagFrom = ui.item.parent();
            var $divTagFrom = $ulTagFrom.parent();
            dest.periodFrom = $divTagFrom.index() - 1;
            dest.dayFrom = $ulTagFrom.index() - 1;
            dest.posFrom = ui.item.index();

        },
        stop:function (event, ui) {
            if($.browser.msie && $.browser.version < 8){
                this.removeAttribute("style");
                this.parentNode.removeAttribute("style");
            }

            var $liTagTo = ui.item;
            var $ulTagTo = $liTagTo.parent();
            var $divTagTo = $ulTagTo.parent();

            dest.periodTo = $divTagTo.index() - 1;
            dest.dayTo = $ulTagTo.index() - 1;
            dest.posTo = $liTagTo.index();
            dest.name = $.trim($liTagTo.find(".name").text());
            if (null != dest.periodTo) {
                dest.time = thisObj.date.getTime();
                thisObj.save(dest);
            }
        }
    }).sortable({
            placeholder:'ui-state-highlight'
        }).sortable({
            connectWith:$ui_sortable
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