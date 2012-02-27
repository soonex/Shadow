package dao.impl;

import java.util.Date;

import org.springframework.stereotype.Repository;

import model.Day;
import dao.DayDAO;

@Repository("dayDAO")
public class DayDAOImpl implements DayDAO{

	public void save(Day day){
		day.setModified(new Date());
		new GenericDAOImpl().save(day);
	}
	

	public Day findByDate(Date date) {
		return new GenericDAOImpl().load(date);
	}
}
