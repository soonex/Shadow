
$(function() {
	loadSheet();
});

function loadSheet() {
	getData();
	buildSheet();
	sortableSheet();
}

function buildSheet() {
	/* initial periods */
	var $week = $('#week');
	$('#week').append($("#tableTmpl").tmpl($week.data('store')));
}

function reload() {
	getData();
	$.each($weekdays, function(index, item) {
		var $periods = $weekdays.eq(index).children();
		$.each($periods, function(indx, itm) {
			$periods.eq(indx).html(
					$("#traineeTmpl").tmpl(
							store.days[index].periods[indx].trainees));
		});
		$periods = null;
	});
}

function saveSheet(dest) {
	$.ajax( {
		async : false,
		url : "timesheet.do?method=save",
		type : "post",
		dataType : "json",
		data : dest,
		success : function(data) {
			if (undefined != data.msg) {
				var $msg = $("#msg");
				$msg.find('p').html(data.msg);
				$msg.show("blind", {}, 1500, callback);
				reload();
			}
		}
	});
	dest = null;
	// reload();
}

function sort() {
	var dest = {
		dayFrom : null,
		dayTo : null,
		periodFrom : null,
		periodTo : null,
		posFrom : null,
		posTo : null,
		name : null
	};

	// $($(this).parent())
	$('#week').children().children().sortable( {
		// opacity : 0.6,
		items : 'li',
		tolerance : 'pointer',
		start : function(event, ui) {
			var $item = ui.item;
			var $ulItem = $item.parent('ul');

			dest.periodFrom = $ulItem.parent('div').index() - 1;
			dest.dayFrom = $ulItem.index() - 1;
			dest.posFrom = $item.index();
		},
		stop : function(event, ui) {
			var $item = ui.item;
			var $ulItem = $item.parent('ul');

			dest.periodTo = $ulItem.parent('div').index() - 1;
			dest.dayTo = $ulItem.index() - 1;
			dest.posTo = $item.index();
			dest.name = $.text(ui.item);
			(null == dest.periodTo) ? "" : saveSheet(dest);
		}
	}).sortable( {
		placeholder : 'ui-state-highlight'
	}).sortable( {
		connectWith : 'ul'
	}).disableSelection();
}

function sortableSheet() {

	$('#week').live("mouseenter", sort);
	// .bind("mouseleave", unsort);

};

function tableArray(dayAmount, periodAmount) {
	var table = new Array(periodAmount);
	for ( var i = 0; i < table.length; i++)
		table[i] = new Array(dayAmount);

	for ( var row = 0; row < table.length; row++) {
		for (col = 0; col < table[row].length; col++) {
			table[row][col] = new Array();
		}
	}
	return table;
}

function dataTransform(data) {
	var days = data.days;
	var periods = days[0].periods;
	var table = tableArray(days.length, periods.length);

	$.each(days, function(indexOfDay, day) {
		$.each(day.periods, function(indexOfPeriod, period) {
			table[indexOfPeriod][indexOfDay] = table[indexOfPeriod][indexOfDay]
					.concat(period.trainees);
		});
	});
	var weektable = {};
	weektable.table = table;
	return weektable;
}

function getData() {
	$.ajax( {
		async : false,
		url : "timesheet.do?method=load",
		dataType : "json",
		cache : false,
		success : function(data) {
			var store = dataTransform(data);
			$('#week').data('store', store);
			data = null;
		}
	});
}

/* display msg panel */
function callback() {
	setTimeout(function() {
		$("#msg").hide("blind", {}, 1500);
	}, 4000);
}
