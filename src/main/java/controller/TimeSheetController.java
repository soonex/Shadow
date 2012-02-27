package controller;

import model.Day;
import model.Week;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import service.DayService;
import service.WeekService;
import utils.MsgUtils;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/timesheet.do")
@SessionAttributes("week")
public class TimeSheetController {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	DayService dayService;
	@Resource
	WeekService weekService;

	@RequestMapping(params = "method=load", method = RequestMethod.GET)
	public String load(ModelMap model) {
		logger.info("return load timesheet view");

		Date date = new Date();
		date.setTime(1315497600000L);
		//
		// Day day = dayService.findByDate(date);
		Week week = weekService.findByDate(date);
		model.addAttribute("week", week);
		
//		List<?> rows = new ArrayList<Object>();
//		List<List<?>> columns = new ArrayList<List<?>>();
//		for(Day day : week.getDays()){
//			for(Period period : day.getPeriods()){
//				columns.add(period.getTrainees());
//			}
//		}
		
		
		model.addAttribute("data", week);
		// model.addAttribute("modified", week.getModified().getTime());
		return "timeSheetView";
	}

	@RequestMapping(params = "method=save", method = RequestMethod.POST)
	public String save(int dayFrom, int dayTo, int periodFrom, int periodTo,
			int posFrom, int posTo, String name, ModelMap model) {
		logger.info("return save timesheet view");

		Map<String, Object> data = new HashMap<String, Object>();
		
		Date date = new Date();
		date.setTime(1315497600000L);
		
		Week week = weekService.findByDate(date);
		List<Day> days = week.getDays();

		Day dayfrom = days.get(dayFrom);
		Day dayto = days.get(dayTo);

		// modified or not
		// long modified = (Long) model.get("modified");
		// if (dayService.isModified(day, modified)) {
		// data.put("msg", MsgUtils.getMsg("modified"));
		// }

		// update successfully or not
		boolean success = false;
		success = dayService.transfer(dayfrom, dayto, name, periodFrom,
				periodTo, posFrom, posTo);

		if (!success) {
			data.put("msg", MsgUtils.getMsg("failure"));
		}

		model.addAttribute("data", data);
		return "timeSheetView";
	}
}
