package dao;

import java.util.Date;

import model.Day;

public interface DayDAO {
	
	void save(Day day);

	Day findByDate(Date date);
	
}
