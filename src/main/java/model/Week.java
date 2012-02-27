package model;

import java.util.Date;
import java.util.List;

public class Week {

	private Date firstDateOfWeek;
	private List<Day> days;
	private List<String> times;

	public List<Day> getDays() {
		return days;
	}

	public void setDays(List<Day> days) {
		this.days = days;
	}

	public List<String> getTimes() {
		return times;
	}

	public void setTimes(List<String> times) {
		this.times = times;
	}

	public Date getFirstDateOfWeek() {
		return firstDateOfWeek;
	}

	public void setFirstDateOfWeek(Date firstDateOfWeek) {
		this.firstDateOfWeek = firstDateOfWeek;
	}
}