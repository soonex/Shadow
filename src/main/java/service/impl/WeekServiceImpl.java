package service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import model.Day;
import model.Week;
import model.WeekEnum;
import service.DayService;
import service.WeekService;

@Service("weekService")
public class WeekServiceImpl implements WeekService {

	@Resource
	DayService dayService;

	public List<Date> findAllDatesOfWeekByDate(Date date) {
		List<Date> dates = new ArrayList<Date>();

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		// last week:-1, this week: 0 , next week: 1
		calendar.add(Calendar.DATE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		for (WeekEnum weekEnum : WeekEnum.values()) {
			calendar.set(Calendar.DAY_OF_WEEK, weekEnum.ordinal() + 1);
			dates.add(calendar.getTime());
		}

		return dates;
	}

	public List<Date> findDatesOfWeekdayByDate(Date date) {
		List<Date> dates = new ArrayList<Date>();

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		// last week:-1, this week: 0 , next week: 1
		calendar.add(Calendar.DATE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		for (WeekEnum weekEnum : WeekEnum.values()) {
			if (0 == weekEnum.ordinal() || 6 == weekEnum.ordinal()) {
				continue;// skip sunday & saturday
			}
			calendar.set(Calendar.DAY_OF_WEEK, weekEnum.ordinal() + 1);
			dates.add(calendar.getTime());
		}

		return dates;
	}

	public List<Day> findDaysOfWeekByDates(List<Date> dates) {
		List<Day> days = new ArrayList<Day>();

		for (Date date : dates) {
			days.add(dayService.findByDate(date));
		}
		return days;
	}

	public Week findByDates(List<Date> dates) {
		Week week = new Week();
		List<Day> days = new ArrayList<Day>();

		for (Date date : dates) {
			days.add(dayService.findByDate(date));
		}

		week.setDays(days);
		return week;
	}

	public Week findByDate(Date date) {
		return findByDates(findDatesOfWeekdayByDate(date));
	}

	public Week findThisWeek() {
		return findByDate(new Date());
	}

	// test
	public static void main(String[] args) {
		Date date = new Date();
		date.setTime(1315491234000L);
		Week week = new WeekServiceImpl().findByDate(date);
		System.out.println(week);
	}

}
