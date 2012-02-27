package service.impl;

import java.util.Date;

import service.Observer;

public class Today implements Observer {
	private Weekdays weekdays;
	
	public void update(Date date) {
		weekdays = new Weekdays();
		weekdays.addObserver(this);
	}
}
