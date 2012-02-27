package service;

import java.util.Date;

import model.Day;

public interface DayService {

	Day findByDate(Date date);

	boolean isModified(Day dayFrom, Day dayTo, long time);

	boolean transfer(Day dayFrom, Day dayTo, String name, int periodFrom,
                     int periodTo, int posFrom, int posTo);
}
