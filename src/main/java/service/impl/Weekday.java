package service.impl;

import java.util.Date;

import javax.annotation.Resource;

import model.Day;
import service.DayService;
import service.Observer;


public class Weekday implements Observer{
	
	Day day;
	
	@Resource
	DayService dayService;
	
	public void update(Date date) {
		day = dayService.findByDate(date);
	}
}
