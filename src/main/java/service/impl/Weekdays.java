package service.impl;

import java.util.ArrayList;
import java.util.List;

import service.Observer;
import service.Subject;

public class Weekdays implements Subject {

	private List<Observer> observers = new ArrayList<Observer>();

	public void dateChanged() {
		notifyObservers();
	}

	public void addObserver(Observer o) {
		observers.add(o);
	}

	public void deleteObserver(Observer o) {
		int i = observers.indexOf(o);
		if (i > 0) {
			observers.remove(o);
		}
	}

	public void notifyObservers() {
		//TODO
	}

	// public static class CurrentWeek {
	// static final Weekdays INSTANCE = new Weekdays();
	// }
	//
	// public static Weekdays getInstance() {
	// return CurrentWeek.INSTANCE;
	// }

}
