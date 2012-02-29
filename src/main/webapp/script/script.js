/**
 * User: Sean
 * Date: 12-2-21
 * Time: 下午10:04
 */

$(function () {
    var date = new Date();  // current date of date_picker

    //construct time table
    var time_Table = new TimeTable(document.getElementById("timeTable"),date);
    time_Table.load();
    time_Table.sort();


    var $date_picker = $("#datepicker").datepicker({
        showAnim: '',
        onChangeMonthYear:function (year, month, inst) {
            date.setYear(year);
            date.setMonth(month - 1);
        },
        onSelect:function (dateText, inst) {
            var date = new Date(dateText);
            time_Table.date= date;
            time_Table.reload(date.getTime());
        }
    });

    if (!$.browser.msie || $.browser.version >= 8) {

        $date_picker.on("mouseenter", ".ui-state-default", function (e) {
            $(e.target).draggable({
                helper:'clone'
            });
        });

        // clone day info from date picker
//        time_Table.element.find(".ui-sortable").droppable({
//            accept:'.ui-state-default',
//            over:function (event, ui) {
//                var targetUL = $(this);
//                var ulElements = time_Table.element.children("div").find("ul.ui-sortable:eq(" + (targetUL.index() - 1) + ")");
//                ulElements.addClass("day-hover");
//            },
//            out:function (event, ui) {
//                time_Table.element.find(".day-hover").removeClass("day-hover");
//            },
//            drop:function (event, ui) {
//                time_Table.element.find(".day-hover").removeClass("day-hover");
//                var days = $date_picker.find(".ui-state-default");
//                date.setDate(days.index(ui.draggable) + 1);
//            }
//        });
    }

});


function TimeTable(element,date) {
    this.element = $(element);
    this.data = null;
    this.date = date;
}

TimeTable.prototype.refreshData = function (time) {
    var dataTmp = this.data;
    $.ajax({
        async:false,
        url:"timesheet.do?method=load",
        dataType:"json",
        data:{
            time:time
        },
        cache:false,
        success:function (result) {
            dataTmp = toMatrix(result);
        }
    });
    this.data = dataTmp;
};

TimeTable.prototype.load = function () {
    this.refreshData(null);
    this.element.append($("#tableTmpl").tmpl(this.data));
};

TimeTable.prototype.save = function (dest) {
    var isModified = false;
    var time = null;
    $.ajax({
        async:false,
        url:"timesheet.do?method=save",
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

TimeTable.prototype.reload = function (time) {
    this.refreshData(time);
    var ulElements = this.element.find("ul");
    var table = this.data.table;
    for (var row = 0; row < table.length; ++row) {
        for (var col = 0; col < table[row].length; ++col) {
            ulElements.eq((row * table[row].length) + col).html($("#traineeTmpl").tmpl(table[row][col]));
        }
    }

};


TimeTable.prototype.sort = function () {
    var thisObj = this;
    var dest = {
        dayFrom:null,
        dayTo:null,
        periodFrom:null,
        periodTo:null,
        posFrom:null,
        posTo:null,
        name:null,
        time:thisObj.date.getTime()
    };

    var ulElements = thisObj.element.find('ul');
    var ulElement = null;
    var divElement = null;
    thisObj.element.on("mousedown", "li", function (e) {
        var liElement = $(e.target);
        ulElement = liElement.parent();
        divElement = ulElement.parent();
        ulElement.css('height', divElement.height()).css('padding-bottom', 0)
            .css('margin-bottom', 0);
    });


    ulElements.sortable({
        // opacity : 0.6,
        items:'li',
        start:function (event, ui) {

            var $item = ui.item;
            var $ulItem = $item.parent('ul');

            dest.periodFrom = $ulItem.parent('div').index() - 1;
            dest.dayFrom = $ulItem.index() - 1;
            dest.posFrom = $item.index();
        },
        stop:function (event, ui) {
            ulElement.css('height', 'auto').css('padding-bottom', '3000px')
                .css('margin-bottom', '-3000px');

            var $item = ui.item;
            var $ulItem = $item.parent('ul');

            dest.periodTo = $ulItem.parent('div').index() - 1;
            dest.dayTo = $ulItem.index() - 1;
            dest.posTo = $item.index();
            dest.name = $.text(ui.item);
            thisObj.element.off("mousedown");
            if (null != dest.periodTo) {
                thisObj.save(dest);
            }
        },
        change:function (evnet, ui) {
            ulElement.css('height', divElement.height());
        }
    }).sortable({
            placeholder:'ui-state-highlight'
        }).sortable({
            connectWith:ulElements
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