/**
 * User: Sean
 * Date: 12-2-21
 * Time: 下午10:04
 */

$(function () {
    $( "#datepicker" ).datepicker();

    var time_Table_Element = document.getElementById("timeTable");
    var time_Table = new TimeTable(time_Table_Element);
    time_Table.load();
    time_Table.sort();
});


function TimeTable(element) {
    this.element = $(element);
    this.data = "";
}

TimeTable.prototype.refreshData = function () {
    var dataTmp = this.data;
    $.ajax({
        async:false,
        url:"timesheet.do?method=load",
        dataType:"json",
        cache:false,
        success:function (result) {
            dataTmp = toMatrix(result);
        }
    });
    this.data = dataTmp;
};

TimeTable.prototype.load = function () {
    this.refreshData();
    this.element.append($("#tableTmpl").tmpl(this.data));
};

TimeTable.prototype.save = function (dest) {
    var isModified = false;
    $.ajax({
        async:false,
        url:"timesheet.do?method=save",
        type:"post",
        dataType:"json",
        data:dest,
        success:function (data) {
            if (undefined != data.msg) {
                var $msg = $("#main .msg");
                $msg.html(data.msg);
                $msg.show("blind", {}, 1000, showMsg);
                isModified = true;
            }
        }
    });
    if (isModified) {
        this.reload();
    }
};

TimeTable.prototype.reload = function () {
    this.refreshData();
    var ulElements = this.element.find("ul");
    var table = this.data.table;
    for(var row= 0;row<table.length;++row){
        for(var col =0;col<table[row].length;++col){
            ulElements.eq((row*table[row].length)+col).html($("#traineeTmpl").tmpl(table[row][col]));
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
        name:null
    };

    var ulElements = thisObj.element.find('ul');
    var targetElement = null;
    var ulElement =null;
    var divElement = null;
    thisObj.element.on("mousedown",function(e){
        if('LI' == e.target.tagName){
            targetElement = $(e.target);
            ulElement = targetElement.parent();
            divElement= ulElement.parent();
            ulElement.css('height',divElement.height()).css('padding-bottom',0)
                .css('margin-bottom',0);
        }
    });

    ulElements.sortable({
        // opacity : 0.6,
        items:'li',
        tolerance:'pointer',
        start:function (event, ui) {
            var $item = ui.item;
            var $ulItem = $item.parent('ul');

            dest.periodFrom = $ulItem.parent('div').index() - 1;
            dest.dayFrom = $ulItem.index() - 1;
            dest.posFrom = $item.index();
        },
        stop:function (event, ui) {
            ulElement.css('height','auto').css('padding-bottom','3000px')
                .css('margin-bottom','-3000px');

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
        change:function(){
            ulElement.css('height',divElement.height());
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