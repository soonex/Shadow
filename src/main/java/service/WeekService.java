package service;

import java.util.Date;
import java.util.List;

import model.Week;

public interface WeekService {

	List<Date> findAllDatesOfWeekByDate(Date date);

	Week findByDates(List<Date> dates);

	Week findByDate(Date date);

	Week findThisWeek();
}
