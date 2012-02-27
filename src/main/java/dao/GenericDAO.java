package dao;

import java.util.Date;

import model.Day;

public interface GenericDAO {

	Day load(Date date);

	void save(Day day);
}
