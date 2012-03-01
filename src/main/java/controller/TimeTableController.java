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
@RequestMapping("/timetable.do")
@SessionAttributes("week")
public class TimeTableController {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    DayService dayService;
    @Resource
    WeekService weekService;

    /**
     *
     * @param model ModelMap
     * @param time time of the selected date
     * @return timetableView
     */
    @RequestMapping(params = "method=load", method = RequestMethod.GET)
    public String load(ModelMap model,String time) {
        logger.info("load time table");

        Date date = new Date();
        if(!"null".equals(time)){
            date.setTime(Long.parseLong(time));
        }

        Week week = weekService.findByDate(date);
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("week",week);
        result.put("selectedDate", date);
        model.addAttribute("result",result);

        return "timetableView";
    }


    @RequestMapping(params = "method=save", method = RequestMethod.POST)
    public String save(ModelMap model,int dayFrom, int dayTo, int periodFrom, int periodTo,
                       int posFrom, int posTo, long time ,String name) {
        logger.info("save time table");

        Map<String, Object> result = new HashMap<String, Object>();

        Date date = new Date();
        date.setTime(time);

        Week week = weekService.findByDate(date);
        List<Day> days = week.getDays();

        Day dayfrom = days.get(dayFrom);
        Day dayto = days.get(dayTo);

        // update successfully or not
        boolean success = dayService.transfer(dayfrom, dayto, name, periodFrom,
                periodTo, posFrom, posTo);

        result.put("time",date.getTime());
        if (!success) {
            result.put("msg", MsgUtils.getMsg("failure"));
        }

        model.addAttribute("result", result);
        return "timetableView";
    }
}
